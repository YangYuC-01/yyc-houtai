import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login'
import Home from '@/views/Home'
import Welcome from '@/views/Home/components/WelCome.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/home/Welcome',
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: Welcome
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/users')
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/views/roles')
      },
      {
        path: 'rights',
        name: 'rights',
        component: () => import('@/views/rights')
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/views/commodity/commodityList')
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/commodity/commodityList/AddCommodity.vue')
      },
      {
        path: 'params',
        name: 'params',
        component: () => import('@/views/commodity/classifyData')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/views/commodity/commodityClassify')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/views/orders')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/views/reports')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
