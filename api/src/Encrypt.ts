import crypto from 'crypto';


export default (data: string):Promise<string> =>{
  return new Promise((resolve)=>{
    const hash = crypto.createHash('sha256');
    hash.update(data);
    resolve(hash.digest('hex'));
  });
}