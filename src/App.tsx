import React from 'react';
import './App.scss';
import { Switch, Route, Link } from 'react-router-dom';
import Sakuras from './components/Sakuras';

function App() {
  return (
    <div className="App">
      <header>
        <Link to="/">Home</Link>
        <Link to="/sakuras">Sakuras</Link>
      </header>
      <Switch>
        <Route path="/" exact={true}>
          <div className="text-content">Hello, This is home page.</div>
        </Route>
        <Route path="/sakuras" component={Sakuras} />
        <Route path="*">
          {({ location }) => (
            <div className="text-content">404 Not Found: {location.pathname}</div>
          )}
        </Route>
      </Switch>
    </div>
  )
}

export default App;
