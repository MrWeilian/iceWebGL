interface TLookAt {
  (cX: number, cY: number, cZ: number, tX: number, tY: number, tZ: number, uX: number, uY: number, uZ: number): void
}

class ViewMatrix {
  elements: number[]

  constructor () {
    this.elements = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  }

  lookAt: TLookAt = function (cX: number, cY: number, cZ: number, tX: number, tY: number, tZ: number, uX: number, uY: number, uZ: number) {

  }
}

export default ViewMatrix
