interface TSetPerspective {
  (fov: number, aspect: number, near: number, far: number): void
}

interface TPerspectiveMatrix {
  elements: Float32Array
  setPerspective: TSetPerspective
}

class PerspectiveMatrix implements TPerspectiveMatrix {
  elements: Float32Array

  constructor() {
    this.elements = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
  }

  setPerspective (fov, aspect, near, far) {
    const e = this.elements
    fov = Math.PI * fov / 180
    const f = 1 / Math.tan(fov / 2)
    e[0] = f / aspect
    e[5] = f
    e[10] = (near + far) / (near - far)
    e[11] = -1
    e[14] = (2 * near * far) / (near - far)
    e[15] = 0
  }
}

export default PerspectiveMatrix
