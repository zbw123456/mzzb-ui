export default [
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
