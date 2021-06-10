<!--
 * @Descripttion: 患者详情首页
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 15:53:43
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 09:20:07
 -->
<template>
  <div class="treat-home flex flex-v">
    <tHeader @toggleTimeLine="toggleTimeLine" />
    <div :class="['time-line', { show: timeLineShow }]" ref="recordContainer">
      <div class="line" v-if="timeLineShow"></div>
      <div class="record-box flex" ref="recordBox">
        <div
          v-for="(item, index) in treatRecordList"
          :key="index"
          :class="[
            'record',
            { active: activeHistoryIndex === index },
            `fs-${fontSize - 2}`
          ]"
          @click="changeRecord(index)"
        >
          <span class="circle"></span>
          <p class="title">
            <i
              :class="[
                'treat-type',
                item.jzlb === '1' ? 'department ' : 'hospital'
              ]"
            ></i>
            {{ item.jzlb === '1' ? '门诊 ' : '住院' }}
            &nbsp;
            {{ item.jzkssj.substr(0, 10).replace(/\-/g, '/') }}
          </p>
          <p class="content">{{ item.jzksmc }}</p>
          <p class="content">
            {{
              item.zdmc == null || item.zdmc === '' ? '暂无诊断数据' : item.zdmc
            }}
          </p>
        </div>
      </div>
    </div>
    <div
      :class="[
        'content-container',
        'flex-1',
        'flex',
        { 'flex-reverse': rightHandType }
      ]"
    >
      <ul :class="['menu', { 'mr-10': !rightHandType }]">
        <li
          v-for="(item, index) in routerArr"
          :key="index"
          :class="[`fs-${fontSize}`, { active: $route.path === item.path }]"
          @click="linkTo(item.path)"
        >
          {{ item.name }}
        </li>
      </ul>
      <router-view class="treat-content flex-1" />
    </div>
    <tFoot @changeRecordIndex="changeRecordIndex" />
    <gFoot />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import tHeader from './components/header.vue'
import tFoot from './components/foot.vue'
import gFoot from '../../components/g-foot.vue'
import mousewheel from '../../mixin/mousewheel'
@Component({
  name: 'treatHome',
  components: {
    tHeader,
    tFoot,
    gFoot
  },
  mixins: [mousewheel]
})
export default class treatHome extends Vue {
  @State patientInfo
  @State patidList
  @State rightHandType
  @State fontSize

  @Action getPatientInfo

  // 定义路由数组
  private routerArr: Readonly<object[]> = [
    { path: '/treatInfo/home', name: '患者主页' },
    // { path: '/treatInfo/signs', name: '患者体征' },
    { path: '/treatInfo/caseHistory', name: '电子病历' },
    { path: '/treatInfo/doctorAdvices', name: '医嘱处方' },
    { path: '/treatInfo/examinationReports', name: '检验报告' },
    { path: '/treatInfo/inspectionReports', name: ' 检查报告' },
    { path: '/treatInfo/nursingDoc', name: '护理文书' },
    { path: '/treatInfo/clinicalDiagnose', name: '临床诊断' }
    // { path: '/treatInfo/operation', name: '手术治疗' }
  ]
  private timeLineShow: boolean = false // 就诊时间轴是否显示
  private treatRecordList: any[] = [] // 就诊集合
  private activeHistoryIndex: number = 0 // 激活的就诊历史index

  @Watch('patientInfo')
  changePatient(newVal) {
    this.getRreatRecord()
  }

  mounted() {
    this.getRreatRecord()
  }

  /**
   * @name: getRreatRecord
   * @test: test font
   * @msg: 获取就诊记录
   * @param {void}
   * @return: void
   */
  private getRreatRecord(): void {
    let param = {
      patid: this.patientInfo.patid,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.patientInfo.yljgdm,
      yexh: this.patientInfo.yexh,
      patidList: this.patidList
    }
    this.$api
      .getTimeline(param)
      .then(res => {
        const _res = res.data || []
        this.treatRecordList = _res
        // 绑定鼠标滚轴横向滚动
        this.$nextTick(() => {
          this.scroll(this.$refs.recordContainer, this.$refs.recordBox)
        })
        return
      })
      .catch(err => {
        this.$message({
          message: '获取历次就诊失败！',
          type: 'error'
        })
      })
  }

