import React, { useImperativeHandle, useState } from 'react';

interface Props {
  display: string;
  placeholder: string;
  type: 'text'|'email'|'password'|'number';
  onChange?: (event: InputChangeEvent)=>void;
  defaultValue?: string;
}

export interface InputRef {
  value: string;
  error?: string;
  setError: (error?: string)=>void;
  setValue: (value:string)=>void;
}

export interface InputChangeEvent {
  value: string,
  sendError: (text: string)=>void;
  clearError: ()=>void;
}

const Input: React.ForwardRefRenderFunction<InputRef,Props> = ({
  display,type,placeholder,onChange,defaultValue
},ref) => {
  const [value,setValue] = useState<string>(defaultValue||'');
  const [error,setError] = useState<string|undefined>();
  useImperativeHandle(
    ref,
    () => ({
      value,
      error,
      setError,
      setValue
    }),
    [value,error],
  );
  return (
    <label className={`input${error?' error':''}`}><p>{display}<span>{error}</span></p>
      <input type={type} defaultValue={value} placeholder={placeholder} onChange={(e)=>{
        const value = e.currentTarget.value;
        if(onChange)onChange({
          value,
          sendError: (text)=>{
            if(text!==error)setError(text)
          },
          clearError: ()=>{
            if(error)setError(undefined)
          }
        })
        setValue(value);
      }} />
    </label>
  );
}

export default React.forwardRef(Input);