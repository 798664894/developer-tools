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
    this.$router.push('/tools')
  }
}
</script>

<style lang="scss"></style>
