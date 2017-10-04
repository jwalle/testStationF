import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import App from './components/App.jsx';

import NotFoundPage from './components/NotFoundPage.jsx';
import rooms from './components/ContentPage.jsx';
import Calendar from './components/Calendar.jsx'

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={rooms} />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
), document.getElementById('root'));