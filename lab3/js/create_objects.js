/**
 * Date: 3/15/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 3
 * Description: Javascript file used to initialize objects for lab 3.
 **/
const GREEN = [0.329, 0.686, 0.196, 1];
const BLUE = [0.274, 0.533, 0.7725, 1];
var CUBE_RADIUS = 0.5;
var CUBE_COLOR_1 = [0.274, 0.533, 0.9, 1];
var CUBE_COLOR_2 = [0.274, 0.533, 0.65, 1];
const CYL_COLOR = [0.329, 0.686, 0.196, 1];
const CYL_RADIUS = 0.5;
const CYL_HEIGHT = 1.0;
const CYL_CENTER_X = -3;
const CYL_CENTER_Y = 0;
const CYL_CENTER_Z = -4;
const CYL_NUM_SLICES = 120;
const CYL_NUM_STACKS = 100;
const SPHERE_COLOR = [0.86, 0.12, 0.196, 1];
const SPHERE_RADIUS = 0.5;
const SPHERE_CENTER_X = 3;
const SPHERE_CENTER_Y = 0;
const SPHERE_CENTER_Z = -6;
const SPHERE_NUM_SLICES = 100;
const SPHERE_NUM_STACKS = 25;
const DEG_IN_CIRCLE = 360;


function initializeCube() {
    mv_cube_matrix = mat4.create();
    mat4.identity(mv_cube_matrix);

    num_cube_vertices = 8;
    num_cube_indices = 36;
    num_cube_colors = 8;

    cube_vertices.push(CUBE_RADIUS);    //x
    cube_vertices.push(CUBE_RADIUS);    //y
    cube_vertices.push(-CUBE_RADIUS);   //z
    cube_colors = cube_colors.concat(CUBE_COLOR_1);

    cube_vertices.push(-CUBE_RADIUS);   //x
    cube_vertices.push(CUBE_RADIUS);    //y
    cube_vertices.push(-CUBE_RADIUS);   //z
    cube_colors = cube_colors.concat(CUBE_COLOR_1);

    cube_vertices.push(-CUBE_RADIUS);   //x
    cube_vertices.push(-CUBE_RADIUS);   //y
    cube_vertices.push(-CUBE_RADIUS);   //z
    cube_colors = cube_colors.concat(CUBE_COLOR_1);

    cube_vertices.push(CUBE_RADIUS);    //x
    cube_vertices.push(-CUBE_RADIUS);   //y
    cube_vertices.push(-CUBE_RADIUS);   //z
    cube_colors = cube_colors.concat(CUBE_COLOR_1);

    cube_vertices.push(CUBE_RADIUS);    //x
    cube_vertices.push(CUBE_RADIUS);    //y
    cube_vertices.push(CUBE_RADIUS);    //z
    cube_colors = cube_colors.concat(CUBE_COLOR_2);

    cube_vertices.push(-CUBE_RADIUS);   //x
    cube_vertices.push(CUBE_RADIUS);    //y
    cube_vertices.push(CUBE_RADIUS);    //z
    cube_colors = cube_colors.concat(CUBE_COLOR_2);

    cube_vertices.push(-CUBE_RADIUS);   //x
    cube_vertices.push(-CUBE_RADIUS);   //y
    cube_vertices.push(CUBE_RADIUS);    //z
    cube_colors = cube_colors.concat(CUBE_COLOR_2);

    cube_vertices.push(CUBE_RADIUS);    //x
    cube_vertices.push(-CUBE_RADIUS);   //y
    cube_vertices.push(CUBE_RADIUS);    //z
    cube_colors = cube_colors.concat(CUBE_COLOR_2);

    cube_indices = [0, 1, 2, 0, 2, 3, 0, 3, 7, 0, 7, 4, 6, 2, 3, 6, 3, 7, 5, 1, 2, 5, 2, 6, 5, 1, 0, 5, 0, 4, 5, 6, 7, 5, 7, 4];

    // for (var i = 0; i < 8; i++) {
        // cube_colors = cube_colors.concat(CUBE_COLOR);
    // }
}


