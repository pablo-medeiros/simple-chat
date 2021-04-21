import { Knex } from 'knex';
import * as n from 'nested-knex';
import connection, { connectionMessages, connectionUsers } from "src/database";
import { AuthSocket } from "../Auth";

const connecteds:AuthSocket[] = [];

const broadcast = (event: string, data: any,ignore?: AuthSocket)=>{
  connecteds.forEach(s=>{
    if(ignore?.id===s.id)return;
    s.emit(event,data);
  })
}
const formatMessage = async(fn: (query:Knex.QueryBuilder<any, unknown[]>)=>Knex.QueryBuilder<any, unknown[]>)=>{
  const messages = await n.array(n.type({
    id: n.number('messages.id'),
    contents: n.string('messages.contents'),
    created_at: n.number('messages.created_at'),
    author: n.type({
      id: n.number('users.id'),
      name: n.string('users.name'),
      email: n.string('users.email'),
      status: n.number('users.status'),
      last_entry: n.number('users.last_entry')
    })
  })).withQuery(fn(connectionMessages().leftJoin('users','users.id','messages.user_id')) as any)
  return messages.map((msg)=>({
    ...msg,
    created_at: new Date(msg.created_at),
    author: {
      ...msg.author,
      last_entry: new Date(msg.author.last_entry)
    }
  }))
}

export default async (socket: AuthSocket)=>{
  if(!socket['user']){
    if(socket.logout)socket.logout();
    return;
  }
  const connectedUser = await connectedFind(s=>s.user.id===socket.user.id);
  if(connectedUser){
    connectedUser.logout();
  }
  connecteds.push(socket);
  socket.on('send_message',async ({reference,contents}: {reference: any,contents:string})=>{
    if(contents&&contents.length>0&&contents.length<4000){
      const id = (await connectionMessages().insert({
        contents,
        user_id: socket.user.id,
        created_at: Date.now(),
      }))[0]
      const message = (await formatMessage((query)=>query.where('messages.id','=',id)))[0]
      socket.emit('send_message',{
        ...message,
        created_at: message.created_at.toUTCString(),
        type: 'me',
        reference
      })
      broadcast('new_message',{
        ...message,
        created_at: message.created_at.toUTCString(),
        type: 'other'
      },socket);
      return;
    }
    socket.emit('delete_message',{
      reference
    })
  })
  socket.on('delete_message',async(id)=>{
    await connection.transaction(async trx=>{
      if(await connectionMessages().select('id').where({
        id,
        user_id: socket.user.id
      }).first().transacting(trx)){
        await connectionMessages().delete().where({id}).transacting(trx);
        broadcast('delete_message',{id});
      }
    })
  })
  socket.on('disconnect',async()=>{
    const disconnectUser = await connectedFind((s)=>s.id===socket.id);
    if(!disconnectUser.user)return;
    const date = new Date();
    await connectionUsers().update({
      last_entry: date.getTime(),
      status: 0,
    }).where({
      id: disconnectUser.user.id
    });
    broadcast('user_disconnect',{
      id: disconnectUser.id,
      last_entry: date.toUTCString(),
      status: 0,
    });
  })  
  const newMessages = await formatMessage(query=>query);
  socket.emit('setup',{
    messages: newMessages.map(msg=>({
      ...msg,
      type: msg.author.id===socket.user.id?'me':'other',
      created_at: msg.created_at.toUTCString(),
    })),
    users: connecteds.map(s=>({
      id: s.user.id,
      name: s.user.name,
      status: s.user.status,
      last_entry: s.user.last_entry.toUTCString(),
    }))
  })
  broadcast('user_connected',{
    id: socket.user.id,
    name: socket.user.name,
    status: socket.user.status,
    last_entry: socket.user.last_entry.toUTCString(),
  },socket)
}

async function connectedFind(fn: (s: AuthSocket)=>Promise<boolean>|boolean){
  for(var i = 0; i<connecteds.length;i++){
    if(await fn(connecteds[0])){
      return connecteds.splice(i,1)[0];
    }
  }
  return undefined;
}