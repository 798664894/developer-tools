<template>
  <div :class="['cis-box', 'flex', { 'flex-reverse': rightHandType }]">
    <ul :class="['menu-container', `fs-${fontSize + 2}`]">
      <li
        v-for="(item, index) in cisData"
        :key="index"
        ref="menuList"
        :class="[
          'menu-item',
          'flex',
          'flex-pack-justify-between',
          { active: index === activeIndex }
        ]"
        @click="showInfo(index)"
      >
        <span class="type-name flex-1">{{ item.hzlbmc }}</span>
        <span class="type-num">（{{ item.children.length }}）</span>
      </li>
      <li class="menu-item" v-if="!cisData.length">{{ emptyText }}</li>
    </ul>
    <!-- 内容展示 -->
    <div
      :class="[
        'content-container',
        'flex-1',
        { 'mr-10': rightHandType, 'ml-10': !rightHandType }
      ]"
      ref="container"
      @scroll="handleScroll"
    >
      <div
        class="content-item"
        ref="contentItem"
        v-for="(item, index) in cisData"
        :key="index"
      >
        <p :class="['title', `fs-${fontSize + 4}`]">{{ item.hzlbmc }}</p>
        <ul v-if="item.children.length" :class="`fs-${fontSize + 2}`">
          <li class="header-title flex">
            <!-- 床位号和病人信息 -->
            <div class="bed-info">床位</div>
            <div class="patient-name">基本信息</div>
            <!-- 负责医生信息 -->
            <div class="doctor-info">床位医生</div>
            <!-- 诊断描述 -->
            <div class="diagnosis-info">诊断描述</div>
            <!-- 治疗过程描述 zlgcms mqqk字段同时为空展示四列内容-->
            <div
              class="treatment"
              v-if="
                item.children[0].zlgcms !== '' || item.children[0].mqqk !== ''
              "
            >
              诊疗过程
            </div>
            <!-- 目前情况 zlgcms mqqk字段同时为空展示四列内容-->
            <div
              class="current-situation"
              v-if="
                item.children[0].zlgcms !== '' || item.children[0].mqqk !== ''
              "
            >
              目前情况
            </div>
            <!-- 注意事项 -->
            <div class="announcement flex-1">注意事项</div>
          </li>
          <li
            v-for="(patInfo, patIndex) in item.children"
            :key="patIndex"
            :class="['flex', `fs-${fontSize + 2}`]"
          >
            <!-- 床位号和病人信息 -->
            <div :class="['bed-info', `fs-${fontSize}`]">
              <bed-no :data="patInfo"></bed-no>
            </div>
            <div class="patient-name">
              {{ patInfo.hzxx }}
            </div>
            <!-- 负责医生信息 -->
            <div class="doctor-info">
              {{ patInfo.zyys || '-' }}
            </div>
            <!-- 诊断描述 -->
            <div class="diagnosis-info">{{ patInfo.zdmc }}</div>
            <!-- 治疗过程描述 zlgcms mqqk字段同时为空展示四列内容-->
            <div
              class="treatment"
              v-if="patInfo.zlgcms !== '' || patInfo.mqqk !== ''"
            >
              {{ patInfo.zlgcms }}
            </div>
            <!-- 目前情况 zlgcms mqqk字段同时为空展示四列内容-->
            <div
              class="current-situation"
              v-if="patInfo.zlgcms !== '' || patInfo.mqqk !== ''"
            >
              {{ patInfo.mqqk }}
            </div>
            <!-- 注意事项 -->
            <div class="announcement flex-1">{{ patInfo.zysx }}</div>
          </li>
        </ul>
        <div class="no-data" v-else>{{ emptyText }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import bedNo from '../../../components/bedNoCell.vue'
@Component({
  name: 'cisHandover',
  components: {
    bedNo
  }
})
export default class cisHandover extends Vue {
  @State associationAreaCode
  @State associationOfficeCode
  @State yljgdm
  @State fontSize
  @State rightHandType

  private cisData: any[] = [] // cis交班数据
  private emptyText: string = '' // 无数据提示语
  private scrollY: number = 0 // 右侧列表滑动的y轴坐标
  private topList: any[] = [] // 所有分类头部位置
  private contentContainer: any = null // dom容器

  mounted() {
    this.getCisData()
    this.contentContainer = this.$refs.container
  }

  get activeIndex() {
    const { scrollY, topList } = this
    return topList.findIndex((tops, index) => {
      return scrollY >= tops && scrollY < topList[index + 1]
    })
  }

  private getCisData() {
    const param = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getCISJBList(param)
      .then(res => {
        this.emptyText = '暂无数据'
        this.cisData = res.data || []
        this.$nextTick(() => {
          this.initHeightArr()
        })
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
      })
  }

  private showInfo(index) {
    this.contentContainer.scrollTop = this.topList[index]
  }
  private initHeightArr() {
    let itemArray: any[] = []
    let top = 0
    itemArray.push(top)

    let allList: any = this.$refs.contentItem
    let lastItemHeight = 0
    if (allList != null) {
      Array.prototype.slice.call(allList).forEach((li, index) => {
        if (allList.length - 1 === index) {
          lastItemHeight = li.clientHeight
        }
        top += li.clientHeight + 10 //获取所有li的每一个高度
        itemArray.push(top)
      })
    }
    // 动态给展示容器添加paddbottom
    const paddHeight = this.contentContainer.offsetHeight - lastItemHeight
    if (paddHeight > 0) {
      this.contentContainer.style.paddingBottom = paddHeight + 'px'
    }
    this.topList = itemArray
  }
  private handleScroll() {
    this.scrollY = this.contentContainer.scrollTop
  }
}
</script>

<style lang="scss" scoped>
.cis-box {
  height: 100%;
  overflow: hidden;
  margin-top: 10px;
  @include puhui-m;
  .menu-item {
    @include home-font-color;
  }
  .menu-container,
  .content-container {
    @include home-content-bg;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    border-radius: 4px;
    overflow-y: auto;
  }

  .menu-container {
    width: 225px;
    overflow-x: hidden;
    li {
      padding-left: 20px;
      height: 40px;
      line-height: 40px;
    }
    .type-name {
      @include home-font-color;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .type-num {
      @include home-font-color;
      width: 50px;
    }
    .active {
      @include cis-menu-bg-color;
      .type-name {
        @include remark-title-font-color;
      }
      .type-num {
        @include cis-menu-number-color;
        color: #fff;
      }
    }
  }
  .content-container {
    padding: 0 15px;
    overflow-y: auto;
    .title {
      @include remark-title-font-color;
      margin: 25px 0 10px 15px;
    }
    li {
      padding: 20px;
      @include el-table-border-bottom;
      @include el-menu-font-color;
      &.header-title {
        @include el-menu-font-color;
        @include cis-tb--bg-color;
      }
    }
    .bed-info {
      width: 80px;
    }
    .patient-name {
      width: 100px;
      margin-left: 30px;
    }
    // 负责医生信息
    .doctor-info {
      margin-left: 30px;
      width: 100px;
      text-align: center;
    }
    // 诊断描述
    .diagnosis-info {
      width: 200px;
      margin-left: 60px;
    }
    // 治疗过程描述
    .treatment {
      width: 400px;
      margin-left: 60px;
    }
    // 目前情况
    .current-situation {
      width: 180px;
      margin-left: 60px;
    }
    //  注意事项
    .announcement {
      margin-left: 60px;
    }
  }
}
</style>