function initializeCylinder() {
    mv_cylinder_matrix = mat4.create();
    mat4.identity(mv_cylinder_matrix);

    num_cylinder_vertices = CYL_NUM_STACKS * ((CYL_NUM_SLICES + 1) * 2);
    num_cylinder_colors = num_cylinder_vertices;

    var slice_increment = DEG_IN_CIRCLE / CYL_NUM_SLICES;
    var stack_increment = CYL_HEIGHT / CYL_NUM_STACKS;
    var vertex_x = CYL_CENTER_X;
    var vertex_y = CYL_CENTER_Y;
    var vertex_z = CYL_CENTER_Z;
    var index_num = 0;
    var deg = 0;

    for (var j = 0; j < CYL_NUM_STACKS; j++) {
        for (var i = 0; i < CYL_NUM_SLICES + 1; i++) {
            // Push an outer edge of circle vertex
            // Using TRIANGLE_STRIP techinique, push outer vertex and center vertex each time.
            cylinder_vertices.push(vertex_x + CYL_RADIUS * Math.cos(degToRad(deg)));
            cylinder_vertices.push(vertex_y);
            cylinder_vertices.push(vertex_z + CYL_RADIUS * Math.sin(degToRad(deg)));

            cylinder_vertices.push(CYL_CENTER_X);
            cylinder_vertices.push(CYL_CENTER_Y + stack_increment);
            cylinder_vertices.push(CYL_CENTER_Z);

            cylinder_colors = cylinder_colors.concat(CYL_COLOR);
            cylinder_colors = cylinder_colors.concat(CYL_COLOR);
            deg += slice_increment;
        }
        vertex_y += stack_increment;
        deg = 0;
    }
}

function initializeSphere() {
    mv_sphere_matrix = mat4.create();
    mat4.identity(mv_sphere_matrix);

    num_sphere_vertices = SPHERE_NUM_SLICES + 1;
    num_sphere_colors = SPHERE_NUM_SLICES + 1;
    num_sphere_indices = SPHERE_NUM_SLICES * SPHERE_NUM_STACKS * 6;

    for (var horizontal_num = 0; horizontal_num <= SPHERE_NUM_STACKS; horizontal_num++) {
        var horizontal_rad = horizontal_num * Math.PI / SPHERE_NUM_STACKS;

        for (var vertical_num = 0; vertical_num <= SPHERE_NUM_SLICES; vertical_num++) {
            var vertical_rad = vertical_num * 2 * Math.PI / SPHERE_NUM_SLICES;
            var x = Math.cos(vertical_rad) * Math.sin(horizontal_rad);
            var y = Math.cos(horizontal_rad);
            var z = Math.sin(vertical_rad) * Math.sin(horizontal_rad);

            sphere_vertices.push(SPHERE_CENTER_X + SPHERE_RADIUS * x);
            sphere_vertices.push(SPHERE_CENTER_Y + SPHERE_RADIUS * y);
            sphere_vertices.push(SPHERE_CENTER_Z + SPHERE_RADIUS * z);
            sphere_colors = sphere_colors.concat(SPHERE_COLOR);
        }
    }

    for (var horizontal_num = 0; horizontal_num < SPHERE_NUM_STACKS; horizontal_num++) {
        for (var vertical_num = 0; vertical_num < SPHERE_NUM_SLICES; vertical_num++) {
            var v1 = (horizontal_num * (SPHERE_NUM_SLICES + 1)) + vertical_num;
            var v2 = v1 + SPHERE_NUM_SLICES + 1;
            sphere_indices.push(v1);
            sphere_indices.push(v2);
            sphere_indices.push(v1 + 1);

            sphere_indices.push(v2);
            sphere_indices.push(v2 + 1);
            sphere_indices.push(v1 + 1);
        }
    }
}
