//A cube mesh with UVs which displays with renderer components when
//the mesh is not overridden using setModel.
const defaultMesh = `
	# Blender v2.79 (sub 0) OBJ File: ''
# www.blender.org
v -1.000000 -1.000000 1.000000
v -1.000000 1.000000 1.000000
v -1.000000 -1.000000 -1.000000
v -1.000000 1.000000 -1.000000
v 1.000000 -1.000000 1.000000
v 1.000000 1.000000 1.000000
v 1.000000 -1.000000 -1.000000
v 1.000000 1.000000 -1.000000
vt 0.666667 0.333333
vt 0.333333 0.333333
vt 0.333333 0.000000
vt 0.666667 0.000000
vt 0.333333 0.666667
vt 0.000000 0.666667
vt 0.000000 0.333333
vt 0.333333 0.333333
vt 0.000000 0.000000
vt 0.333333 0.000000
vt 0.333333 0.666667
vt 0.333333 0.333333
vt 0.666667 0.333333
vt 0.666667 0.666667
vt 1.000000 0.333333
vt 0.666667 0.333333
vt 0.666667 0.000000
vt 1.000000 0.000000
vt 0.333333 0.666667
vt 0.333333 1.000000
vt 0.000000 1.000000
vt 0.000000 0.666667
vn -1.0000 0.0000 0.0000
vn 0.0000 0.0000 -1.0000
vn 1.0000 0.0000 0.0000
vn 0.0000 0.0000 1.0000
vn 0.0000 -1.0000 0.0000
vn 0.0000 1.0000 0.0000
s off
f 1/1/1 2/2/1 4/3/1 3/4/1
f 3/5/2 4/6/2 8/7/2 7/8/2
f 7/8/3 8/7/3 6/9/3 5/10/3
f 5/11/4 6/12/4 2/13/4 1/14/4
f 3/15/5 7/16/5 5/17/5 1/18/5
f 8/19/6 4/20/6 2/21/6 6/22/6
`

function Game(gl){
	this.gl = gl;
	this.scene = [];
	this.camera = null;
	
	this.setMainCamera = function(camera){
		this.camera = camera;
	}
}
//All objects in a game are made by adding components to an entity.
function Entity(gameObject){
	this.gl = gameObject.gl;
	this.transform = new Transform();
	this.components = {};
	
	this.addComponent = function(name, component){
		this.components[name] = component;
	}
}

function Transform(){
	this.pos = [0, 0, 0];
	this.rot = [0, 0, 0];
	this.scale = [0, 0, 0];
}

function Renderer(entity){
	entity.addComponent("renderer", this);
	this.gl = entity.gl;
	this.mesh = new OBJ.Mesh(defaultMesh);
	OBJ.initMeshBuffers(this.gl, this.mesh);
	this.shaderProgram = null;
	
	this.setModel = function(model){
		this.mesh = model;
		OBJ.initMeshBuffers(this.gl, this.mesh);
	}
	this.setShader = function(shaderProgram){
		this.shaderProgram = shaderProgram;
		this.gl.useProgram(this.shaderProgram);
		
		this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexPosition");
		this.shaderProgram.vertexNormalAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexNormal");
		this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(shaderProgram, "aTextureCoord");
	
		var lightDir = this.gl.getUniformLocation(shaderProgram, "uReverseLightDirection");
		this.gl.uniform3fv(lightDir, [0.5, 0.7, 1]);
	}
	this.setTexture = function(tex){
		this.uSamplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
		this.texture = tex;
	}
}
function Camera(gameObject){
	Entity.call(this, gameObject);
	gameObject.setMainCamera(this);
	this.setup = function(fov, near, far){
		this.fov = fov;
		this.near = near;
		this.far = far;
	}
}

