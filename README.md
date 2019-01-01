# WebGL_Renderer
A simple, easy to use WebGL renderer, which attempts to provide a way of rendering 3D graphics in a webpage without any knowledge of WebGL. It is __not__ a game engine; however it does support some other features: obj model loading, for example, and the loading of textures.

__Note__: To use textures, you have to run your HTML page from a server. Therefore, to test locally you must use a server. If you have python3 installed, you can setup a simple server by opening CMD or equivalent and running `python -m http.server` (with python 3) from the directory of the HTML file. Then open your browser and go to localhost:8000 (or whatever number it tells you). For this to work your HTML file must be called "index.html".

# Online Demo
Todo

# Dependencies
This requires [gl-matrix](https://github.com/toji/gl-matrix) and [webgl-obj-loader](https://github.com/frenchtoast747/webgl-obj-loader).

# Setup
Unzip gl-matrix and webgl-obj-loader.

Include this somewhere in your page:

    <script src="path-to-gl-matrix/dist/gl-matrix-min.js"></script>
    <script src="path-to-webgl-obj-loader/dist/webgl-obj-loader.min.js"></script>
    <script src="webglobjects.js"></script>
    <script src="webgllib.js"></script>
    <script src="program.js"></script>
    
Where program.js is the script you write.

For a basic tutorial, see wiki.

For samples, see samples directory.
