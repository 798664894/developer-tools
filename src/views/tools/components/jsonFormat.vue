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
      v-model="toFormatStr"
    >
    </el-input>
    <div class="button-div flex flex-align-center">
      <el-button type="primary" class="format-button" @click="formatJson"
        >格式化 <i class="el-icon-d-arrow-right"></i
      ></el-button>
    </div>
    <div class="formated-area">
      <pre class="pre-area">{{ formatedStr }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'jsonFormat'
})
export default class jsonFormat extends Vue {
  private toFormatStr: string = ''
  private formatedStr: string = ''

  private formatJson() {
    try {
      this.formatedStr = JSON.stringify(JSON.parse(this.toFormatStr), null, 4)
    } catch (e) {
      this.formatedStr = this.toFormatStr
    }
  }
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
  .formated-area {
    width: 100%;
    border-radius: 4px;
    border: 0.00521rem solid #dcdfe6;
    background: white;
    height: 98%;
  }
  .pre-area {
    height: 100%;
    width: 100%;
    white-space: pre-wrap;
    -webkit-user-select: text;
    overflow: auto;
  }
}
</style>
