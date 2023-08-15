// adapted to typescript from https://github.com/yukoba/WebGLBook/blob/master/lib/cuon-matrix.js

export class Vec4
{
  public elements: Float32Array;

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1)
  {
    this.elements = new Float32Array(4);

    this.elements[0] = x;
    this.elements[1] = y;
    this.elements[2] = z;
    this.elements[3] = w;
  }

  public get x(): number
  {
    return this.elements[0];
  }

  public set x(value: number)
  {
    this.elements[0] = value;
  }

  public get y(): number
  {
    return this.elements[1];
  }

  public set y(value: number)
  {
    this.elements[1] = value;
  }

  public get z(): number
  {
    return this.elements[2];
  }

  public set z(value: number)
  {
    this.elements[2] = value;
  }

  public get w(): number
  {
    return this.elements[3];
  }

  public set w(value: number)
  {
    this.elements[3] = value;
  }
}
