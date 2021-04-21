import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import Auth from './pages/Auth';
import Chat from './pages/Chat';

const Routes: React.FC = ()=>{
  return (
    <MemoryRouter>
      <Switch>
        <Route path="/" component={Auth} exact/>
        <Route path="/chat" component={Chat}/>
      </Switch>
    </MemoryRouter>
  )
}

export default Routes;
