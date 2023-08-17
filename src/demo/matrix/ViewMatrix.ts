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

    zX = -(tX - cX)
    zY = -(tY - cY)
    zZ = -(tZ - cZ)
    let vecLen = zX*zX + zY*zY + zZ*zZ
    zX /= vecLen
    zY /= vecLen
    zZ /= vecLen

    // Z x U
    xX = zY*uZ - zZ*uY
    xY = zX*uZ - zZ*uX
    xZ = zX*uY - zY*uX
    vecLen = xX*xX + xY*xY + xZ*xZ
    xX /= vecLen
    xY /= vecLen
    xZ /= vecLen

    const e = this.elements

    e[0] = xX
    e[1] = uX
    e[2] = zX
    e[4] = xY
    e[5] = uY
    e[6] = zY
    e[8] = xZ
    e[9] = uZ
    e[10] = zZ

    console.log('lookAt', e)
  }
}

export default ViewMatrix
