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

For samples, see samples directory.
