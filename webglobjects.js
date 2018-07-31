function Camera(fov, near, far){
	this.fov = fov;
	this.near = near;
	this.far = far;
}

function Transform(){
	this.pos = [0, 0, 0];
	this.rot = [0, 0, 0];
	this.scale = [0, 0, 0];
}

function Model(gl, model_id, shaderProgram){
	this.shaderProgram = shaderProgram;
	gl.useProgram(this.shaderProgram);
	this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	this.shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	this.shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	
	obj_src = OBJ_SRC;//document.getElementById(model_id).textContent;
	this.mesh = new OBJ.Mesh(obj_src);
	alert(obj_src);
	OBJ.initMeshBuffers(gl, this.mesh);
	
	this.transform = new Transform();
}

function Texture(gl, url){
	
}