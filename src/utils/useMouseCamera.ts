import { ref } from 'vue'

interface TCameraOptions {
  moveOption: (diffX: number, diffY: number) => void
  upOption: (endX: number, endY: number) => void
}

const calc = (arg: number) => {
  const basic = 100
  return arg / basic
}

export function useMouseCamera ({ moveOption, upOption }: TCameraOptions) {

  const canDrag = ref(false)

  let mouseDownX = 0
  let mouseDownY = 0

  const mousemove = (e: MouseEvent) => {
    if (!canDrag.value) return

    const diffX = calc(e.offsetX - mouseDownX)
    const diffY = calc(e.offsetY - mouseDownY)
    
    moveOption(diffX, diffY)
  }

  const mousedown = (e: MouseEvent) => {
    canDrag.value = true
    
    mouseDownX = e.offsetX
    mouseDownY = e.offsetY
  }

  const mouseleave = () => {
    canDrag.value = false
  }

  const mouseup = (e: MouseEvent) => {
    canDrag.value = false
    const endX = calc(e.offsetX - mouseDownX)
    const endY = calc(e.offsetY - mouseDownY)

    upOption(endX, endY)
  }

  return {
    mousemove,
    mousedown,
    mouseleave,
    mouseup
  }
}
