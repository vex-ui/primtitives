import type { FunctionalComponent } from 'vue'

export interface TagProps {
  /**
   * specifies the tag color
   * @default 'primary'
   */
  color?: 'primary' | 'accent' | 'success' | 'danger' | 'warning'
}

const Tag: FunctionalComponent<TagProps & Record<string, string>> = (p, { slots }) => {
  return <span class={['vex-tag', `--c-${p.color}`]}>{slots.default?.()}</span>
}

Tag.props = ['color']
export default Tag
