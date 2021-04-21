export default (fn:(...data: any[])=>void,wait: number)=>{
  var time: any;
  return (...data: any[])=>{
    clearTimeout(time);
    time=setTimeout(()=>{
      fn(...data);
    },wait)
  }
}