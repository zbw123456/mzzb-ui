import React, { lazy, Suspense } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import Layout from 'antd/lib/layout';
import Spin from 'antd/lib/spin';
import routes from './routes';
import './App.scss';

const { Header, Content, Footer } = Layout;

function App() {
  const menus = routes.filter(route => Boolean(route.title))
  return (
    <div className="App">
      <Layout>
        <Header>
          {menus.map(menu => (
            <NavLink
              to={menu.path}
              key={menu.title}
              exact={menu.exact === true}
            >
              {menu.title}
            </NavLink>
          ))}
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
