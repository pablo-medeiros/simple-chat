import React, { useEffect, useImperativeHandle, useState } from 'react';
import { v4 } from 'uuid';
import useAutoScroll from '../../hooks/useAutoScroll';
import useSocket from '../../hooks/useSocket';
import MessageComponent, { Message } from '../Message';
import { Container } from './styles';


interface Props {
  messagesData?: MessageData[];
}

export interface MessagesRef {
  sendMessage: (contents: string)=>void
}

export type MessageData = Omit<Message,'created_at'>&{
  created_at: string;
}

const Messages: React.ForwardRefRenderFunction<MessagesRef,Props> = ({
  messagesData, ...props
},ref) => {
  const [messages,setMessages] = useState<MessageData[]>([]);
  const [containerRef] = useAutoScroll<HTMLUListElement>([messages])
  const socket = useSocket();
  useEffect(()=>{
    const offSend_message = socket.on('send_message',(message: MessageData)=>{
      setMessages([...messages.map(msg=>{
        if(msg.reference===message.reference){
          return message;
        }
        return msg;
      })])
    })
    const offNew_message = socket.on('new_message',(message: MessageData)=>{
      setMessages([
        ...messages,
        message,
      ])
    })
    const offDelete_message = socket.on('delete_message',(message: MessageData)=>{
      setMessages([...messages.filter(msg=>{
        var b = message.reference?msg.reference!==message.reference:msg.id!==message.id;
        console.log(b||msg);
        return b;
      })]);
    })
    return ()=>{
      offSend_message();
      offNew_message();
      offDelete_message();
    }
  },[messages,socket])
  useEffect(()=>{
    if(messagesData){
      const newMessages = messagesData.filter(m=>!messages.find(m2=>m2.id===m.id));
      if(newMessages.length>0){
        setMessages([
          ...newMessages,
          ...messages
        ].sort((a,b)=>{
          const d1 = new Date(a.created_at).getTime();
          const d2 = new Date(b.created_at).getTime();
          return d1>d2?1:-1;
        }))
      }
    }
  },[messagesData,messages])
  useImperativeHandle(ref,()=>({
    sendMessage: (contents)=>{
      const reference = v4();
      socket.emit('send_message',{
        reference,
        contents
      })
      setMessages([
        ...messages,
        {
          contents,
          created_at: new Date().toUTCString(),
          type: 'me',
          reference,
        }
      ])
    }
  }),[messages,socket])
  function handleDelete(message: Message){
    if(message.id)socket.emit('delete_message',message.id)
  }
  return (
    <Container ref={containerRef}>
      {messages&&messages.map((message,i)=>(
        <MessageComponent 
          key={i}
          message={{
            ...message,
            created_at: new Date(message.created_at)
          }}
          onDelete={handleDelete}
        />
      ))}
    </Container>
  );
}

export default React.forwardRef(Messages);