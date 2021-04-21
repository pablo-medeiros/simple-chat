import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { Container } from './styles';

export interface User {
  id: number;
  name: string;
  email: string;
  status: number;
  last_entry: number;
}

export interface Message {
  id?: number;
  contents: string;
  created_at: Date;
  author?: User;
  type: 'me'|'other'
  reference?: string;
}

interface Props {
  message: Message;
  onDelete: (message: Message)=>void
}

const Message: React.FC<Props> = ({
  message,
  onDelete
}) => {
  
  function handleDelete(){
    onDelete(message);
  }
  return (
    <Container className={message.type}>
      <section>
        {message.type==='other'&&message.author&&(
          <div>
            <span>{message.author.name}</span>
            <span>~{message.author.email}</span>
          </div>
        )}
        <p className="contents">{message.contents}</p>
        <span>{formatDate(message.created_at)}</span>
      </section>
      {message.type==='me'&&!!message.id&&(
        <FiTrash2 onClick={handleDelete}/>
      )}
    </Container>
  );
}

export default Message;

function formatDate(date: Date){
    var day = String(date.getDate()).padStart(2,'0');
    var month = String(date.getMonth()+1).padStart(2,'0');
    var hours = String(date.getHours()).padStart(2,'0');
    var minutes = String(date.getMinutes()).padStart(2,'0');
    return `${hours}:${minutes} ${day}/${month}`;
}