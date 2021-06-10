<!--
 * @Descripttion: 患者详情 - 头部
 * @version: header
 * @LastEditTime: 2019-08-09 13:58:25
 -->
<template>
  <div class="header flex flex-align-center">
    <!-- 头像等基础信息 -->
    <div class="base-info flex flex-align-center">
      <div :class="['avatar', getIconName]"></div>
      <ul class="info-box">
        <li class="flex flex-align-center">
          <span class="name">{{ patientInfo.brxxkJz.hzxm }}</span>
          <span class="sex">{{ patientInfo.brxxkJz.xbmc }}</span>
          <span class="age">{{ patientInfo.age }}</span>
          <span class="in-hosptail flex-1">
            {{ patientInfo.jzkssj.substr(0, 10) }}入院
          </span>
        </li>
        <li class="flex">
          <div class="bed-no border" v-if="patientInfo.jzlb === '2'">
            {{ patientInfo.rycw || patientInfo.cycw || patientInfo.cwdm }}
            <span class="birth" v-if="patientInfo.isBirthDay"></span>
          </div>
          <div class="type border flex">
            <span class="treat-type">
              {{
                patientInfo.jzlb === '1'
                  ? '门诊'
                  : patientInfo.jzlb === '2'
                  ? '住院'
                  : patientInfo.jzlb === '99'
                  ? '其他'
                  : '未知'
              }}
            </span>
            <p class="flex-1 treat-no">{{ patientInfo.brxxkJz.blh }}</p>
          </div>
        </li>
      </ul>
    </div>
    <span class="line"></span>
    <!-- 治疗等相关信息 -->
    <ul class="treat-info">
      <li class="tag-box">
        <span class="tag red" v-if="patientInfo.wzjbdm === '2'">病危</span>
        <span class="tag organge" v-if="patientInfo.wzjbdm === '1'">病重</span>
        <span class="tag active" v-if="nursingLevel !== ''">
          {{ nursingLevel }}
        </span>
        <span v-if="isolation" class="tag">隔离</span>
        <!-- <span :class="['tag', { active: isolation }]">发热</span> -->
        <span v-if="hasOps" class="tag">手术</span>
        <span v-if="isRH" class="tag">RH</span>
      </li>
      <li class="diagnosis">主诊断： {{ patientInfo.zdmc || '-' }}</li>
    </ul>
    <span class="line"></span>
    <!-- 医生信息 -->
    <div class="doctor-box flex">
      <div class="doctor flex flex-align-center">
        <div class="d-avatar icon-doctor"></div>
        <div>
          <p class="name">
            {{ patientInfo.jzysmc || '-' }}
          </p>
          <p class="title-s">主治医生</p>
        </div>
      </div>
      <div class="nurse flex flex-align-center">
        <div class="d-avatar icon-nurse"></div>
        <div>
          <p class="name">{{ patientInfo.zrhsmc || '-' }}</p>
          <p class="title-s">责任护士</p>
        </div>
      </div>
    </div>
    <span class="line"></span>
    <span class="toggle" @click="toggleTimeLine">
      <span class="icon-toggle"></span>
      <i :class="showTime ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import moment from 'moment'

@Component({
  name: 't-header'
})
export default class tHeader extends Vue {
  @State patientInfo
  @State patidList
  @State yljgdm

  @Emit('toggleTimeLine')
  toggleTimeLine(): void {
    this.showTime = !this.showTime
  }

  @Watch('patientInfo')
  patientChange(newVal) {
    this.getTag()
  }

  mounted() {
    this.getTag()
  }

  private showTime: boolean = false // 是否展示时间轴
  private isolation: boolean = false // 是否隔离
  private isRH: boolean = false // 是否RH血
  private hasOps: boolean = false // 是否RH血

