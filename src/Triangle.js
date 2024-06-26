class Triangle{
    constructor(){
        this.type = "point";
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5;
    }

    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        // var xy = g_points[i];
        // var rgba = g_colors[i];
        // var size = g_sizes[i];


        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass the size of a point to u_Size variable
        gl.uniform1f(u_Size, size);
        // Draw
        // gl.drawTriangle(gl.POINTS, 0, 1);
        var d = this.size/200.0; //delta
        drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d] );
    }
}

function drawTriangle(vertices) {
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3D(vertices) {
    var n = vertices.length/3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUV(vertices, uv){
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}
function drawTriangle3DFast() {
    var allverts = [];
    var alluvs = [];

    // Front
    allverts = allverts.concat([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0]);
    alluvs = alluvs.concat([1, 0, 0, 1, 0, 0]);
    allverts = allverts.concat([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0]);
    alluvs = alluvs.concat([1, 0, 1, 1, 0, 1]);

    // Back
    allverts = allverts.concat([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0]);
    alluvs = alluvs.concat([0, 0, 1, 1, 1, 0]);
    allverts = allverts.concat([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
    alluvs = alluvs.concat([0, 0, 0, 1, 1, 1]);

    // Top
    allverts = allverts.concat([0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
    alluvs = alluvs.concat([0, 0, 1, 0, 1, 1]);
    allverts = allverts.concat([0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
    alluvs = alluvs.concat([0, 1, 0, 0, 1, 1]);

    // Bottom
    allverts = allverts.concat([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0]);
    alluvs = alluvs.concat([0, 0, 0, 1, 1, 0]);
    allverts = allverts.concat([1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0]);
    alluvs = alluvs.concat([1, 0, 1, 1, 0, 1]);

    // Left
    allverts = allverts.concat([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0]);
    alluvs = alluvs.concat([0, 0, 0, 1, 1, 1]);
    allverts = allverts.concat([0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
    alluvs = alluvs.concat([1, 1, 0, 0, 1, 0]);

    // Right
    allverts = allverts.concat([1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
    alluvs = alluvs.concat([1, 0, 1, 1, 0, 1]);
    allverts = allverts.concat([1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0]);
    alluvs = alluvs.concat([0, 1, 1, 0, 0, 0]);

    // Create and bind the vertex buffer
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allverts), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Create and bind the UV buffer
    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alluvs), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    // Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, allverts.length / 3);
}