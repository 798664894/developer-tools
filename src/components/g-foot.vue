<!--
 * @Descripttion: 公用脚部组件
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-23 09:43:00
 * @LastEditors: wangqi
 * @LastEditTime: 2019-07-31 17:02:36
 -->

<template>
  <div class="g-foot">
    <span>kira的开发工具网站&nbsp;&nbsp;&nbsp;</span>
    <span>皖ICP备</span>
    <a class="web-href" target="_blank" href="https://beian.miit.gov.cn/">18015002号-1</a>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import state from '../store/state'

@Component({
  name: 'gFoot'
})
export default class gFoot extends Vue {}
</script>
<style lang="scss" scoped>
.g-foot {
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  color: #999;
  text-align: center;
  padding-right: 20px;
  .web-href {
    color: #999;
    text-decoration: underline;
  }
}
</style>
