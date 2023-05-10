import { defineConfig } from 'vitepress'
import { sidebar, mdPlugin } from './configs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "iceWebGl",
  description: 'iceWebGl',
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
      message: '',
      copyright: 'Copyright © 2023-present 井柏然'
    }
  }
})
