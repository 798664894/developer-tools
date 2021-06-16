/*
 * @Descripttion: router配置文件
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-13 18:10:54
 */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/tools'
    },
    {
      path: '/tools',
      name: 'tools',
      meta: { title: '主页' },
      component: () => import('./views/tools/index.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
