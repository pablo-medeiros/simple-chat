import React, { createRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Input, { InputChangeEvent, InputRef } from '../../components/Input';
import { User } from '../../components/Message';
import useSocket from '../../hooks/useSocket';
import { Container, Main } from './styles';

type Type = 'login' | 'register'

const Auth: React.FC = () => { 
  const [type, setType] = useState<Type>('register');
  const nameRef = createRef<InputRef>();
  const emailRef = createRef<InputRef>();
  const passwordRef = createRef<InputRef>();
  const history = useHistory();
  const socket = useSocket();
  function handleSubmit() {
    function validate(ref: InputRef, fn:(e: InputChangeEvent)=>void){
      var error = undefined;
      fn({
        value: ref.value,
        sendError: (err)=>error=err,
        clearError: ()=>error=undefined
      });
      if(error!==ref.error)ref.setError(error)
      return !error;
    }
    if(type==='register'&&!validate(nameRef.current!,handleChangeName))return;
    if(!validate(emailRef.current!,handleChangeEmail)||!validate(passwordRef.current!,handleChangePassword))return;
    console.log('Emit')
    socket.emit('auth',{
      type,
      name: nameRef.current?.value||undefined,
      email: emailRef.current?.value,
      password: passwordRef.current?.value
    })
  }
  function handleType(_type: Type) {
    return () => {
      if (type === _type) return;
      setType(_type);
    }
  }
  function handleChangeName(e: InputChangeEvent) {
    const password = e.value;
    if (password.length >= 3 && password.length <= 30) {
      e.clearError();
    } else {
      e.sendError('minimum of 3 and maximum of 30')
    }
  }
  function handleChangeEmail(e: InputChangeEvent) {
    // eslint-disable-next-line no-useless-escape
    const r = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const email = e.value;
    if (r.test(email.toLowerCase())) {
      e.clearError();
    } else {
      e.sendError('Invalid email')
    }
  }
  function handleChangePassword(e: InputChangeEvent) {
    const password = e.value;
    if (password.length >= 8 && password.length <= 25) {
      e.clearError();
    } else {
      e.sendError('minimum of 8 and maximum of 25');
    }
  }
  useEffect(()=>{
    const offSuccess = socket.on('auth-success',(data: User)=>{
      socket.setUser(data);
      history.push('/chat')
    })
    const offError = socket.on('auth-error',(data)=>{
      if(data['name']){
        nameRef.current?.setError(data['name'])
      }
      if(data['email']){
        emailRef.current?.setError(data['email'])
      }
      if(data['password']){
        passwordRef.current?.setError(data['password'])
      }
    })
    return ()=>{
      offSuccess();
      offError();
    }
  },[socket,nameRef,emailRef,passwordRef,history])
  return (
    <Container>
      <Main>
        <section className="types">
          <span onClick={handleType('login')} className={`login${type === 'login' ? ' selected' : ''}`}>Sign in</span>
          <span onClick={handleType('register')} className={`register${type === 'register' ? ' selected' : ''}`}>Sign up</span>
        </section>
        <section className="form">
          {type === 'register' && (
              <Input
                display="Name:"
                placeholder="Your name"
                type="text"
                ref={nameRef}
                onChange={handleChangeName}
              />
          )}
          <Input
            display="Email:"
            placeholder="your@example.com"
            type="email"
            ref={emailRef}
            onChange={handleChangeEmail}
          />
          <Input
            display="Password:"
            placeholder="12345678"
            type="password"
            ref={passwordRef}
            onChange={handleChangePassword}
          />
          <button onClick={handleSubmit}>{type === 'login' ? 'Sign in' : 'Sign up'}</button>
        </section>
        <img src="/icon.png" alt="Simple chat icon" />
      </Main>
    </Container>
  );
}

export default Auth;