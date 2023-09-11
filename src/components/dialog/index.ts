import { reactive } from 'vue'
export { default as Dialog } from './Dialog.vue'
import './Dialog.scss'

export const dialogStore = reactive({
  openDialogsCount: 0,
})
