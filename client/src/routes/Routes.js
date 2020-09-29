import React from 'react';
import { Switch, Route} from 'react-router-dom';
import JoinRoom from '../components/JoinRoom/JoinRoom';
import ChatRoom from '../components/ChatRoom/ChatRoom';
import VideoChat from '../components/VideoChat/VideoChat';
import ShowPerformance from '../components/ShowPerformance/ShowPerformance';

const Routes = () => (
    <Switch>
        <Route exact path="/" component={JoinRoom} />
        <Route exact path="/room/:id" component={ChatRoom} />
        <Route exact path="/performance" component={ShowPerformance} />
    </Switch>
);

export default Routes;