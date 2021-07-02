<!--
 * @Descripttion: json格式化
 * @version:
 * @Author: kira
 * @Date: 2021-06-11
 -->
<template>
  <div class="timestamp">
    <div class="current-div">
      当前时间戳：<span class="current-span">{{ recurrent }}</span>
      <span>
        <i class="el-icon-video-play" v-if="!buttonStop" @click="clickButton">
          开始
        </i>
        <i class="el-icon-video-pause" v-if="buttonStop" @click="clickButton">
          停止
        </i>
      </span>
    </div>
    <div class="row-div flex">
      <span class="title-span">时间</span>
      <el-date-picker
        class="date-div"
        v-model="time1"
        type="datetime"
        placeholder="选择日期时间"
      >
      </el-date-picker>
      <el-button @click="toTimeStamp" class="button-div">转换->></el-button>
      <el-input v-model="timestamp1" class="input-div"></el-input>
    </div>
    <div class="row-div flex">
      <span class="title-span">时间戳</span>
      <el-input v-model="timestamp2" class="input-div"></el-input>
      <el-button @click="toDate" class="button-div">转换->></el-button>
      <el-input v-model="time2" class="input-div"></el-input>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'timestamp'
})
export default class timestamp extends Vue {
  private buttonStop: boolean = true
  private recurrent: number = new Date().getTime()
  private timer: any = null
  private time1: any = null
  private timestamp1: any = null
  private timestamp2: any = null
  private time2: string = ''
  mounted() {
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        this.recurrent = new Date().getTime()
      }, 1000)
    }
  }

  toTimeStamp(): void {
    if (this.time1) {
      this.timestamp1 = this.time1.getTime()
    }
  }

  clickButton(): void {
    if (this.buttonStop) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        this.recurrent = new Date().getTime()
      }, 1000)
    }
    this.buttonStop = !this.buttonStop
  }

  toDate(): void {
    if (this.timestamp2) {
      let date: Date = new Date()
      date.setTime(this.timestamp2)
      const YY = date.getFullYear() + '-'
      const MM =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      const DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      const hh =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      const mm =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      const ss =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      this.time2 = YY + MM + DD + ' ' + hh + mm + ss
    }
  }
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss">
.timestamp {
  .el-icon-video-play {
    margin-left: 20px;
    cursor: pointer;
    color: green;
  }
  .current-div {
    margin-left: 500px;
    margin-top: 260px;
    font-size: 19px;
  }
  .title-span {
    margin-left: 500px;
    font-size: 19px;
  }
  .el-icon-video-pause {
    margin-left: 20px;
    cursor: pointer;
    color: red;
  }
  .input-div {
    margin-left: 10px;
    width: 280px;
  }
  .button-div {
    margin-left: 10px;
  }
  .row-div {
    margin-top: 50px;
  }
  .current-span {
    user-select: text;
  }
  .date-div {
    margin-left: 30px;
  }
}
</style>
