import { defineConfig } from 'vitepress'
import Unocss from 'unocss/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  appearance: false,
  title: 'vex-ui',
  description:
    'A type safe vue 3 component library, vex-ui helps you build delightful user interfaces faster',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/button' },
    ],

    sidebar: [
      {
        collapsed: false,
        text: 'Getting started',
        items: [
          { text: 'introduction', link: '/getting-started/introduction' },
          { text: 'installation', link: '/getting-started/installation' },
        ],
      },
      {
        collapsed: false,
        text: 'Components',
        items: [
          { text: 'button', link: '/components/button' },
          { text: 'chip', link: '/components/chip' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/sherif414/vex-ui' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present <a href="https://github.com/sherif414">Shareef</a>',
    },
  },
  srcDir: 'src',
  vite: {
    plugins: [Unocss()],
  },
})
