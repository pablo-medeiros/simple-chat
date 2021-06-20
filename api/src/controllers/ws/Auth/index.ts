import { Socket } from "socket.io";
import { connectionUsers, DataUser } from "src/database";
import Encrypt from "src/Encrypt";
import Chat from '../Chat';

export default (socket: Socket) => {
  console.log(`New connection: ${socket.id}`)
  const register = () => {
    socket.on('auth', listen);
  }
  const unRegister = () => {
    socket.off('auth', listen);
  }
  const listen = async ({ type, email, name, password }: AuthData) => {
    if (!email || !password || (type === 'register' && !name)) {
      socket.emit('auth-error', {
        email: !email ? 'Is required' : undefined,
        password: !password ? 'Is required' : undefined,
        name: type === 'register' && !name ? 'Is required' : undefined,
      })
      return;
    }
    try {
      const user: DataUser = await new Promise(async (resolve, reject) => {
        if (type === 'register') {
          if (await connectionUsers().select('id').where({
            email,
          }).first()) {
            reject({
              email: 'Is registered',
            });
          } else {
            await connectionUsers().insert({
              email,
              name,
              created_at: Date.now(),
              last_entry: Date.now(),
              password: await Encrypt(password),
            });
            resolve({... (await connectionUsers().select('*').where({
              email,
            }).first()),last_entry: 1618935646375})
          }
        } else {
          const user = await connectionUsers().select('*').where({
            email,
            password: await Encrypt(password),
          }).first();
          if (user) {
            await connectionUsers().update({
              last_entry: Date.now()
            }).where({ id: user.id });
            resolve(user);
          } else reject({
            email: 'Not registered',
            password: 'Or invalid',
          })
        }
      });
      socket['user'] = {
        ...user,
        last_entry: new Date(user.last_entry),
        created_at: new Date(user.created_at)
      } as User;
      socket['logout'] = () => {
        delete socket['user'];
        socket.removeAllListeners()
        register();
      };
      socket.emit('auth-success', {
        ...socket['user'],
        password: undefined,
      })
      Chat(socket as AuthSocket);
      unRegister();
    } catch (err) {
      socket.emit('auth-error', err);
    }
  }
  register();
}

export type User = DataUser & {
  created_at: Date;
  last_entry: Date;
}

export interface AuthSocket extends Socket {
  user: User;
  logout: () => void;
}

type AuthData = {
  type: 'login' | 'register'
  email: string;
  password: string;
  name?: string;
}
