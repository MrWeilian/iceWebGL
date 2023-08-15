// adapted to typescript from https://github.com/yukoba/WebGLBook/blob/master/lib/cuon-matrix.js

export class Vec3
{
  public elements: Float32Array;

  constructor(x: number = 0, y: number = 0, z: number = 0)
  {
    this.elements = new Float32Array(3);

    this.elements[0] = x;
    this.elements[1] = y;
    this.elements[2] = z;
  }

  public normalize()
  {
    let v = this.elements;
    let c = v[0], d = v[1], e = v[2], g = Math.sqrt(c * c + d * d + e * e);
    if (g)
    {
      if (g === 1)
      {
        return this;
      }
    } else
    {
      v[0] = 0; v[1] = 0; v[2] = 0;
      return this;
    }
    g = 1 / g;
    v[0] = c * g; v[1] = d * g; v[2] = e * g;
    return this;
  }

  public add(other: Vec3)
  {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;

    return this;
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
}
