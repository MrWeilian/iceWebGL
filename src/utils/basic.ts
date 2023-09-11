export const createGl = (id: string): WebGLRenderingContext => {
  const canvas = document.querySelector(id) as HTMLCanvasElement
  const gl = canvas.getContext('webgl')
  return gl
}

export const createShader = (gl, type, sourceCode) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, sourceCode)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) return shader

  console.error('shader err >>>', type, gl.getShaderInfoLog(shader))
  gl.deleteShader(shader);
}

export const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.error('program err >>>', gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

export const createBuffer = (gl, target = gl.ARRAY_BUFFER, data, attribute, size, stride = 0, offset = 0) => {
  const buffer = gl.createBuffer()
  gl.bindBuffer(target, buffer)
  gl.bufferData(target, data, gl.STATIC_DRAW)
  gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, stride, offset)
  gl.enableVertexAttribArray(attribute)
}
