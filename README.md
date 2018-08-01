# WebGL-pbr
A simple, easy to use WebGL library, supporting .obj model loading, textures and an Entity-Component-System setup.

__Note__: At the moment you have to write you own GLSL shaders. In the future, I plan to support PBR materials. To use textures, you have to run your HTML page from a server. Therefor, to test locally you must use a server. If you have python3 installed, you can setup a simple server by opening CMD or equivalent and running `python -m http.server` (with python 3) from the directory of the HTML file. Then open your browser and go to localhost:8000 (or whatever number it tells you). For this to work your HTML file must be called "index.html".

# Dependencies
This requires [gl-matrix](https://github.com/toji/gl-matrix) and [webgl-obj-loader](https://github.com/frenchtoast747/webgl-obj-loader).

# Setup
Unzip gl-matrix and webgl-obj-loader.

Include this somewhere in your page:

    <script src="path-to-gl-matrix/dist/gl-matrix-min.js"></script>
    <script src="path-to-webgl-obj-loader/dist/webgl-obj-loader.min.js"></script>
    <script src="program.js"></script>
Where program.js is the script you write.

Example program:

    const vertexShader = `
attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec3 normal;
varying highp vec2 tex_coord;
void main() {
	gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
	normal = mat3(uModelViewMatrix) * aVertexNormal;
	tex_coord = aTextureCoord;
}
`;

const fragmentShader = `
varying highp vec3 normal;
varying highp vec2 tex_coord;

uniform sampler2D uSampler;
uniform highp vec3 uReverseLightDirection;

void main () {
	// because v_normal is a varying it's interpolated
   // we it will not be a uint vector. Normalizing it
   // will make it a unit vector again
   highp vec3 normal = normalize(normal);
 
    highp float light = dot(normal, uReverseLightDirection);
	gl_FragColor = texture2D(uSampler, tex_coord);
	gl_FragColor.rgb *= light;
}
`;

engine.setWebglContext("#canvas");
var game = new engine.Game(gl);
const shaderProgram = engine.compileShader(vertexShader, fragmentShader);

var camera = new Camera(game);
camera.setup(70, 0.01, 100);
camera.transform.pos[0] = 9;

var mod = new Entity(game);
game.scene.push(mod);
var tex = engine.loader.texture("models/odd-tree2.png");
var renderer = new Renderer(mod);
renderer.setModel(engine.loader.model(OBJ_SRC));
renderer.setShader(shaderProgram);
renderer.setTexture(tex);
mod.transform.pos = [0, -4, -8];


var then = 0;

// Draw the scene repeatedly
function render(now) {
	now *= 0.001;  // convert to seconds
	var deltaTime = now - then;
	if (deltaTime > 0.02){
		deltaTime = 0.02
	}
	then = now;

	engine.tick(game);

	requestAnimationFrame(render);
	
	fps = 1 / deltaTime;
	document.getElementById("fps").innerHTML = "FPS:  " + fps;
	mod.transform.pos[1] += 1 * deltaTime;
}
requestAnimationFrame(render);

