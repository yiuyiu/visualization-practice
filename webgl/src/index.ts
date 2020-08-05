import { initShaderProgram } from '../../utils';
var canvas = document.querySelector("canvas");
var gl = canvas.getContext("webgl");
gl.clearColor(1, 0.5, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
const V_SHADER_SOURCE = `
    void main(){
        gl_Position = vec4(0,0,0,1.0);
        gl_PointSize = 10.0;
    }
`;
const F_SHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
`
initShaderProgram(gl, V_SHADER_SOURCE, F_SHADER_SOURCE);
gl.drawArrays(gl.POINTS, 1, 1);