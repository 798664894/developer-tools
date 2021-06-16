<!--
 * @Descripttion:
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-14 18:34:40
 -->
<template>
  <div id="app">
    <keep-alive>
      <router-view
        v-if="$route.meta.keepAlive"
        class="flex-1"
        @click.native="showMenu = false"
      />
    </keep-alive>
    <router-view
      v-if="!$route.meta.keepAlive"
      class="flex-1"
      @click.native="showMenu = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'appHome'
})
export default class appHome extends Vue {
  @State theme

  private showMenu: boolean = false // 隐藏菜单展示控制

  mounted() {
    // 设置主题
    window.document.documentElement.setAttribute('data-theme', this.theme)
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  position: relative;
  overflow: hidden;
  @include home-bg-img;
  background-size: cover;

  & > div {
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  // 菜单盒子
  .meun-box {
    position: absolute;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    // width: 680px;
    height: 60px;
    @include menu-bg-color;
    transition: all 1s;
    overflow: visible;
    border-radius: 4px;
    z-index: 1000;
    .switch {
      position: absolute;
      width: 88px;
      height: 24px;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;
      background: linear-gradient(
        180deg,
        rgba(83, 109, 172, 1) 0%,
        rgba(41, 59, 116, 1) 100%
      );
      i {
        color: #fff;
        font-size: 24px;
        transform: rotate(90deg);
      }
    }
    &.show {
      bottom: 0;
      .switch i {
        transform: rotate(-90deg);
      }
    }
    .doctor {
      width: 80px;
      height: 100%;
      background: linear-gradient(
        360deg,
        rgba(24, 40, 92, 1) 0%,
        rgba(76, 104, 194, 1) 100%
      );
      cursor: pointer;
      border-top-left-radius: 4px;
      span {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-image: url('./assets/images/icon-doctor.png');
        background-size: 43px 43px;
        background-position: center center;
        background-repeat: no-repeat;
      }
    }
    .home-page,
    .bed-list-page,
    .memo-page,
    .hander-page {
      width: 150px;
      text-align: center;
      font-size: 21px;
      height: 60px;
      line-height: 60px;
      @include menu-font-color;
      cursor: pointer;
      &.active {
        color: #fff;
        @include menu-active-bg;
        .icon-home {
          background-image: url('./assets/images/icon-menu-home-active.png');
        }
        .icon-note {
          background-image: url('./assets/images/icon-menu-note-active.png');
        }
        .icon-bed-list {
          background-image: url('./assets/images/icon-menu-bed-active.png');
        }
        .icon-hander {
          background-image: url('./assets/images/icon-menu-hander-active.png');
        }
      }
    }
    .hander-page {
      border-top-right-radius: 4px;
    }

    .my-icon {
      display: inline-block;
      width: 21px;
      height: 21px;
      background-size: cover;
      margin-right: 8px;
    }
    .icon-home {
      @include menu-icon-home;
    }
    .icon-note {
      @include menu-icon-bwl;
    }
    .icon-bed-list {
      @include menu-icon-cwlb;
    }
    .icon-hander {
      @include menu-icon-fzjb;
    }

    .nali-box {
      width: 60px;
      text-align: center;
      cursor: pointer;
    }
    .icon-nali {
      display: inline-block;
      width: 30px;
      height: 30px;
      background-size: cover;
      background-image: url('./assets/images/icon-nali.png');
    }
  }
}
</style>