  /**
   * @name: getIconName
   * @test: test font
   * @msg: 根据患者性别，出生日期，入院日期，返回图片类名
   * @param {void}
   * @return: void
   */
  get getIconName(): string {
    const xbdm = this.patientInfo.brxxkJz.xbdm
    const birthday = this.patientInfo.brxxkJz.birth
    const hospitalTime = this.patientInfo.jzkssj
    if (!birthday || !hospitalTime) {
      if (xbdm === '2') {
        return 'icon-women'
      } else {
        return 'icon-man'
      }
    }
    const birthMomentObj = moment(birthday)
    const hospitalMomentObj = moment(hospitalTime)
    // 两个时间相差年数
    const ageDiff = moment.duration(hospitalMomentObj.diff(birthMomentObj))
    if (ageDiff.seconds() < 0) {
      if (xbdm === '2') {
        return 'icon-women'
      } else {
        return 'icon-man'
      }
    } else {
      const ageDiffYear = ageDiff.years()
      if (ageDiffYear >= 80) {
        if (xbdm === '2') {
          return 'icon-old-women'
        } else {
          return 'icon-old-man'
        }
      } else if (ageDiffYear <= 7) {
        if (xbdm === '2') {
          return 'icon-girl'
        } else {
          return 'icon-boy'
        }
      } else {
        if (xbdm === '2') {
          return 'icon-women'
        } else {
          return 'icon-man'
        }
      }
    }
  }

  /**
   * @name: nursingLevel
   * @test: test font
   * @msg: 护理级别
   * @param {void}
   * @return: void
   */
  get nursingLevel(): string {
    let hljbmc = this.patientInfo.hljbmc
    if (hljbmc == null) {
      return ''
    } else {
      if (hljbmc.indexOf('特') > -1) {
        return '特级护理'
      } else if (
        hljbmc.indexOf('一') > -1 ||
        hljbmc.indexOf('1') > -1 ||
        hljbmc.indexOf('Ⅰ') > -1 ||
        hljbmc.indexOf('I') > -1
      ) {
        return 'Ⅰ级护理'
      } else if (
        hljbmc.indexOf('二') > -1 ||
        hljbmc.indexOf('2') > -1 ||
        hljbmc.indexOf('Ⅱ') > -1 ||
        hljbmc.indexOf('II') > -1
      ) {
        return 'Ⅱ级护理'
      } else if (
        hljbmc.indexOf('三') > -1 ||
        hljbmc.indexOf('3') > -1 ||
        hljbmc.indexOf('Ⅲ') > -1 ||
        hljbmc.indexOf('III') > -1
      ) {
        return 'Ⅲ级护理'
      } else {
        return ''
      }
    }
  }

  /**
   * @name: getTag
   * @test: test font
   * @msg: 获取所有的标签 隔离，发热，手术，RH
   * @param {void}
   * @return: void
   */
  private getTag(): void {
    this.getIsolation()
    this.getRHxx()
    this.getTodaySsyyjlList()
  }
  // 是否隔离
  private getIsolation(): void {
    this.isolation = false
    const param = {
      yzlb: '1,2,3',
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yexh: this.patientInfo.yexh || 0,
      yljgdm: this.yljgdm,
      xmlx: '1,2,3',
      ksrq: this.$moment().format('YYYY-MM-DD'),
      jsrq: this.$moment()
        .add(1, 'days')
        .format('YYYY-MM-DD')
    }
    this.$api
      .getZyyz(param)
      .then(res => {
        const _res = res.data || []
        this.isolation = _res.some(item => {
          return item.yznr.indexOf('隔离') !== -1
        })
        return
      })
      .catch(err => {})
  }

  // RH
  private getRHxx(): void {
    this.isRH = false
    const param = {
      patidList: this.patidList
    }
    this.$api
      .isRH(param)
      .then(res => {
        const _res = res.data || {}
        this.isRH = _res.isRH || false
        return
      })
      .catch(err => {})
  }

  // 今日手术
  private getTodaySsyyjlList(): void {
    this.hasOps = false
    const param = {
      jzlsh: this.patientInfo.jzlsh,
      yljgdm: this.yljgdm
    }
    this.$api
      .getTodaySsyyjlList(param)
      .then(res => {
        this.hasOps = res.data.length > 0
        return
      })
      .catch(err => {})
  }
}
</script>

