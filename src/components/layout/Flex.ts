import { type FunctionalComponent, h } from 'vue'

interface Props {
  direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch'
  alignContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'stretch'
    | 'normal'
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  gap?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  inline?: boolean
  wrap?: boolean
}

const Flex: FunctionalComponent<Props & Record<string, any>> = (props, { slots }) => {
  return h(
    'div',
    {
      style: {
        display: props.inline ? 'inline-flex' : 'flex',
        flexWrap: props.wrap ? 'wrap' : 'nowrap',
        flexDirection: props.direction ?? 'row',
        justifyContent: props.justifyContent ?? 'flex-start',
        alignItems: props.alignItems ?? 'center',
        alignContent: props.alignContent ?? 'normal',
        gap: props.gap && `var(--vex-spacing-${props.gap})`,
      },
    },

    slots?.default?.()
  )
}

Flex.inheritAttrs = true
Flex.props = {
  alignContent: String,
  justifyContent: String,
  alignItems: String,
  gap: String,
  direction: String,
  inline: Boolean,
  wrap: Boolean,
}

export default Flex
