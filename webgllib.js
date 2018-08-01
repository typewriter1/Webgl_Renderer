var engine = {};
engine.Game = Game;

loader = {};
loader.texture = loadTexture;
loader.model = loadModel;
engine.loader = loader;
var gl;
engine.setWebglContext = function(id) {
	var canvas = document.querySelector(id);
	gl = canvas.getContext("webgl");
	if (!gl) {
		alert("Unable to initialize WebGl. Your browser may not support it");
		return;
	}
	
	gl.clearColor(0.6, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}



engine.compileShader = function(vert, frag) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vert);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, frag);
	
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize shader: " + gl.getProgramInfoLog(shaderProgram));
		return null;
	}
	
	return shaderProgram;
}

function loadShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("Error while compiling shader: " + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function initBuffers(gl) {
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Now create an array of positions for the square.

	const positions = [
	  // Front face
	  -1.0, -1.0,  1.0,
	   1.0, -1.0,  1.0,
	   1.0,  1.0,  1.0,
	  -1.0,  1.0,  1.0,
	  
	  // Back face
	  -1.0, -1.0, -1.0,
	  -1.0,  1.0, -1.0,
	   1.0,  1.0, -1.0,
	   1.0, -1.0, -1.0,
	  
	  // Top face
	  -1.0,  1.0, -1.0,
	  -1.0,  1.0,  1.0,
	   1.0,  1.0,  1.0,
	   1.0,  1.0, -1.0,
	  
	  // Bottom face
	  -1.0, -1.0, -1.0,
	   1.0, -1.0, -1.0,
	   1.0, -1.0,  1.0,
	  -1.0, -1.0,  1.0,
	  
	  // Right face
	   1.0, -1.0, -1.0,
	   1.0,  1.0, -1.0,
	   1.0,  1.0,  1.0,
	   1.0, -1.0,  1.0,
	  
	  // Left face
	  -1.0, -1.0, -1.0,
	  -1.0, -1.0,  1.0,
	  -1.0,  1.0,  1.0,
	  -1.0,  1.0, -1.0,
	];
	// Now pass the list of positions into WebGL to build the
	// shape. We do this by creating a Float32Array from the
	// JavaScript array, then use it to fill the current buffer.

	gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);
				
	const faceColors = [
		[1.0,  1.0,  1.0,  1.0],    // Front face: white
		[1.0,  0.0,  0.0,  1.0],    // Back face: red
		[0.0,  1.0,  0.0,  1.0],    // Top face: green
		[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
		[1.0,  1.0,  0.0,  1.0],    // Right face: yellow
		[1.0,  0.0,  1.0,  1.0],    // Left face: purple
	];

	// Convert the array of colors into a table for all the vertices.

	var colors = [];

	for (var j = 0; j < faceColors.length; ++j) {
		const c = faceColors[j];

    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }


	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	// This array defines each face as two triangles, using the
	// indices into the vertex array to specify each triangle's
	// position.

	const indices = [
		0,  1,  2,      0,  2,  3,    // front
		4,  5,  6,      4,  6,  7,    // back
		8,  9,  10,     8,  10, 11,   // top
		12, 13, 14,     12, 14, 15,   // bottom
		16, 17, 18,     16, 18, 19,   // right
		20, 21, 22,     20, 22, 23,   // left
	];

	// Now send the element array to GL

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
		new Uint16Array(indices), gl.STATIC_DRAW);

	return {
		position: positionBuffer,
		color: colorBuffer,
		indices: indexBuffer,
	};
}

function transformSystem(matrix, model){
	var transform = model.transform;
	//Used to move entities' matrices to their transform component.
	mat4.translate(matrix,    										  // destination matrix
			matrix,     											  // matrix to translate
			[transform.pos[0], transform.pos[1], transform.pos[2]]);  // amount to translate
						 
	mat4.rotate(matrix,  // destination matrix
			matrix,  // matrix to rotate
			transform.rot[0] * Math.PI / 180,   // amount to rotate in radians
			[1, 0, 0]);       // axis to rotate around
					
	mat4.rotate(matrix,  // destination matrix
				matrix,  // matrix to rotate
				transform.rot[1] * Math.PI / 180,   // amount to rotate in radians
				[0, 1, 0]);       // axis to rotate around
					
	mat4.rotate(matrix,  // destination matrix
				matrix,  // matrix to rotate
				transform.rot[2] * Math.PI / 180,   // amount to rotate in radians
				[0, 0, 1]);       // axis to rotate around
}


