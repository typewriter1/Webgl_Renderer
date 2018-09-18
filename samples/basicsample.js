
engine.setWebglContext("#canvas");
var game = new engine.Game(gl);

const shaderProgram = engine.compileShader(engine.pbrVertexShader, engine.pbrFragmentShader);

var camera = new Camera(game);

var mod = new Entity(game);
game.scene.push(mod);
var tex = engine.loader.texture("models/gun.jpg");
var renderer = new Renderer(mod);
renderer.setModel(engine.loader.model(OBJ_SRC));
renderer.setShader(shaderProgram);
renderer.setTexture(tex);


//camera.parentObject = mod;

var floor = new Entity(game);
game.scene.push(floor);
var tex2 = engine.loader.texture("models/odd-tree2.png");
var renderer2 = new Renderer(floor);
renderer2.setModel(engine.loader.model(OBJ_FLOOR));
renderer2.setShader(shaderProgram);
renderer2.setTexture(tex2);

//alert(game.scene);

camera.transform.pos = [0.4, -3, -4];
mod.transform.scale = 8;
mod.transform.pos = [0, 3, 0];
//floor.transform.pos = [0, 0, 0];

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
	//camera.transform.rot[1] += -80 * deltaTime;
}
requestAnimationFrame(render);

