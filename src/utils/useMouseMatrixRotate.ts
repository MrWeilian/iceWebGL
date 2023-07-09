import { ref } from 'vue'
import { Matrix4 } from 'three'

export function useMouseMatrixRotate (baseRotateX = 0, baseRotateY = 0) {
  let mousedownX = 0
  let mousedownY = 0

  const canDrag = ref(false)

  const mousemove = (e, gl, u_ModelMatrix, indices, mode = 'TRIANGLES') => {
    if (!canDrag.value) return
    const moveX = (mousedownX - e.offsetX + baseRotateX) % 360
    const moveY = (mousedownY - e.offsetY + baseRotateY) % 360

    const matrixX = new Matrix4()
    const matrixY = new Matrix4()
    const radianX = moveX * Math.PI / 180
    const radianY = moveY * Math.PI / 180
    matrixX.makeRotationY(radianX)
    matrixY.makeRotationX(radianY)
    matrixX.multiply(matrixY)
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrixX.elements)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.drawElements(gl[mode], indices.length, gl.UNSIGNED_BYTE, 0)
  }

  const mousedown = e => {
    canDrag.value = true
    mousedownX = e.offsetX
    mousedownY = e.offsetY
  }

  const mouseleave = () => {
    canDrag.value = false
  }

  const mouseup = e => {
    canDrag.value = false
    baseRotateX = (mousedownX - e.offsetX + baseRotateX) % 360
    baseRotateY = (mousedownY - e.offsetY + baseRotateY) % 360
  }

  return {
    mousemove,
    mousedown,
    mouseleave,
    mouseup
  }
}
