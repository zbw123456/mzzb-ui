import React from 'react';
import './App.scss';
import { Switch, Route, Link } from 'react-router-dom';
import Sakuras from './components/Sakuras';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Header>
          <Link to="/">Home</Link>
          <Link to="/sakuras">Sakuras</Link>
        </Header>
        <Content>
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
        </Content>
        <Footer>
          Copyright 2018 mingzuozhibi.com
        </Footer>
      </Layout>
    </div>
  )
}

export default App;
