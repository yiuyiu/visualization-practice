import { initShaders } from '../common/initShader';
import { add, flatten, scale, vec2 } from '../common/MV';
import WebGLUtils from '../common/webgl-utils'
var points;

var NumPoints = 5000;
class Turtle {
    constructor() {
        this._x = 0;
        this._y = 0;
        this._theta = 0;
        this._gl = null;
        this._points = [[0, 0]];
        this._init();
        this.forward = this.forward.bind(this);
        document.querySelector('#forward').addEventListener('click', () => {
            this.forward(1 / 100)
        })
        document.querySelector('#right').addEventListener('click', () => {
            this._turnRight(document.querySelector('#angle').value);
        })
    }
    init(x, y, theta) {
        this._x = x;
        this._y = y;
        this._theta = theta;
        this._points = [];
    }
    _init() {
        var canvas = document.getElementById("gl-canvas");

        const gl = WebGLUtils.setupWebGL(canvas);
        if (!gl) { alert("WebGL isn't available"); }

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this._gl = gl;
        //  Load shaders and initialize attribute buffers
        var program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);
        this._program = program;
        // Load the data into the GPU
        var bufferId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

        // Associate out shader variables with our data buffer

        var vPosition = gl.getAttribLocation(this._program, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        // this._gl.bufferData(gl.ARRAY_BUFFER, flatten(this._points), gl.STATIC_DRAW);
    };
    _render() {
        const gl = this._gl;
        this._gl.bufferData(gl.ARRAY_BUFFER, flatten(this._points), gl.STATIC_DRAW);

        this._gl.drawArrays(gl.LINE_STRIP, 0, this._points.length);
    }
    _turnRight(angle) {
        this._theta += angle;
    }
    forward(distance) {
        const lastone = this._points[this._points.length - 1];
        const radians = Math.PI * 2 * this._theta / 360;
        this._points.push([lastone[0] + distance * Math.cos(radians), lastone[1] + distance * Math.sin(radians)])
        this._render();
    }
}

new Turtle();