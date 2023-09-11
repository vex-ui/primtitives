import * as components from '../components'
// import * as directives from '../directives'

import type { Plugin } from 'vue'

export const vex: Plugin = {
  install(app) {
    Object.keys(components).forEach((c) => {
      app.component(c, components[c])
    })
  },
}
