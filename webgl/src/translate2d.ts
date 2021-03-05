const positions = [
    ...[0.25, 0.5, 0.75, 1, 0, -0.25, -0.5, -0.75, -1].map(item => ([item, -1, item, 1])).flat(),
    ...[0.25, 0.5, 0.75, 0, 1, -0.25, -0.5, -0.75, -1].map(item => ([-1, item, 1, item])).flat()];

function rotate(angleInRadians: number) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1,
    ];
};
const rangeEle = document.querySelector('#range') as HTMLInputElement;
let rotationMatrixLocation: WebGLUniformLocation = 0;
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const xixiLocation = gl.getAttribLocation(program, 'a_xixi');
    gl.enableVertexAttribArray(xixiLocation);
    gl.vertexAttribPointer(xixiLocation, 2, gl.FLOAT, false, 0, 0);

    const uColorLocation = gl.getUniformLocation(program, 'v_color');

    gl.useProgram(program);
    gl.uniform4fv(uColorLocation, [0, 0, 0, 1]);

    const uMatrixLocation = gl.getUniformLocation(program, 'u_matrix');
    rotationMatrixLocation = uMatrixLocation;
}
function draw(gl: WebGLRenderingContext) {
    const theta = rangeEle.value;
    // const theta = 360;
    gl.uniformMatrix3fv(rotationMatrixLocation, false, rotate(+theta / 180 * Math.PI));
    gl.drawArrays(gl.LINES, 0, 36);
}
function init() {
    const gl = initWebGL();
    initShader(gl);
    // draw(gl);
    // rangeEle.addEventListener('change',(e)=>{
    //     draw(gl);
    // })
    rangeEle.addEventListener('mousemove', e => {
        draw(gl);
    })
    draw(gl);
}
init();
export { }