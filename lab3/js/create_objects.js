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
var CUBE_COLOR = [0.274, 0.533, 0.7725, 1];
const CYL_COLOR = [0.329, 0.686, 0.196, 1];
const CYL_RADIUS = 0.5;
const CYL_HEIGHT = 1.0;
const CYL_CENTER_X = -2;
const CYL_CENTER_Y = 0;
const CYL_CENTER_Z = -4;
const CYL_NUM_SLICES = 120;
const CYL_NUM_STACKS = 100;
const DEG_IN_CIRCLE = 360;


function initializeCube() {
    mv_cube_matrix = mat4.create();
    mat4.identity(mv_cube_matrix);

    num_cube_vertices = 8;
    num_cube_indices = 36;
    num_cube_colors = 8;

    cube_vertices.push(CUBE_RADIUS); //x
    cube_vertices.push(CUBE_RADIUS); //y
    cube_vertices.push(-CUBE_RADIUS); //z

    cube_vertices.push(-CUBE_RADIUS); //x
    cube_vertices.push(CUBE_RADIUS); //y
    cube_vertices.push(-CUBE_RADIUS); //z

    cube_vertices.push(-CUBE_RADIUS); //x
    cube_vertices.push(-CUBE_RADIUS); //y
    cube_vertices.push(-CUBE_RADIUS); //z

    cube_vertices.push(CUBE_RADIUS); //x
    cube_vertices.push(-CUBE_RADIUS); //y
    cube_vertices.push(-CUBE_RADIUS); //z

    cube_vertices.push(CUBE_RADIUS); //x
    cube_vertices.push(CUBE_RADIUS); //y
    cube_vertices.push(CUBE_RADIUS); //z

    cube_vertices.push(-CUBE_RADIUS); //x
    cube_vertices.push(CUBE_RADIUS); //y
    cube_vertices.push(CUBE_RADIUS); //z

    cube_vertices.push(-CUBE_RADIUS); //x
    cube_vertices.push(-CUBE_RADIUS); //y
    cube_vertices.push(CUBE_RADIUS); //z

    cube_vertices.push(CUBE_RADIUS); //x
    cube_vertices.push(-CUBE_RADIUS); //y
    cube_vertices.push(CUBE_RADIUS); //z

    cube_indices = [0, 1, 2, 0, 2, 3, 0, 3, 7, 0, 7, 4, 6, 2, 3, 6, 3, 7, 5, 1, 2, 5, 2, 6, 5, 1, 0, 5, 0, 4, 5, 6, 7, 5, 7, 4];

    for (var i = 0; i < 8; i++) {
        cube_colors = cube_colors.concat(CUBE_COLOR);
    }
}


function initializeCylinder(){
        mv_cylinder_matrix = mat4.create();
        mat4.identity(mv_cylinder_matrix);

        num_cylinder_vertices = CYL_NUM_STACKS * ((CYL_NUM_SLICES +1) * 2);
        num_cylinder_colors = num_cylinder_vertices;

        var slice_increment = DEG_IN_CIRCLE / CYL_NUM_SLICES;
        var stack_increment = CYL_HEIGHT / CYL_NUM_STACKS;
        var vertex_x = CYL_CENTER_X;
        var vertex_y = CYL_CENTER_Y;
        var vertex_z = CYL_CENTER_Z;
        var index_num = 0;
        var deg = 0;

        for (var j = 0; j < CYL_NUM_STACKS; j++){
            for (var i = 0; i < CYL_NUM_SLICES + 1; i++){
                // Push an outer edge of circle vertex
                // Using TRIANGLE_STRIP techinique, push outer vertex and center vertex each time.
                cylinder_vertices.push(vertex_x + CYL_RADIUS * Math.cos( degToRad(deg) ) );
                cylinder_vertices.push(vertex_y);
                cylinder_vertices.push(vertex_z + CYL_RADIUS * Math.sin( degToRad(deg) ));

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