engine.renderSystem = function(gameObject, model) {
 
	gl.clearColor(0.3, 0.6, 0.8, 1.0);  // Clear to blue, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

	// Clear the canvas before we start drawing on it.

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if (gameObject.camera === null){
		throw "No main camera has been set.";
	}
	
	//set the camera variable to the main camera
	var camera = gameObject.camera;

	// Create a perspective matrix, a special matrix that is
	// used to simulate the distortion of perspective in a camera.
	// Our field of view is 45 degrees, with a width/height
	// ratio that matches the display size of the canvas
	// and we only want to see objects between 0.1 units
	// and 100 units away from the camera.

	const fieldOfView = camera.fov * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = camera.near; //0.1;
	const zFar = camera.far; //100.0;
	

	var projectionMatrix = mat4.create();
	// note: glmatrix.js always has the first argument
	// as the destination to receive the result.
	mat4.perspective(projectionMatrix,
					   fieldOfView,
					   aspect,
					   zNear,
					   zFar);
					   
	transformSystem(projectionMatrix, camera);

	// Set the drawing position to the "identity" point, which is
	// the center of the scene.


	var mesh = model.components["renderer"].mesh;
	var shaderProgram = model.components["renderer"].shaderProgram;
	
	var modelViewMatrix = mat4.create();
	// Now move the drawing position a bit to where we want to
	// start drawing the square.
	
	//All entities have transform components, so invoke the transform system.
	transformSystem(modelViewMatrix, model);

	OBJ.initMeshBuffers(gl, mesh);
	// Tell WebGL how to pull out the positions from the position
	// buffer into the vertexPosition attribute.
	{
		const numComponents = mesh.vertexBuffer.itemSize;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
		gl.vertexAttribPointer(
			shaderProgram.vertexPositionAttribute,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(
			shaderProgram.vertexPositionAttribute);
	}

	// Tell WebGL how to pull out the positions from the normal
	// buffer into the vertexPosition attribute.
	{
		const numComponents = mesh.normalBuffer.itemSize;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
		gl.vertexAttribPointer(
			shaderProgram.vertexNormalAttribute,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(
			shaderProgram.vertexNormalAttribute);
	}
	
	
	//Don't setup texture buffer if there isn't a texture.
	if(!mesh.textures.length){
		gl.disableVertexAttribArray(model.shaderProgram.textureCoordAttribute);
	}
	else{
		// if the texture vertexAttribArray has been previously
		// disabled, then it needs to be re-enabled
		gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
	}
	
	

	// Tell WebGL to use our program when drawing

	gl.useProgram(shaderProgram);

	// Set the shader uniforms

	gl.uniformMatrix4fv(
		gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
		false,
		projectionMatrix);
	gl.uniformMatrix4fv(
		gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
		false,
		modelViewMatrix);
		  
	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);

	// Bind the texture to texture unit 0
	gl.bindTexture(gl.TEXTURE_2D, model.components["renderer"].texture);

	// Tell the shader we bound the texture to texture unit 0
	gl.uniform1i(model.components["renderer"].uSamplerUniform, 0);



	{
		const offset = 0;
		const vertexCount = 36;
		const type = gl.UNSIGNED_SHORT;
		gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, type, offset);
	}
}

//Programs should call this function every frame.
engine.tick = function(game){
	for (entity of game.scene){
		engine.renderSystem(game, entity);
	}
}
//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(url) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Because images have to be download over the internet
	// they might take a moment until they are ready.
	// Until then put a single pixel in the texture so we can
	// use it immediately. When the image has finished downloading
	// we'll update the texture with the contents of the image.
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 255, 255, 255]);  // opaque blue
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
					width, height, border, srcFormat, srcType,
					pixel);

	const image = new Image();
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
					  srcFormat, srcType, image);

		// WebGL1 has different requirements for power of 2 images
		// vs non power of 2 images so check if the image is a
		// power of 2 in both dimensions.
		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			// Yes, it's a power of 2. Generate mips.
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			// No, it's not a power of 2. Turn of mips and set
			// wrapping to clamp to edge
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
	};
	image.src = url;

	return texture;
}

function loadModel(modelSource){
	model = new OBJ.Mesh(modelSource);
	return model;
}

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}
