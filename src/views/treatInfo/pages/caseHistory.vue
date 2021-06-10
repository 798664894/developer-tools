<!--
 * @Descripttion: 电子病历
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-02 09:15:08
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-02 09:40:00
 -->
<template>
  <div :class="['case-history', 'flex', { 'flex-reverse': rightHandType }]">
    <!--左边 菜单 -->
    <div :class="['title-list', `fs-${fontSize}`]">
      <div class="title-card">
        <div class="card" v-for="(card, index) in lcwdList" :key="index">
          <div class="group-title">
            {{ card.type }}
          </div>
          <div
            :class="[
              'doc-name',
              { active: activedLcwdBtn === index + '+' + num }
            ]"
            v-for="(bl, num) in card.list"
            :key="num"
            @click="getContent(bl, index, num)"
          >
            {{ bl.wdmc }}
          </div>
        </div>
        <div
          class="empty no-data flex flex-pack-center"
          v-if="!lcwdList.length"
        >
          <span :class="`fs-${fontSize}`"> {{ emptyText }}</span>
        </div>
      </div>
      <div class="sort-rule flex ">
        <span>排列：</span>
        <el-select
          v-model="selectValue"
          popper-class="select-class"
          placeholder="请选择"
          @change="loadTitle"
          size="mini"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <!--右边 病历内容-->
    <div :class="['content', 'flex-1', { 'mr-10': rightHandType }]">
      <div class="out flex-1" ref="contentContainer">
        <!--pdf-->
        <template v-if="style === 'pdf'">
          <iframe
            class="pdf"
            v-for="(wdnr, pdfIndex) in lcwdsj"
            :key="pdfIndex"
            :src="wdnr.filePath"
          ></iframe>
        </template>

        <!--html-->
        <template v-if="style === 'html'">
          <div
            class="html"
            v-for="(wdnr, htmlIndex) in lcwdsj"
            :key="htmlIndex"
            v-html="wdnr.wdnr"
          ></div>
        </template>

        <!--段数据-->
        <template v-if="style === 'dsj'">
          <div v-for="(bl, blIndex) in lcwdsj" :key="blIndex">
            <div :class="['wddmc', `fs-${fontSize + 2}`]">{{ bl.wddmc }}</div>
            <div :class="['blnr', `fs-${fontSize}`]">{{ bl.wddnr }}</div>
          </div>
        </template>
        <div class="empty no-data flex flex-pack-center" v-if="!lcwdsj.length">
          <span :class="`fs-${fontSize}`"> {{ emptyText }}</span>
        </div>
        <div :class="['btn', `fs-${fontSize + 2}`]">
          <span :class="['up', { first: isFirst }]" @click="changeAdvice('up')">
            上一个
          </span>
          <span
            :class="['next', { last: isLast }]"
            @click="changeAdvice('next')"
          >
            下一个
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { sectionalizeArr } from '../../../libs/utils'

