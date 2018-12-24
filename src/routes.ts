export default [
  {
    path: '/',
    exact: true,
    title: 'Home',
    loader: () => import(/* webpackChunkName: "home" */ './components/Home')
  },
  {
    path: '/sakuras',
    title: 'Sakuras',
    loader: () => import(/* webpackChunkName: "sakuras" */ './components/Sakuras')
  },
  {
    path: '/discs/sakura/:search',
    loader: () => import(/* webpackChunkName: "discs" */ './components/DiscsSakura')
  }, {
    path: '/login',
    loader: () => import(/* webpackChunkName: "login" */ './components/Login')
  },
  {
    path: '*',
    loader: () => import(/* webpackChunkName: "notfound" */ './components/NotFound')
  },
]
