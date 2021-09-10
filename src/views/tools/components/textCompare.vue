<template>
  <div class="textCompare flex flex-1">
    <div id="view"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/merge/merge.js'
import 'codemirror/addon/merge/merge.css'
import DiffMatchPatch from 'diff-match-patch'
import CodeMirror from 'codemirror'
window.diff_match_patch = DiffMatchPatch
window.DIFF_DELETE = -1
window.DIFF_INSERT = 1
window.DIFF_EQUAL = 0

@Component({
  name: 'textCompare'
})
export default class textCompare extends Vue {

  initUI(value, orig2) {
    if (value == null) return
    let target = document.getElementById('view')
    if (target != null) {
      target.innerHTML = ''
      CodeMirror.MergeView(target, {
        value: value, //上次内容
        origLeft: null,
        orig: orig2, //本次内容
        lineNumbers: true, //显示行号
        mode: 'text/html',
        highlightDifferences: true,
        connect: 'align',
        allowEditingOriginals: true,
        readOnly: false //只读 不可修改
      })
    }
  }

  mounted() {
    this.initUI('输入需要对比的内容', '输入需要对比的内容')
  }
}
</script>

<style lang="scss">
.textCompare {
  #view {
    width: 100%;
  }
  .CodeMirror-merge {
    width: 100%;
    height: 90%;
  }
  .CodeMirror-merge,
  .CodeMirror-merge .CodeMirror {
    height: 878px;
  }
}
</style>
