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

export const createBuffer = (gl, target = gl.ARRAY_BUFFER, vertices, attribute, size) => {
  const buffer = gl.createBuffer()
  gl.bindBuffer(target, buffer)
  gl.bufferData(target, vertices, gl.STATIC_DRAW)
  gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(attribute)
}
