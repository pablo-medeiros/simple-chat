import React, { HTMLAttributes, KeyboardEvent, useImperativeHandle, useRef, useState } from 'react';

interface Props extends HTMLAttributes<HTMLTextAreaElement>{
  line: {
    min: number;
    max: number;
  }
  onSend: ()=>void;
}

export interface TextareaRef {
  value: string;
  setValue: (value: string)=>void
}

const Textarea: React.ForwardRefRenderFunction<TextareaRef,Props> = ({
  line,onSend,...props
},ref) => {
  const [value,setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(
    ref,
    () => ({
      value,
      setValue: (txt)=>{
        textareaRef.current!.value=""
        setValue(txt);
      }
    }),
    [value],
  )
  function resize(){
    const elm = textareaRef.current!;
    elm.style.height="auto";
    var lines = (elm.scrollHeight-10)/28;
    if(lines>line.max)lines=line.max;
    if(lines<line.min)lines=line.min;
    console.log(lines);
    lines=(lines*28)+10;
    elm.style.height=`${lines}px`;
    setValue(elm.value);
  }
  function handleKeyPress(e: KeyboardEvent<HTMLTextAreaElement>){
    switch(e.key.toLowerCase()){
      case "enter": {
        if(!e.shiftKey){
          e.preventDefault();
      e.stopPropagation();
      onSend();
        }
        return;
      }
    }
  }
  return (
    <textarea 
      rows={line.min} 
      {...props} 
      ref={textareaRef}
      defaultValue={value}
      onKeyPress={handleKeyPress}
      onChange={resize}
      onCut={resize}
      onPaste={resize}
      onDrop={resize}
    ></textarea>
  );
}

export default React.forwardRef(Textarea);