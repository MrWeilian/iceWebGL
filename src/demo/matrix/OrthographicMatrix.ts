interface TSetPosition {
  (left: number, right: number, top: number, bottom: number, near: number, far: number): void
}

interface TOrthographicMatrix {
  elements: Float32Array
  setOrthographicPosition: TSetPosition
}


class OrthographicMatrix implements TOrthographicMatrix {
  elements: Float32Array

  constructor () {
    this.elements = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
  }

  setOrthographicPosition (left, right, top, bottom, near, far) {
    const rl = 1 / (right - left)
    const tb = 1 / (top - bottom)
    const nf = 1 / (near - far)

    const e = this.elements

    // 缩放位置
    e[0] = 2 * rl
    e[5] = 2 * tb
    e[10] = 2 * nf

    // 平移位置
    e[3] = (right + left) * rl
    e[7] = (top + bottom) * rl
    e[8] = (near + far) * rl
  }
}

export default OrthographicMatrix