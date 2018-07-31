# WebGL-pbr
A simple, easy to use WebGL library, supporting .obj model loading, and textures.

__Note__: At the moment, only one model is supported, and you have to write you own GLSL shaders. In the future, I plan to support multiple models, with PBR materials. To use textures, you have to run from a server. If you want to test locally, opem cmd or equivalent and run python -m http.server (with python 3). Then open your browser and go to localhost:8000 (or whatever number it tells you). For this to work you html file must be called "index.html".

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

    //Vertex shader
    const const vertexShader = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec3 normal;
    varying highp vec2 tex_coord;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      normal = aVertexNormal;
      tex_coord = aTextureCoord;
    }
    `;

    //fragment shader
    const fragmentShader = `
    varying highp vec3 normal;
    varying highp vec2 tex_coord;
    void main () {
      gl_FragColor = vec4(1.0, 0.3, 0.3);
    }
    `;

    const gl = getWebglContext("#canvas");  //Ensure you have a cavas with id value of 'canvas'
    const shaderProgram = initShaders(gl, vertexShader, fragmentShader);  //compile the shaders

    var camera = new Camera(70, 0.01, 100);  //fov, near, far

    const model = new Model(gl, "model.obj", shaderProgram);
    model.transform.pos[2] = -10;  //move it back on z axis so it is visible on camera
    model.transform.rot = [180, 23, 290];  //x, y, z in degrees

    var then = 0;

    // Draw the scene repeatedly
    function render(now) {
      now *= 0.001;  // convert to seconds
      const deltaTime = now - then;
      then = now;

      drawScene(gl, model, camera);  //Currently only supports one model

      requestAnimationFrame(render);
      model.transform.rot[1] += 22 * deltaTime;  //Rotate the cube
    }
    requestAnimationFrame(render);
