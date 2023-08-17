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
    let xX, xY, xZ, yX, yY, yZ, zX, zY, zZ

    zX = -(cX - tX)
    zY = -(cY - tY)
    zZ = -(cZ - tZ)
    const vecLen = zX*zX + zY*zY + zZ*zZ
    zX /= vecLen
    zY /= vecLen
    zZ /= vecLen

    // xX =

    console.log(zX, zY, zZ)
  }
}

export default ViewMatrix
