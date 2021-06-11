<!--
 * @Descripttion: 主页
 * @version:
 * @Author: kira
 * @Date: 2021-06-11
 -->
<template>
  <div class="index flex">
    <div :class="['menu-container', 'flex', 'flex-v']">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="selectTab"
      >
        <el-menu-item index="1">
          <i class="el-icon-menu"></i>
          <span slot="title">JSON格式化</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-setting"></i>
          <span slot="title">时间戳转换</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content-container flex flex-v">
      <jsonFormat v-if="activeModule === '1'" />
    </div>
    <gFoot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import gFoot from '../../components/g-foot.vue'
import jsonFormat from './components/jsonFormat.vue'

@Component({
  name: 'index',
  components: { gFoot, jsonFormat }
})
export default class redirect extends Vue {
  private activeModule: string = '1' //激活的模块

  /**
   * tab点击事件
   */
  private selectTab(index: any, indexPath: any[]): void {
    this.activeModule = index
  }
}
</script>

<style lang="scss">
.index {
  height: 90%;
  padding-top: 10px;
  .menu-container {
    width: 200px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.6);
    border-radius: 4px;
    margin: 0 2px 10px;
    overflow: auto;
    height: 100%;
  }
  .content-container {
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.6);
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    height: 100%;
    margin-left: 5px;
    padding-bottom: 30px;
  }
  .g-foot {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .el-menu-vertical-demo {
    height: 100%;
    border-right: none;
  }
}
</style>
