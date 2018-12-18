import React from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import Layout from 'antd/lib/layout';

import Home from './components/Home';
import NotFound from './components/NotFound';
import Sakuras from './components/Sakuras';
import './App.scss';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Header>
          <NavLink to="/" exact={true}>Home</NavLink>
          <NavLink to="/sakuras">Sakuras</NavLink>
          <span className="right">
            <NavLink to="/login">Login</NavLink>
          </span>
        </Header>
        <Content>
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/sakuras" component={Sakuras} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Content>
        <Footer>
          Copyright 2018 mingzuozhibi.com
        </Footer>
      </Layout>
    </div>
  )
}

export default App;
