<!--
 * @Descripttion: 应用默认跳转页面，重定向
 * @version: 
 * @Author: wangqi
 * @Date: 2019-07-31 13:42:37
 * @LastEditors: wangqi
 * @LastEditTime: 2019-07-31 16:09:10
 -->
<template>
  <div class="redirect"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

@Component({
  name: 'redirect'
})
export default class redirect extends Vue {
  @State currentAreaCode

  @Action resetAreaCode

  created(): void {
    // 如果把重定向放到login中，容易渲染login页面，并有闪烁效果，所以单独提取出来，提升用户体验
    if (this.currentAreaCode === '') {
      this.$router.push('/login')
    } else {
      // 每次默认
      this.resetAreaCode()
      this.$router.push('/wardWhiteboard')
    }
  }
}
</script>

<style lang="scss"></style>
