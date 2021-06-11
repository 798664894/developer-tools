<!--
 * @Descripttion: json格式化
 * @version:
 * @Author: kira
 * @Date: 2021-06-11
 -->
<template>
  <div class="jsonFormat flex">
    <el-input
      class="text-input"
      type="textarea"
      placeholder="请输入内容"
      v-model="textarea"
    >
    </el-input>
    <div class="button-div flex flex-align-center">
      <el-button type="info" plain class="format-button"
        >格式化 <i class="el-icon-d-arrow-right"></i
      ></el-button>
    </div>
    <el-input
      readonly="true"
      class="text-input"
      type="textarea"
      v-model="textarea"
    >
    </el-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

@Component({
  name: 'jsonFormat'
})
export default class redirect extends Vue {
  created(): void {}
}
</script>

<style lang="scss">
.jsonFormat {
  height: 100%;
  .format-button {
    height: 40px;
  }
  .button-div {
    height: 98%;
    text-align: center;
    margin-left: 5px;
    margin-right: 5px;
  }
  .el-textarea__inner {
    min-height: 98% !important;
    max-height: 98% !important;
  }
}
</style>
