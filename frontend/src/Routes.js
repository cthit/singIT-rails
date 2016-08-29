import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Start from './components/start';
import App from './App';


const routes = (
    <Route path="/" component={App}>
        <IndexRoute component={Start}/>
    </Route>
);

export default routes;