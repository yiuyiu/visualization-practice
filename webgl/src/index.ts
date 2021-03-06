const position = [
    0.0, 0.0,
    1.0, 0.0,
    0, 0.5,
    0.0, 0.5,
    1.0, 0.0,
    1.0, 0.5];
var r1 = Math.random();
var b1 = Math.random();
var g1 = Math.random();
var r2 = Math.random();
var b2 = Math.random();
var g2 = Math.random();
const colors = [
    r1,b1,g1,
    r1,b1,g1,
    r1,b1,g1,
    r2,b2,g2,
    r2,b2,g2,
    r2,b2,g2
]
function initWebGL(): WebGLRenderingContext {
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl');
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return gl;
}
function initShader(gl: WebGLRenderingContext) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, document.querySelector('#vertex').textContent);
    gl.compileShader(vertexShader);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, document.querySelector('#fragment').textContent);
    gl.compileShader(fragmentShader);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    console.log(gl.getProgramInfoLog(program));
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

    const xixiLocation = gl.getAttribLocation(program, 'a_xixi');
    gl.enableVertexAttribArray(xixiLocation);
    gl.vertexAttribPointer(xixiLocation, 2, gl.FLOAT, false, 0, 0);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);
}
function draw(gl: WebGLRenderingContext) {
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
function init() {
    const gl = initWebGL();
    initShader(gl);
    draw(gl);
}
init();
