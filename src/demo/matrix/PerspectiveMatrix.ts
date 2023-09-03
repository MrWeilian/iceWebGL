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
    e[11] = 1
    e[14] = (-2 * near * far) / (near - far)
    e[15] = 0

    // const out = this.elements
    // const f = 1 / Math.tan(fov / 2);
    // out[0] = f / aspect;
    // out[1] = 0;
    // out[2] = 0;
    // out[3] = 0;
    // out[4] = 0;
    // out[5] = f;
    // out[6] = 0;
    // out[7] = 0;
    // out[8] = 0;
    // out[9] = 0;
    // out[11] = -1;
    // out[12] = 0;
    // out[13] = 0;
    // out[15] = 0;
    // if (far != null && far !== Infinity) {
    //   const nf = 1 / (near - far);
    //   out[10] = (far + near) * nf;
    //   out[14] = 2 * far * near * nf;
    // } else {
    //   out[10] = -1;
    //   out[14] = -2 * near;
    // }
  }
}

export default PerspectiveMatrix