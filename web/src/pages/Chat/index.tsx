import React, { createRef, useEffect, useState } from 'react';
import { MdSend } from 'react-icons/md';
import { useHistory } from 'react-router';
import { User } from '../../components/Message';
import Messages, { MessageData, MessagesRef } from '../../components/Messages';
import Textarea, { TextareaRef } from '../../components/Textarea';
import useSocket from '../../hooks/useSocket';
import { Container } from './styles';

interface Setup {
  messages: MessageData[],
  users: User[]
}
 
const Chat: React.FC = () => {
  const [setup,setSetup] = useState<Setup>();
  const messagesRef = createRef<MessagesRef>();
  const textareaRef = createRef<TextareaRef>();
  const socket = useSocket();
  const history = useHistory();
  function handleSend(){
    const value = textareaRef.current!.value;
    if(value.length>0&&value.length<4000){
      messagesRef.current!.sendMessage(value);
      textareaRef.current!.setValue('')
    }
  }
  useEffect(()=>{
    const offSetup = socket.on('setup',(setup: Setup)=>{
      setSetup(setup);
    });
    const offDisconnect = socket.on('disconnect',()=>{
      history.push('/');
    });
    return ()=>{
      offSetup();
      offDisconnect();
    }
  },[socket,history])
  return (
    <Container>
      <Messages ref={messagesRef} messagesData={setup?.messages}/>
      <footer>
        <Textarea
          ref={textareaRef}
          onSend={handleSend}
          line={{
            min: 1,
            max: 3
          }}
        />
        <MdSend onClick={handleSend}/>
      </footer>
    </Container>
  );
}

export default Chat;