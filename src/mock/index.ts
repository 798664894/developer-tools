/*
 * @Descripttion: mock配置文件
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-31 10:38:18
 * @LastEditors: wangqi
 * @LastEditTime: 2019-07-31 15:06:07
 */

import Mock from 'mockjs'
import data from './data'

Mock.setup({
  timeout: 0
})

// 登录相关和获取用户信息
Mock.mock(/\/getBqKsxx/, data.getBqKsxx)

export default Mock
