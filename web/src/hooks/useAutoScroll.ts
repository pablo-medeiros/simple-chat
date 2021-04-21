import { useEffect, useRef, useState } from 'react';

type UseAutoScroll<T> = [
  React.RefObject<T>,
  boolean
]

const useAutoScroll = <T extends HTMLElement>(deps?: React.DependencyList):UseAutoScroll<T> =>{
  const [autoScroll, setAutoScroll] = useState(true);
  const elementRef = useRef<T>(null);
  useEffect(()=>{
    let inter: any;
    if(autoScroll){
      inter = setTimeout(()=>{
        let elm = elementRef.current;
        if(!elm)return;
        let position = elm.scrollTop+elm.offsetHeight+50;
        if(position>=elm.scrollHeight)return;
        elm.scrollTo({
          top: elm.scrollHeight,
          behavior: 'smooth'
        })
      },30)
    }
    const listen = (e: React.UIEvent<T>)=>{
      let elm = e.currentTarget;
      let position = elm.scrollTop+elm.offsetHeight+50;
      if(position>=elm.scrollHeight){
        if(!autoScroll)setAutoScroll(true)
      }else{
        if(autoScroll)setAutoScroll(false);
      }
    }
    elementRef.current?.addEventListener('scroll',listen as any)
    return ()=>{
      clearTimeout(inter);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      elementRef.current!.removeEventListener('scroll',listen as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[autoScroll,elementRef,...(deps||[])])
  return [elementRef,autoScroll];
}

export default useAutoScroll;