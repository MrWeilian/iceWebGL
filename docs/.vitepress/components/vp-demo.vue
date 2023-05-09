<template>
  <div class="container">
    <div class="demo">
      <div class="menu">
        <i class="icon"
           v-for="icon in iconColorArr"
           :key="icon.color"
           :style="{ backgroundColor: icon.color }"
        />
      </div>
      <div class="demo-wrapper">
        <slot name="demo"></slot>
      </div>
    </div>
    <div class="options">
      <el-tooltip
          content="复制代码"
          placement="bottom"
      >
        <el-icon ref="copyBtn" class="option-item" :data-clipboard-text="decodeURIComponent(sourceCode)"><CopyDocument /></el-icon>
      </el-tooltip>
      <el-tooltip
          content="查看源码"
          placement="bottom"
      >
        <span class="option-item code-btn" @click="handleToggleCode">&lt;/&gt;</span>
      </el-tooltip>
    </div>
    <el-collapse-transition>
      <div class="source-code" v-if="isShowCode">
        <div class="decode" v-html="decodeURIComponent(highlightCode)"></div>
        <div class="hide-code-btn">
          <el-button type="info" link :icon="CaretTop" @click="handleToggleCode">隐藏源代码</el-button>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ClipboardJS from 'clipboard'
import 'prismjs/themes/prism-tomorrow.min.css'
import { CopyDocument, CaretTop } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-popper.css'

const props = defineProps({
  componentName: {
    type: String
  },
  sourceCode: {
    type: String
  },
  highlightCode: {
    type: String
  }
})

const isShowCode = ref(false)
const copyBtn = ref()
const iconColorArr = [{ color: '#fe5f57' }, { color: '#ffbc2d' }, { color: '#27c83e' }]
let clipboard = null

const handleToggleCode = () => isShowCode.value = !isShowCode.value

const initCopy = () => {
  clipboard = new ClipboardJS(copyBtn.value.$el)
  clipboard.on('success', (e) => {
    ElMessage.success('已复制！')
    e.clearSelection()
  })
}

onMounted(() => {
  initCopy()
})

onUnmounted(() => {
  clipboard.destroy()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "vp-demo"
})
</script>

<style scoped lang="scss">
$menu-height: 32px;
.container {
  border: 1px solid var(--vp-c-bg-soft-mute);
  border-radius: var(--vp-border-radius);
}
.demo {
  .demo-wrapper {
    padding: 16px;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
  }
  .menu {
    border-radius: var(--vp-border-radius) var(--vp-border-radius) 0 0;
    height: $menu-height;
    line-height: $menu-height;
    background-color: var(--vp-custom-block-details-bg);
    padding: 0 16px;
    .icon {
      position: relative;
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 6px;
      border-radius: 50%;
      &:hover {
        .d-caret {
          display: block;
        }
      }
      .d-caret {
        display: none;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        color: var(--vp-c-text-2);
        font-size: 12px;
      }
    }
  }
}

.options {
  border-top: 1px solid var(--vp-custom-block-details-border);
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .option-item {
    margin-right: 8px;
    cursor: pointer;
    color: var(--vp-c-text-1);
    font-size: 12px;
    &:hover {
      color: var(--vp-c-text-2);
    }
  }
}

.source-code {
  background-color: var(--vp-c-bg-soft);
  position: relative;
  border-top: 1px solid var(--vp-custom-block-details-border);
  border-radius: 0 0 var(--vp-border-radius) var(--vp-border-radius);
  font-size: 14px;
  .decode {
    padding: 0 16px;
  }
  .hide-code-btn {
    border-top: 1px solid var(--vp-custom-block-details-border);
    border-radius: 0 0 var(--vp-border-radius) var(--vp-border-radius);
    position: sticky;
    bottom: 0;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    background-color: var(--vp-c-bg);
    box-sizing: border-box;
    z-index: 10;
    .icon {
      margin-right: 8px;
    }
  }
}
</style>
