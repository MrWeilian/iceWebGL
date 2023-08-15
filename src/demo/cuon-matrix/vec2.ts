export class Vec2
{
  public elements: Float32Array;

  constructor(x: number = 0, y: number = 0)
  {
    this.elements = new Float32Array(2);

    this.elements[0] = x;
    this.elements[1] = y;
  }

  public add(other: Vec2)
  {
    this.x += other.x;
    this.y += other.y;

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
}
