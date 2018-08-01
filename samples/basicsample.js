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
uniform highp vec4 uLightColor;

void main () {
	// because v_normal is a varying it's interpolated
   // we it will not be a uint vector. Normalizing it
   // will make it a unit vector again
   highp vec3 normal = normalize(normal);
 
    highp float lightWeights = max(dot(normal, uReverseLightDirection), 0.0);
	highp vec4 color = texture2D(uSampler, tex_coord);
	gl_FragColor = vec4(color.rgb * (uLightColor.rgb * lightWeights), color.a) + vec4(0.2, 0.2, 0.2, 0.0);
}
`;

engine.setWebglContext("#canvas");
var game = new engine.Game(gl);
const shaderProgram = engine.compileShader(vertexShader, fragmentShader);

var camera = new Camera(game);
camera.setup(70, 0.01, 5000000);
camera.transform.pos[1] = -0.3;

var mod = new Entity(game);
game.scene.push(mod);
var tex = engine.loader.texture("models/gun.jpg");
var renderer = new Renderer(mod);
renderer.setModel(engine.loader.model(OBJ_SRC));
renderer.setShader(shaderProgram);
renderer.setTexture(tex);
mod.transform.pos = [0.6, 0, -0.9];

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
	mod.transform.rot[1] += 40 * deltaTime;
}
requestAnimationFrame(render);
