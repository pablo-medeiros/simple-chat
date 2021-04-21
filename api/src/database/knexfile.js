import path from 'path';

var defaultPath;

try{
  defaultPath=__dirname;
}catch(_ignored){
  defaultPath="";
}

export default {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(defaultPath,'data.db')
  },
  migrations:{
    directory: path.resolve(defaultPath,'migrations')
  },
  useNullAsDefault: true,
  
};


