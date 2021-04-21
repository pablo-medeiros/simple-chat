import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { User } from '../components/Message';

const defaultValue = {
  socket: undefined as SocketIOClient.Socket|undefined,
  on: (event: string, fn: (...data: any[])=>void)=> ()=>{},
  emit: (event:string, ...data: any[])=>{},
  user: undefined as User|undefined,
  setUser: (user: User)=>{}
}

const SocketContext = React.createContext(defaultValue);

export const SocketContextProvider: React.FC = ({children}) => {
  const [user,setUser] = useState<User>();
  const [socket,setSocket] = useState<SocketIOClient.Socket>();
  const value = {
    socket,
    user,
    setUser,
    on: (event: string, fn: (...data: any[])=>void)=>{
      socket?.on(event,fn);
      return ()=>socket?.off(event,fn);
    },
    emit: (event:string, ...data: any[])=>{
      socket?.emit(event,...data);
    },
  }
  useEffect(()=>{
    if(!socket)setSocket(io('http://localhost:3333',{
      transports: [
        'websocket',
        'polling'
      ],
      upgrade: true
    }));
  },[socket])
  return (
    <SocketContext.Provider
      value={value}
    >
      {children}
    </SocketContext.Provider>
  );
}

const useSocket = () => {
  return useContext(SocketContext);
}

export default useSocket;