@Component({
  name: 'caseHistory'
})
export default class caseHistory extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State patientInfo
  @State sizeMultiple
  @State patidList
  @State rightHandType
  @State fontSize

  private lcwdListOld: any[] = [] //未分组list
  private lcwdList: any[] = [] //病历列表
  private activedLcwdBtn: string = '0+0' //激活的选项卡
  private style: string = '' //文档格式
  private lcwdsj: any[] = [] //文档内容
  private options: object[] = [
    {
      value: 1,
      label: '按日期排'
    },
    {
      value: 2,
      label: '按医师排'
    },
    {
      value: 3,
      label: '按类型排'
    }
  ] //分组条件
  private selectValue: number = 1 //选择的分组条件
  private emptyText: string = '' //无数据显示内容
  private htmlData: any[] = [] // 存放html段数据

  @Watch('patientInfo')
  changePatient(newVal) {
    this.lcwdListOld = []
    this.lcwdsj = []
    this.getLcwdList()
  }

  @Watch('fontSize')
  changeFontSize(newVal) {
    if (this.style === 'html') {
      this.lcwdsj = this.toStr(JSON.parse(JSON.stringify(this.htmlData)))
    }
  }

  mounted() {
    this.getLcwdList()
  }

  get isFirst(): boolean {
    if (this.lcwdList.length) {
      let firstBtn = '0+0'
      return this.activedLcwdBtn === firstBtn
    }
    return true
  }

  get isLast(): boolean {
    if (this.lcwdList.length) {
      let lastBtn =
        this.lcwdList.length -
        1 +
        '+' +
        (this.lcwdList[this.lcwdList.length - 1].list.length - 1)
      return this.activedLcwdBtn === lastBtn
    }
    return true
  }

  /**
   * 获取病历列表
   */
  private getLcwdList(): void {
    this.emptyText = ''
    let param = {
      wdlb: '1',
      yexh: '0',
      patidList: this.patidList,
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.patientInfo.yljgdm
    }
    this.$api
      .getLcwd(param)
      .then(res => {
        this.emptyText = '暂无数据'
        const _res = res.data || {}
        if (_res.lcwdList && _res.lcwdList.length) {
          let data = _res.lcwdList[0].lcwdList || []
          data.forEach(item => {
            item.cjsj = item.cjsj.substring(0, 10)
            item.shysmc = item.shysmc ? item.shysmc : '未知'
          })
          this.lcwdListOld = data
          this.loadTitle()
        } else {
          this.lcwdList = []
        }
        return
      })
      .catch(err => {
        console.log(err)
        this.emptyText = '页面无响应'
      })
  }

  /**
   * 获取病历详情
   * @param sj  时间
   * @param bl  病历
   * @param index  索引
   */
  private getContent(bl, index, num): void {
    this.activedLcwdBtn = index + '+' + num
    let param = {
      wdbsh: bl.wdbsh,
      yljgdm: bl.yljgdm,
      sysId: bl.sysId
    }
    this.$api
      .getLcwdwdsjEntities(param)
      .then(res => {
        if (res.data && res.data.length) {
          if (res.data[0].wdgs === 'url') {
            this.style = 'pdf'
            this.loadPdf(res.data)
          } else if (res.data[0].wdgs === 'html') {
            this.style = 'html'
            this.htmlData = res.data || []
            this.lcwdsj = this.toStr(JSON.parse(JSON.stringify(this.htmlData)))
          }
        } else {
          this.getLcwdwddsjEntities(param)
        }
        return
      })
      .catch(err => {
        console.log(err)
      })
  }

  /**
   * html结构下调整宽高，以及字体大小
   * @param data  段数据
   */
  private toStr(data: any[]): any[] {
    data.forEach(item => {
      let str: any = item.wdnr
      let that: any = this
      // html容器宽度
      let contentContainer: any = this.$refs.contentContainer
      let contentContainerWidth = contentContainer.offsetWidth
      // 获取字符串中的table宽度
      let tableWidth = str.match(/width="(\d+)"/)[1] * 1
      let multiple = contentContainerWidth / tableWidth
      // 放大倍数 = 容器宽度/table宽度
      str = str.replace(/width="(\d+)"/g, function() {
        return (
          'width="' +
          Math.floor(arguments[0].match(/\d+/g)[0] * multiple - 200) +
          '"'
        )
      })
      str = str.replace(/height="(\d+)"/g, function() {
        return (
          'height="' +
          Math.floor(arguments[0].match(/\d+/g)[0] * multiple) +
          '"'
        )
      })
      str = str.replace(/font-size: (\d+)px/g, function() {
        // 病例最小字体为14
        return (
          'font-size: ' +
          (arguments[0].match(/\d+/g)[0] * 1 + (that.fontSize - 14)) +
          'px'
        )
      })
      item.wdnr = str
    })
    return data
  }

  private getLcwdwddsjEntities(param): void {
    this.$api
      .getLcwdwddsjEntities(param)
      .then(res => {
        this.style = 'dsj'
        this.lcwdsj = res.data || []
        return
      })
      .catch(err => {})
  }

  //上一个，下一个按钮事件
  private changeAdvice(ev: string): void {
    let arr: any[] = []
    arr = this.activedLcwdBtn.split('+')
    let titleIndex: number = parseInt(arr[0])
    let index: number = parseInt(arr[1])
    if (ev === 'up') {
      if (index === 0) {
        if (titleIndex !== 0) {
          const newTitleIndex: any = titleIndex - 1
          const bl = this.lcwdList[newTitleIndex].list[
            this.lcwdList[newTitleIndex].list.length - 1
          ]
          index = this.lcwdList[newTitleIndex].list.length - 1
          this.getContent(bl, newTitleIndex, index)
        }
      } else {
        const bl = this.lcwdList[titleIndex].list[index - 1]
        index = index - 1
        this.getContent(bl, titleIndex, index)
      }
    } else if (ev === 'next') {
      if (index === this.lcwdList[titleIndex].list.length - 1) {
        if (titleIndex !== this.lcwdList.length - 1) {
          titleIndex = titleIndex + 1
          let bl = this.lcwdList[titleIndex].list[0]
          this.getContent(bl, titleIndex, 0)
        }
      } else {
        let bl = this.lcwdList[titleIndex].list[index + 1]
        this.getContent(bl, titleIndex, index + 1)
      }
    }
  }

  /**
   * 加载pdf
   * @param data
   */
  private loadPdf(data): void {
    this.lcwdsj = []
    data.forEach(item => {
      let param = {
        id: item.wdbsh,
        ftpUrl: item.wdnr,
        yljgdm: item.yljgdm
      }
      this.$api
        .handleFtpTransform(param)
        .then(res => {
          if (res.data && res.data.filePath) {
            res.data.filePath = this.$config.ftpTransformUrl + res.data.filePath
          }
          this.lcwdsj.push(res.data)
          return
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

  //根据分类加载列表
  private loadTitle(): void {
    if (this.selectValue === 1) {
      this.lcwdList = sectionalizeArr(this.lcwdListOld, 'cjsj')
    } else if (this.selectValue === 2) {
      this.lcwdList = sectionalizeArr(this.lcwdListOld, 'shysmc')
    } else if (this.selectValue === 3) {
      this.lcwdList = sectionalizeArr(this.lcwdListOld, 'wdmxlbsm')
    }
    if (this.lcwdList.length) {
      //根据路由定位报告
      if (this.$route.query.wdbsh) {
        let bl, index, num
        this.lcwdList.forEach((item, titleIndex) => {
          item.list.forEach((lcwd, itemIndex) => {
            if (lcwd.wdbsh === this.$route.query.wdbsh) {
              bl = lcwd
              index = titleIndex
              num = itemIndex
            }
          })
        })
        if (bl) {
          this.getContent(bl, index, num)
        } else {
          //默认加载第一个
          this.getContent(this.lcwdList[0].list[0], 0, 0)
        }
      } else {
        //默认加载第一个
        this.getContent(this.lcwdList[0].list[0], 0, 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.case-history {
  position: relative;
  overflow-y: auto;
  padding-bottom: 2px;

  .title-list {
    height: 100%;
    width: 250px;
    @include home-content-bg;
    overflow-y: auto;
    border-radius: 0 4px 4px 4px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    .title-card {
      overflow-y: auto;
      height: 94%;
      position: relative;
      .card {
        margin-top: 15px;
        .group-title {
          margin-left: 10px;
          @include el-table-title-font-color;
          opacity: 1;
        }
        .doc-name {
          padding-left: 20px;
          margin-top: 10px;
          @include el-menu-font-color;
        }
        .active {
          @include treat-menu-bg-color;
          color: white !important;
        }
      }
    }
  }

  .sort-rule {
    position: absolute;
    left: 15px;
    bottom: 0;
    @include title-s-font-color;
    font-size: 15px;
    line-height: 36px;
    bottom: 5px;
    .el-select {
      width: 112px;
    }
  }

  .content {
    position: relative;
    height: 100%;
    overflow-y: auto;
    border-radius: 0 4px 4px 4px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    @include home-content-bg;
    padding-bottom: 50px;
    margin-left: 10px;
    font-size: 20px;

    .out {
      overflow-y: auto;
      height: 100%;

      .pdf {
        width: 100%;
        height: 100%;
      }

      .html {
        width: 100%;
        margin-top: 25px;

        table {
          width: 90% !important;
        }
      }

      .blnr {
        @include el-menu-font-color;
        padding-left: 60px;
        padding-right: 45px;
        background: rgba(99, 145, 193, 0.1);
        margin-right: 39px;
        margin-left: 56px;
      }

      .wddmc {
        padding-left: 116px;
        margin-top: 16px;
        color: rgba(73, 150, 226, 1);
        opacity: 1;
        margin-bottom: 8px;
      }

      .btn {
        position: absolute;
        bottom: 15px;
        right: 20px;
        @include el-menu-font-color;
        text-decoration: underline;
        .first {
          @include a-not-active-color;
          text-decoration: underline;
        }

        .last {
          @include a-not-active-color;
          text-decoration: underline;
        }

        .up {
          margin-right: 46px;
        }
      }
    }
  }

  .empty {
    margin-top: 50px;
  }
}
</style>