  /**
   * @name: linkTo
   * @test: test font
   * @msg: 跳转患者诊断相关详情页面
   * @param {path} 目标路径
   * @return: void
   */
  private linkTo(tarrgetPath: string): void {
    const path = this.$route.path
    if (path === tarrgetPath) {
      return
    } else {
      this.$router.push(tarrgetPath)
    }
  }

  /**
   * @name: changeRecord
   * @test: test font
   * @msg: 切换
   * @param {void}
   * @return: void
   */
  private changeRecord(index: number): void {
    this.activeHistoryIndex = index
    this.getPatientInfo(this.treatRecordList[index])
  }

  /**
   * @name: toggleTimeLine
   * @test: test font
   * @msg: 切换就诊时间轴展示隐藏
   * @param {void}
   * @return: void
   */
  private toggleTimeLine(): void {
    this.timeLineShow = !this.timeLineShow
  }

  private changeRecordIndex(val) {
    if (val) {
      this.activeHistoryIndex = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.treat-home {
  height: 100%;
  overflow: hidden;
  .content-container {
    padding: 0 15px 10px;
    overflow: hidden;
    &.flex-reverse {
      .menu {
        margin-left: 10px;
      }
    }
    .menu {
      width: 150px;
      @include home-content-bg;
      box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
      @include puhui-m;
      border-radius: 0 4px 4px 4px;
      overflow-y: auto;
      margin-top: 2px;
      margin-bottom: 2px;
      flex-shrink: 0;
      li {
        @include el-menu-font-color;
        text-align: center;
        margin: 25px 20px 0 20px;
        padding-bottom: 10px;
        cursor: pointer;
        border-bottom: 5px solid transparent;
        &.active {
          @include treat-menu-active-color;
        }
      }
    }
    // 内容
    .treat-content {
      position: relative;
      height: 100%;
      @include puhui-m;
      padding: 2px;
    }
  }
  // 时间轴
  .time-line {
    position: relative;
    max-height: 0;
    overflow: hidden;
    transition: all 0.5s linear;
    margin: 10px 15px;
    @include time-history-bg-color;
    box-shadow: 0px 2px 4px rgba(30, 60, 114, 0.4);
    @include puhui-m;
    border-radius: 0 4px 4px 4px;
    overflow-x: auto;
    padding: 0 10px;
    &.show {
      max-height: 200px;
      padding: 10px;
    }
    .line {
      position: fixed;
      height: 2px;
      left: 30px;
      right: 30px;
      top: 130px;
      @include time-history-line;
    }
    .record-box {
      display: inline-block;
      white-space: nowrap;
      height: 100%;
    }
    .record {
      position: relative;
      display: inline-block;
      width: 200px;
      margin-left: 50px;
      padding-top: 20px;
      cursor: pointer;
      @include time-history-font-color;
      flex-shrink: 0;
      &.active {
        @include time-history-active-font-color;
        font-weight: 600;
        .circle {
          background-color: #00938b;
          box-shadow: 0 0 4px rgba(0, 147, 139, 0.8);
          border-color: #00938b;
        }
      }
    }
    .circle {
      position: absolute;
      width: 12px;
      height: 12px;
      left: 7px;
      top: 4px;
      border-radius: 50%;
      border: 2px solid #819dc4;
    }
    .content {
      max-height: 46px;
      @include overflow(2);
    }
    .treat-type {
      display: inline-block;
      width: 27px;
      height: 27px;
      background-size: cover;
      vertical-align: bottom;
      &.department {
        background-image: url('../../assets/images/department .png');
      }
      &.hospital {
        background-image: url('../../assets/images/in-hospital.png');
      }
    }
  }
  .mr-10 {
    margin-right: 10px;
  }
}
</style>
