import React, { lazy, Suspense } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import Layout from 'antd/lib/layout';
import Spin from 'antd/lib/spin';
import './App.scss';

const { Header, Content, Footer } = Layout;

const routes = [
  {
    path: '/',
    exact: true,
    loader: () => import(/* webpackChunkName: "home" */ './components/Home')
  },
  {
    path: '/sakuras',
    loader: () => import(/* webpackChunkName: "sakuras" */ './components/Sakuras')
  },
  {
    path: '/login',
    loader: () => import(/* webpackChunkName: "login" */ './components/Login')
  },
  {
    path: '*',
    loader: () => import(/* webpackChunkName: "notfound" */ './components/NotFound')
  },
]

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
          <Suspense fallback={<Spin delay={200} />}>
            <Switch>
              {routes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  exact={route.exact === true}
                  component={lazy(route.loader)}
                />
              ))}
            </Switch>
          </Suspense>
        </Content>
        <Footer>
          Copyright 2018 mingzuozhibi.com
        </Footer>
      </Layout>
    </div>
  )
}

export default App;
