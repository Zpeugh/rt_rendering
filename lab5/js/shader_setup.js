
    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    function initShaders() {

        cube_map_shader_program = gl.createProgram();
        texture_map_shader_program = gl.createProgram();

        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        gl.attachShader(cube_map_shader_program, vertexShader);
        gl.attachShader(cube_map_shader_program, fragmentShader);
        gl.linkProgram(cube_map_shader_program);

        var fragmentShader2 = getShader(gl, "shader-fs-2");
        var vertexShader2 = getShader(gl, "shader-vs-2");

        gl.attachShader(texture_map_shader_program, vertexShader2);
        gl.attachShader(texture_map_shader_program, fragmentShader2);
        gl.linkProgram(texture_map_shader_program);


        if (!gl.getProgramParameter(cube_map_shader_program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(cube_map_shader_program));
        }

        if (!gl.getProgramParameter(texture_map_shader_program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(texture_map_shader_program));
        }

    }

function initializeShaderVariables(){

        shader_program.vertexPositionAttribute = gl.getAttribLocation(shader_program, "aVertexPosition");
        gl.enableVertexAttribArray(shader_program.vertexPositionAttribute);

        shader_program.vertexNormalAttribute = gl.getAttribLocation(shader_program, "aVertexNormal");
        gl.enableVertexAttribArray(shader_program.vertexNormalAttribute);

        shader_program.vertexColorAttribute = gl.getAttribLocation(shader_program, "aVertexColor");
        gl.enableVertexAttribArray(shader_program.vertexColorAttribute);

        shader_program.vertexTextureCoordAttribute = gl.getAttribLocation(shader_program, "aVertexTextureCoord");
        gl.enableVertexAttribArray(shader_program.vertexTextureCoordAttribute);

        shader_program.use_textureUniform = gl.getUniformLocation(shader_program, "use_texture");
        shader_program.textureUniform = gl.getUniformLocation(shader_program, "texture");
        shader_program.cube_mapUniform = gl.getUniformLocation(shader_program, "cube_map");
        shader_program.vMatrixUniform = gl.getUniformLocation(shader_program, "uVMatrix");
        shader_program.mMatrixUniform = gl.getUniformLocation(shader_program, "uMMatrix");
        shader_program.mvMatrixUniform = gl.getUniformLocation(shader_program, "uMVMatrix");
        shader_program.pMatrixUniform = gl.getUniformLocation(shader_program, "uPMatrix");
        shader_program.nMatrixUniform = gl.getUniformLocation(shader_program, "uNMatrix");
        shader_program.v2wMatrixUniform = gl.getUniformLocation(shader_program, "uV2WMatrix");
        shader_program.light_posUniform = gl.getUniformLocation(shader_program, "light_pos");
        shader_program.light_intensityUniform = gl.getUniformLocation(shader_program, "light_intensity");
        shader_program.ambient_coefUniform = gl.getUniformLocation(shader_program, "ambient_coef");
        shader_program.diffuse_coefUniform = gl.getUniformLocation(shader_program, "diffuse_coef");
        shader_program.specular_coefUniform = gl.getUniformLocation(shader_program, "specular_coef");
        shader_program.shininessUniform = gl.getUniformLocation(shader_program, "shininess");
        shader_program.ambient_colorUniform = gl.getUniformLocation(shader_program, "ambient_color");
        shader_program.diffuse_colorUniform = gl.getUniformLocation(shader_program, "diffuse_color");
        shader_program.specular_colorUniform = gl.getUniformLocation(shader_program, "specular_color");

}
