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
import store from './store/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/redirect'
    },
    {
      path: '/redirect',
      name: 'redirect',
      meta: { title: '重定向' },
      component: () => import('./views/redirect/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: '登录' },
      component: () => import('./views/login/index.vue')
    },
    {
      path: '/tools',
      name: 'tools',
      meta: { title: '主页' },
      component: () => import('./views/tools/index.vue')
    },
    // 具有公共头部，脚部的放在layout的children中
    {
      path: '/',
      name: 'layout',
      component: () => import('./components/layout.vue'),
      children: [
        {
          path: 'wardWhiteboard',
          name: 'wardWhiteboard',
          meta: { title: '电子白板', keepAlive: true },
          component: () => import('./views/wardWhiteboard/index.vue')
        },
        {
          path: 'bedList',
          name: 'bedList',
          meta: { title: '床位列表' },
          component: () => import('./views/bedList/index.vue')
        },
        {
          path: 'handover',
          name: 'handover',
          meta: { title: '辅助交班' },
          component: () => import('./views/handover/index.vue')
        },
        {
          path: 'areaRemark',
          name: 'areaRemark',
          meta: { title: '备忘录' },
          component: () => import('./views/areaRemark/index.vue')
        },
        {
          path: 'configs',
          redirect: '/configs/style',
          name: 'configs',
          meta: { title: '配置' },
          component: () => import('./views/configsPage/index.vue'),
          children: [
            {
              path: 'style',
              name: 'style',
              meta: { title: '页面风格' },
              component: () => import('./views/configsPage/pages/style.vue')
            },
            {
              path: 'content/:moudleId',
              name: 'content',
              meta: { title: '页面内容' },
              component: () => import('./views/configsPage/pages/content.vue')
            },
            {
              path: 'doctorInfo/inHospital',
              name: 'inHospital',
              meta: { title: '在院医生' },
              component: () =>
                import('./views/configsPage/pages/inHospital.vue')
            },
            {
              path: 'doctorInfo/group',
              name: 'doctorGroup',
              meta: { title: '诊疗组分管床位' },
              component: () => import('./views/configsPage/pages/group.vue')
            },
            {
              path: 'doctorInfo/duty',
              name: 'doctorDuty',
              meta: { title: '值班医生' },
              component: () => import('./views/configsPage/pages/duty.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/areaDetail',
      name: 'areaDetail',
      meta: { title: '二级明细页面' },
      component: () => import('./views/areaDetail/index.vue')
    },
    {
      path: '/treatInfo',
      name: 'treatInfo',
      redirect: '/treatInfo/home',
      meta: { title: '患者详情' },
      component: () => import('./views/treatInfo/index.vue'),
      children: [
        {
          path: 'home',
          name: 'treatInfoHome',
          meta: { title: '患者详情首页' },
          component: () => import('./views/treatInfo/pages/home.vue')
        },
        {
          path: 'signs',
          name: 'signs',
          meta: { title: '患者体征' },
          component: () => import('./views/treatInfo/pages/signs.vue')
        },
        {
          path: 'caseHistory',
          name: 'caseHistory',
          meta: { title: '电子病历' },
          component: () => import('./views/treatInfo/pages/caseHistory.vue')
        },
        {
          path: 'doctorAdvices',
          name: 'doctorAdvices',
          meta: { title: '处方医嘱' },
          component: () => import('./views/treatInfo/pages/doctorAdvices.vue')
        },
        {
          path: 'examinationReports',
          name: 'examinationReports',
          meta: { title: '检验报告' },
          component: () =>
            import('./views/treatInfo/pages/examinationReports.vue')
        },
        {
          path: 'inspectionReports',
          name: 'inspectionReports',
          meta: { title: '检查报告' },
          component: () =>
            import('./views/treatInfo/pages/inspectionReports.vue')
        },
        {
          path: 'clinicalDiagnose',
          name: 'clinicalDiagnose',
          meta: { title: '临床诊断' },
          component: () =>
            import('./views/treatInfo/pages/clinicalDiagnose.vue')
        },
        {
          path: 'operation',
          name: 'operation',
          meta: { title: '手术列表' },
          component: () => import('./views/treatInfo/pages/operation.vue')
        }
      ]
    },
    {
      path: '/updateBrowser',
      name: 'updateBrowser',
      meta: { title: '升级浏览器' },
      component: () => import('./views/updateBrowser/index.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
