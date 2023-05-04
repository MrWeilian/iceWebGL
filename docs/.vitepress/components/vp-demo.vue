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
<!--      <iframe class="elp-iframe"-->
<!--              :class="{ 'full-screen-iframe': isFullScreen }"-->
<!--              :src="`${baseUrl[props.libType]}#/${props.iframeSrc}`"-->
<!--              :style="{ height: demoHeight }"-->
<!--      />-->
    </div>
    <div class="options">
<!--      <el-tooltip-->
<!--          content="全屏预览"-->
<!--          placement="bottom"-->
<!--      >-->
<!--        <el-icon class="option-item" @click="handleToggleFullScreen"><FullScreen /></el-icon>-->
<!--      </el-tooltip>-->
<!--      <el-tooltip-->
<!--          content="复制代码"-->
<!--          placement="bottom"-->
<!--      >-->
<!--        <el-icon class="option-item" @click="copyCode"><CopyDocument /></el-icon>-->
<!--      </el-tooltip>-->
<!--      <el-tooltip-->
<!--          content="查看源码"-->
<!--          placement="bottom"-->
<!--      >-->
<!--        <span class="option-item code-btn" @click="handleToggleCode">&lt;/&gt;</span>-->
<!--      </el-tooltip>-->
    </div>
<!--    <El-collapse-transition>-->
<!--      <div class="source-code" v-if="isShowCode">-->
<!--        <div class="decode" v-html="decoded" />-->
<!--        <div class="hide-code-btn">-->
<!--          <el-button type="info" link :icon="CaretTop" @click="handleToggleCode">隐藏源代码</el-button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </El-collapse-transition>-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useClipboard } from '@vueuse/core';
import 'prismjs/themes/prism-tomorrow.css';

const iconColorArr = [{ name: '', color: '#fe5f57' }, { name: '', color: '#ffbc2d' }, { name: 'scale', color: '#27c83e' }]

</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "vp-demo"
})
</script>

<style scoped lang="scss">
$menu-height: 32px;
.demo {
  border: 1px solid var(--vp-c-brand);
  border-radius: 3px;
  overflow: hidden;
  .menu {
    border-radius: var(--vc-border-radius-base) var(--vc-border-radius-base) 0 0;
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
</style>