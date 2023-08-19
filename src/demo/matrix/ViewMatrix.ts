interface TLookAt {
  (cX: number, cY: number, cZ: number, tX: number, tY: number, tZ: number, uX: number, uY: number, uZ: number): void
}

interface TTranslate {
  (cX: number, cY: number, cZ: number): void
}

interface TViewMatrix {
  elements: number[]
  lookAt: TLookAt
  translate: TTranslate
}

class ViewMatrix implements TViewMatrix{
  elements: number[]

  constructor () {
    this.elements = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  }

  lookAt (cX: number, cY: number, cZ: number, tX: number, tY: number, tZ: number, uX: number, uY: number, uZ: number) {
    let xX, xY, xZ, yX, yY, yZ, zX, zY, zZ, xToNormal, zToNormal

    // 求 Z 轴
    zX = tX - cX
    zY = tY - cY
    zZ = tZ - cZ
    zToNormal = 1/ Math.sqrt(zX * zX + zY * zY + zZ * zZ)
    zX *= zToNormal
    zY *= zToNormal
    zZ *= zToNormal

    // 叉乘求 X 轴
    xX = zY * uZ - zZ * uY
    xY = zZ * uX - zX * uZ
    xZ = zX * uY - zY * uX
    xToNormal = 1/ Math.sqrt(xX * xX + xY * xY + xZ * xZ)
    xX *= xToNormal
    xY *= xToNormal
    xZ *= xToNormal

    yX = zZ * xY - zY * xZ
    yY = zX * xZ - zZ * xX
    yZ = zY * xX - zX * xY

    const e = this.elements

    e[0] = xX
    e[1] = yX
    e[2] = -zX
    e[4] = xY
    e[5] = yY
    e[6] = -zY
    e[8] = xZ
    e[9] = yZ
    e[10] = -zZ

    this.translate(-cX, -cY, -cZ)
  }

  translate (cX: number, cY: number, cZ: number) {
    const e = this.elements

    e[12] += e[0] * cX + e[4] * cY + e[8] * cZ
    e[13] += e[1] * cX + e[5] * cY + e[9] * cZ
    e[14] += e[2] * cX + e[6] * cY + e[10] * cZ
  }
}

export default ViewMatrix
