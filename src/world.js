// CSE160 Assignment 1
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  void main(){
    if (u_whichTexture == -2) {
        gl_FragColor = u_FragColor;
    } else if(u_whichTexture == -1){
        gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0){
        gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1){
        gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else{
        gl_FragColor = vec4(1,.2,.2,1);
    }
  }`

//Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
}

function initTextures() {
    var image = new Image();  // Create the image object
    if (!image) {
        console.log('Failed to create the image object');
        return false;
    }
    image.onload = function(){ sendTexutreToGLSL(image); };
    image.src = 'sky.jpg';

    var grass = new Image();  // Create the image object
    if (!grass) {
        console.log('Failed to create the grass object');
        return false;
    }
    grass.onload = function(){ sendTexutreToGLSL1(grass); };
    grass.src = 'grass.jpg';
    return true;
}

function sendTexutreToGLSL(image) {
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);

    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the rectangle
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    console.log('finished loadTexture');
}

function sendTexutreToGLSL1(image) {
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE1);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler1, 1);

    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the rectangle
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    console.log('finished loadTexture');
}


function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if(!u_whichTexture){
        console.log('Failed to get the storage location of u_whichTexture');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(!u_ModelMatrix){
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if(!u_GlobalRotateMatrix){
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    if (!u_ViewMatrix) {
        console.log("Failed to get the storage location of u_ViewMatrix");
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get u_ProjectionMatrix');
        return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if(!u_Sampler0){
        console.log('Failed to get the storage location of u_Sampler0');
        return;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if(!u_Sampler1){
        console.log('Failed to get the storage location of u_Sampler1');
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

let eyeScaleX = 1.0;
let tailRotationAngle = 0;

function renderAllShapes(){
    var startTime = performance.now();

    // var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    var projMat = new Matrix4();
    projMat.setPerspective(90, canvas.width/canvas.height, .1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(0, 0, -1, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
    
    var globalRotMat = new Matrix4();
    globalRotMat.rotate(-g_globalAngleY, 1, 0, 0)
             .rotate(-g_globalAngleX, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Clear <canvas>   
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var body = new Cube();
    body.color = [0.6, 0.4, 0.2, 1.0];
    body.matrix.translate(0.5, -0.25, 0.0);
    body.matrix.rotate(90, 0, 0, 1);
    var bodyCoor = new Matrix4(body.matrix);
    body.matrix.scale(0.4, 1, 0.3);
    body.render();

    //ground
    var ground = new Cube();
    ground.color = [1, 0, 0, 1];
    ground.textureNum = 1;
    ground.matrix.translate(-10, -0.6, -10);
    ground.matrix.scale(30, 0, 30);
    ground.render();

    var sky = new Cube();
    sky.color = [135 / 255, 206 / 255, 235 / 255, 1];
    sky.textureNum = 0;
    sky.matrix.scale(50, 50, 50);
    sky.matrix.translate(-.5, -.5, -.5);
    sky.render();

    var neck = new Cube();
    neck.color = [0.6, 0.4, 0.2, 1.0];
    neck.matrix = bodyCoor;
    neck.matrix.translate(0.3, 0.7, 0.075);
    neck.matrix.scale(0.5, 0.3, 0.15);
    neck.matrix.rotate(10, 0, 0, 1);
    neck.matrix.rotate(g_neckAngle, 0, 0, 1);
    var neckCoor = new Matrix4(neck.matrix);
    neck.render();

    var head = new Cube();
    head.color = [0.6, 0.4, 0.2, 1.0];
    head.matrix = bodyCoor;
    head.matrix.translate(0.5, 0.7, 0.0);
    head.matrix.rotate(10, 0, 0, 1)
    head.matrix.rotate(g_headAngle, 0, 0, 1)
    var headCoor = new Matrix4(head.matrix);
    head.matrix.scale(0.5, 1, 1);
    head.render();

    var lefteye = new Cube();
    lefteye.color = [1.0, 1.0, 1.0, 1.0];
    lefteye.matrix = bodyCoor;
    var eyeCoor = new Matrix4(lefteye.matrix);
    lefteye.matrix.translate(0.6, 0.6, -0.05);
    if (shift){
        lefteye.matrix.scale(0.3 * eyeScaleX, 0.3, 0.1);
    }else{
        lefteye.matrix.scale(0.3, 0.3, 0.1);
        lefteye.matrix.rotate(g_eyeAngle, 0, 0, 1);
    }
    lefteye.render();

    var lefteyeball = new Cube();
    lefteyeball.color = [0.0, 0.0, 0.0, 1.0];
    lefteyeball.matrix = bodyCoor;
    lefteyeball.matrix.translate(0.2, 0.6, -0.1);
    lefteyeball.matrix.scale(0.3, 0.3, 0.1);
    lefteyeball.matrix.rotate(g_eyeBallAngle, 0, 0, 1);
    lefteyeball.render();

    var righteye = new Cube();
    righteye.color = [1.0, 1.0, 1.0, 1.0];
    righteye.matrix = eyeCoor;
    righteye.matrix.translate(0.6, 0.6, 1);
    if (shift){
        righteye.matrix.scale(0.3 * eyeScaleX, 0.3, 0.1);
    }else{
        righteye.matrix.scale(0.3, 0.3, 0.1);
        righteye.matrix.rotate(g_eyeAngle, 0, 0, 1);
    }
    righteye.render();

    var righteyeball = new Cube();
    righteyeball.color = [0.0, 0.0, 0.0, 1.0];
    righteyeball.matrix = bodyCoor;
    righteyeball.matrix.translate(0, 0, 115.1);
    righteyeball.matrix.scale(1, 1, 1);
    righteyeball.matrix.rotate(g_eyeBallAngle, 0, 0, 1);
    righteyeball.render();

    var nose = new Cube();
    nose.color = [1.0, 1.0, 1.0, 1.0];
    nose.matrix = headCoor;
    nose.matrix.translate(0.2, 1, 0.4);
    nose.matrix.scale(0.2, 0.1, 0.3);
    nose.render();

    var leftEar = new Cube();
    leftEar.color = [0.6, 0.4, 0.9, 1.0];
    leftEar.matrix = headCoor;
    leftEar.matrix.translate(1.5, -10, 0.75);
    leftEar.matrix.scale(1, 0.5, 0.5);
    leftEar.render();

    var rightEar = new Cube();
    rightEar.color = [0.6, 0.4, 0.9, 1.0];
    rightEar.matrix = headCoor;
    rightEar.matrix.translate(0, 0, -3);
    rightEar.render();

    var hair = new Cube();
    hair.color = [0.7, 0.45, 0.2, 1.0];
    hair.matrix = neckCoor;
    hair.matrix.translate(0, -0.2, 0.0);
    hair.matrix.scale(1, 0.2, 1);
    hair.render();

    var tail = new Cylinder();
    tail.height = 5;
    tail.radius = 0.5;
    tail.color = [0.7, 0.45, 0.2, 1.0];
    tail.matrix.translate(0.5, -0.175, 0.125);
    tail.matrix.scale(0.05, 0.15, 0.05);
    tail.matrix.rotate(-90, 1, 1, 0);
    if(shift){
        tail.matrix.translate(0, -0.5, 0);
        tail.matrix.rotate(tailRotationAngle, 1, 0, 0);
    }
    
    tail.render();

    var leftArm1 = new Cube();
    leftArm1.color = [0.6, 0.4, 0.2, 1.0];
    leftArm1.matrix.translate(-0.45, -0.45, 0.0);
    leftArm1.matrix.scale(0.1, 0.25, .1);
    leftArm1.matrix.rotate(g_runAngle, 0, 0, 1);
    leftArm1.render();

    var leftArm2 = new Cube();
    leftArm2.color = [1.0, 1.0, 1.0, 1.0];
    leftArm2.matrix = leftArm1.matrix;
    leftArm2.matrix.translate(-0, -0.25, 0.0);
    leftArm2.matrix.scale(1, 0.25, 1);
    leftArm2.textureNum = -1;
    leftArm2.render();

    var rightArm1 = new Cube();
    rightArm1.color = [0.6, 0.4, 0.2, 1.0];
    rightArm1.matrix.translate(-0.45, -0.45, 0.2);
    rightArm1.matrix.scale(0.1, 0.25, .1);
    rightArm1.matrix.rotate(-g_runAngle, 0, 0, 1);
    rightArm1.render();

    var rightArm2 = new Cube();
    rightArm2.color = [1.0, 1.0, 1.0, 1.0];
    rightArm2.matrix = rightArm1.matrix;
    rightArm2.matrix.translate(-0, -0.25, 0.0);
    rightArm2.matrix.scale(1, 0.25, 1);
    rightArm2.textureNum = -1;
    rightArm2.render();

    var leftLeg1 = new Cube();
    leftLeg1.color = [0.6, 0.4, 0.2, 1.0];
    leftLeg1.matrix.translate(0.35, -0.45, 0.0);
    leftLeg1.matrix.scale(0.1, 0.25, .1);
    leftLeg1.matrix.rotate(g_runAngle, 0, 0, 1);
    leftLeg1.render();

    var leftLeg2 = new Cube();
    leftLeg2.color = [1.0, 1.0, 1.0, 1.0];
    leftLeg2.matrix = leftLeg1.matrix;
    leftLeg2.matrix.translate(0, -0.25, 0.0);
    leftLeg2.matrix.scale(1, 0.25, 1);
    leftLeg2.textureNum = -1;
    leftLeg2.render();

    var rightLeg1 = new Cube();
    rightLeg1.color = [0.6, 0.4, 0.2, 1.0];
    rightLeg1.matrix.translate(0.35, -0.45, 0.2);
    rightLeg1.matrix.scale(0.1, 0.25, .1);
    rightLeg1.matrix.rotate(-g_runAngle, 0, 0, 1);
    rightLeg1.render();

    var rightLeg2 = new Cube();
    rightLeg2.color = [1.0, 1.0, 1.0, 1.0];
    rightLeg2.matrix = rightLeg1.matrix;
    rightLeg2.matrix.translate(0, -0.25, 0.0);
    rightLeg2.matrix.scale(1, 0.25, 1);
    rightLeg2.textureNum = -1;
    rightLeg2.render();

    var duration = performance.now() - startTime;
    sendTexttoHTML(" ms: " + Math.floor(duration) + " FPS: " + Math.floor(10000 / duration), "numdot");
}

// let g_globalAngle = 0;
let g_globalAngleX = 0;
let g_globalAngleY = 0;

let g_animationOn = false;
let shift = false;

function funcShiftKey(event) {
    if (event.shiftKey && event.target === canvas) {
        shift = true;
        g_animationOn = false;
    } else {
        shift = false;
    }
}

let g_runAngle = 0;
let g_neckAngle = 0;
let g_headAngle = 0;
let g_eyeAngle = 0;
let g_eyeBallAngle = 0;


function addActionsForHtmlUI(){
    document.getElementById('animationYellowOffButton').onclick = function () { g_animationOn = false; };
    document.getElementById('animationYellowOnButton').onclick = function () { g_animationOn = true; };

    document.getElementById('angleSlideX').addEventListener('mousemove', function () { g_globalAngleX = parseInt(this.value); renderAllShapes(); });
    document.getElementById('angleSlideY').addEventListener('mousemove', function () { g_globalAngleY = parseInt(this.value); renderAllShapes(); });
    document.getElementById('runAngle').addEventListener('mousemove', function () { g_runAngle = parseInt(this.value); renderAllShapes(); });
    document.getElementById('neckAngle').addEventListener('mousemove', function () { g_neckAngle = parseInt(this.value); renderAllShapes(); });
    document.getElementById('headAngle').addEventListener('mousemove', function () { g_headAngle = parseInt(this.value); renderAllShapes(); });
    document.getElementById('eyeAngle').addEventListener('mousemove', function () { g_eyeAngle = parseInt(this.value); renderAllShapes(); });
    document.getElementById('eyeBallAngle').addEventListener('mousemove', function () { g_eyeBallAngle = parseInt(this.value); renderAllShapes(); });
}

function sendTexttoHTML(text, htmlID) {
    var htmlElem = document.getElementById(htmlID);
    if (!htmlElem) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElem.innerHTML = text;
}

var mouseDown = false;
var lastMouseX = -1;
var lastMouseY = -1;
function handleMouseDown(event) {
    if (event.target === canvas) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
}

function handleMouseUp(event) {
    if (mouseDown && event.target == canvas) {
        mouseDown = false;
    }
}


function handleMouseMove(event) {
    var newX = event.clientX;
    var newY = event.clientY;
    if (mouseDown) {
        var deltaX = newX - lastMouseX;
        var deltaY = newY - lastMouseY;

        rotateModel(deltaX, deltaY);
    }
    lastMouseX = newX;
    lastMouseY = newY;
}

function rotateModel(deltaX, deltaY) {
    g_globalAngleX += deltaX;
    g_globalAngleY += deltaY;
    // console.log(deltaX, deltaY, g_globalAngleX, g_globalAngleY)
    g_globalAngleX = Math.max(Math.min(g_globalAngleX, 180), -180);
    g_globalAngleY = Math.max(Math.min(g_globalAngleY, 90), -90);
    document.getElementById('angleSlideX').value = g_globalAngleX;
    document.getElementById('angleSlideY').value = g_globalAngleY;

    renderAllShapes();
}


function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();
    initTextures();
    // gl.clearColor(255.0, 0.0, 0.0, 1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    canvas.onmousedown = handleMouseDown;
    canvas.onmouseup = handleMouseUp;
    canvas.onmousemove = handleMouseMove;
    requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000;
var g_seconds = performance.now()/1000 - g_startTime;

function tick() {
    g_seconds = performance.now()/1000 - g_startTime;

    if(g_animationOn){
        g_runAngle = 10 * Math.sin(g_seconds);
        g_neckAngle = 5 * Math.sin(g_seconds);
        g_headAngle = 5 * Math.sin(g_seconds);
    }else if (shift) {
        eyeScaleX = 0.5 + 0.5 * Math.sin(2*g_seconds);
        tailRotationAngle = 20 * Math.sin(g_seconds * 3);
    }
    renderAllShapes();
    requestAnimationFrame(tick);
}
