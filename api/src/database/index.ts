import knex from 'knex';
import configuration from './knexfile';

const connection = knex(configuration);

export const connectionUsers = ()=>connection<DataUser>('users');
export const connectionMessages = ()=>connection<DataMessage>('messages');

export default connection;

export interface DataUser {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: number;
  last_entry: number;
  status: 0|1|2;
}

export interface DataMessage {
  id: number;
  contents: string;
  user_id: number;
  created_at: number;
}