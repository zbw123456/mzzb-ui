import React, { lazy, Suspense } from 'react';
import { RouteChildrenProps } from 'react-router';
import { Switch, Route, withRouter } from 'react-router-dom';
import Layout from 'antd/lib/layout';
import Spin from 'antd/lib/spin';
import Menu from 'antd/lib/menu';
import routes from './routes';
import './App.scss';

const { Header, Content, Footer } = Layout;

function App({ location, history }: RouteChildrenProps) {
  const menus = routes.filter(route => Boolean(route.title))
  return (
    <div className="App">
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
            defaultSelectedKeys={[location.pathname]}
            onSelect={param => history.push(param.key)}
          >
            {menus.map(menu => (
              <Menu.Item key={menu.path}>{menu.title}</Menu.Item>
            ))}
            <Menu.Item className='right' key="/login">Login</Menu.Item>
          </Menu>
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

export default withRouter(App);
