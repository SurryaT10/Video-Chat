import React from 'react';
import { Switch, Route} from 'react-router-dom';
import JoinRoom from '../components/JoinRoom/JoinRoom';
import ChatRoom from '../components/ChatRoom/ChatRoom';

const Routes = () => (
    <Switch>
        <Route exact path="/" component={JoinRoom} />
        <Route exact path="/room/:id" component={ChatRoom} />
    </Switch>
);

export default Routes;