import { defineConfig } from 'vitepress'
import { sidebar, mdPlugin } from './configs'
import fs from 'fs'
import path from 'path'

const vpRoot = path.resolve(__dirname, '../')

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'iceWebGl',
  description: 'iceWebGl是WebGl零基础、系统性的学习指南电子书。WebGl上车指南；零基础学习WebGL；渐进式学习WebGl；系统化全面学习WebGl。',
  lastUpdated: true,
  markdown: {
    config: (md) => mdPlugin(md)
  },
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/images/logo.png'
      }
    ],
    [
      'script',
      {},
      `var _hmt = _hmt || [];
      (function() {
        if (location.host.includes('localhost')) return;
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?a84e5bcfbdb6e96bed2d847adf7271da";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`
    ]
  ],
  themeConfig: {
    logo: '/images/logo.png',
    nav: [
      { text: '🧊 上车指南', activeMatch: '^/content', link: '/content/一、前言/1. 导读' }
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MrWeilian/iWebGl' }
    ],

    footer: {
      message: '未经允许不得随意转载',
      copyright: 'Copyright © 2023-present  <a href="https://github.com/MrWeilian/iceWebGl">井柏然</a>'
    }
  }
})
