import authRoutes from './auth-routes';

export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './Login',
      },
      {
        name: 'forget-pwd',
        path: '/user/forget-pwd',
        component: './ForgetPwd',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        routes: [
          {
            path: '/',
            redirect: '/project',
          },
          {
            path: '/project',
            name: 'project',
            component: './Project',
            icon: 'BankOutlined',
          },
          ...authRoutes,
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