<style lang="scss" scoped>
.header {
  @include treat-header-bg;
  background-size: cover;
  box-shadow: 0px 2px 4px rgba(91, 113, 155, 0.5);
  border-radius: 0 4px 4px 4px;
  padding: 15px 20px;
  @include puhui-m;
  color: #fff;
  .line {
    width: 1px;
    height: 40px;
    background: linear-gradient(#314282, #fcfcfc, #314282);
  }
  // 基本信息
  .base-info {
    width: 650px;
  }
  // 基本信息 - 患者头像
  .avatar {
    width: 60px;
    height: 60px;
    // border: 2px solid #a6cfff;
    background-size: cover;
    margin-left: 220px;
    flex-shrink: 0;
    &.icon-girl {
      background-image: url('../../../assets/images/icon-girl.png');
    }
    &.icon-boy {
      background-image: url('../../../assets/images/icon-boy.png');
    }
    &.icon-women {
      background-image: url('../../../assets/images/icon-women.png');
    }
    &.icon-man {
      background-image: url('../../../assets/images/icon-man.png');
    }
    &.icon-old-women {
      background-image: url('../../../assets/images/icon-old-women.png');
    }
    &.icon-old-man {
      background-image: url('../../../assets/images/icon-old-man.png');
    }
  }
  .info-box {
    width: 350px;
    margin-left: 20px;
    font-size: 20px;
    color: #fff;
    li:first-child {
      margin-bottom: 6px;
      height: 32px;
    }
    .name {
      font-size: 24px;
    }
    .sex,
    .age,
    .in-hosptail {
      margin-left: 10px;
    }
    .in-hosptail {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .bed-no {
      position: relative;
      width: 70px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      .birth {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 20px;
        height: 20px;
        background-image: url('../../../assets/images/birthday.png');
        background-size: cover;
      }
    }
    .border {
      border: 1px solid #fff;
      border-radius: 4px;
    }
    .type {
      width: 220px;
      margin-left: 10px;
      height: 28px;
      line-height: 28px;
    }
    .treat-type {
      width: 60px;
      color: #ddd;
      background-color: #00baaf;
      text-align: center;
      flex-shrink: 0;
      border-radius: 4px 0 0 4px;
    }
    .treat-no {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
  }

  // 主诊断
  .treat-info {
    width: 700px;
    height: 100%;
    padding: 0 50px;
    .tag-box {
      padding-top: 5px;
    }
    .tag {
      display: inline-block;
      padding: 1px 10px;
      color: #fff;
      background-color: #b3d8ff;
      border-radius: 2px;
      font-size: 18px;
      margin-right: 5px;
      margin-bottom: 5px;
      cursor: auto;
      &.active {
        background-color: #20a2ff;
      }
    }
    .red {
      background-color: #ff3030;
    }
    .organge {
      background-color: #fba13b;
    }

    .diagnosis {
      margin-top: 5px;
      color: #fff;
      font-size: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  // 负责医生
  .doctor-box {
    width: 430px;
    height: 100%;
    padding: 0 50px;
    .doctor,
    .nurse {
      width: 50%;
    }
    .d-avatar {
      width: 40px;
      height: 40px;
      background-size: cover;
      &.icon-doctor {
        @include treat-icon-doctor;
      }
      &.icon-nurse {
        @include treat-icon-nurse;
      }
    }
    .name {
      font-size: 20px;
      color: #fff;
      margin-left: 16px;
      margin-bottom: 5px;
    }
    .title-s {
      font-size: 18px;
      color: #afb5c8;
      margin-left: 16px;
    }
  }

  // 切换时间轴
  .toggle {
    cursor: pointer;
    .icon-toggle {
      display: inline-block;
      font-size: 0;
      width: 40px;
      height: 40px;
      background-image: url('../../../assets/images/toggle-time-line.png');
      background-size: cover;
      margin-left: 15px;
      vertical-align: bottom;
      margin-right: 10px;
    }
    i {
      font-size: 20px;
      margin-bottom: 10px;
    }
  }
}
</style>
