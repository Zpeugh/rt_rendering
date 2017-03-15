/**
 * Date: 3/15/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 3
 * Description: Javascript file used to initialize objects for lab 3.
 **/
const GREEN = [0.329, 0.686, 0.196, 1];
const BLUE = [0.274, 0.533, 0.7725, 1];
const WALL_WIDTH = 0.02;
const PAD_COLOR = [0.878, 0.282, 0.218, 1];
const BALL_COLOR = [1, 1, 1, 1];
const BALL_X = 0.0;
const BALL_Y = 0.0;
const BALL_RADIUS = 0.025;
const DEG_IN_CIRCLE = 360;
var CUBE_SIZE = 0.25;
var CUBE_COLOR = [0.274, 0.533, 0.7725, 1];

function initializeCube() {
    mv_cube_matrix = mat4.create();
    mat4.identity(mv_cube_matrix);

    num_cube_vertices = 8;
    num_cube_indices = 36;
    num_cube_colors = 8;

    cube_vertices.push(CUBE_SIZE); //x
    cube_vertices.push(CUBE_SIZE); //y
    cube_vertices.push(-CUBE_SIZE); //z

    cube_vertices.push(-CUBE_SIZE); //x
    cube_vertices.push(CUBE_SIZE); //y
    cube_vertices.push(-CUBE_SIZE); //z

    cube_vertices.push(-CUBE_SIZE); //x
    cube_vertices.push(-CUBE_SIZE); //y
    cube_vertices.push(-CUBE_SIZE); //z

    cube_vertices.push(CUBE_SIZE); //x
    cube_vertices.push(-CUBE_SIZE); //y
    cube_vertices.push(-CUBE_SIZE); //z

    cube_vertices.push(CUBE_SIZE); //x
    cube_vertices.push(CUBE_SIZE); //y
    cube_vertices.push(CUBE_SIZE); //z

    cube_vertices.push(-CUBE_SIZE); //x
    cube_vertices.push(CUBE_SIZE); //y
    cube_vertices.push(CUBE_SIZE); //z

    cube_vertices.push(-CUBE_SIZE); //x
    cube_vertices.push(-CUBE_SIZE); //y
    cube_vertices.push(CUBE_SIZE); //z

    cube_vertices.push(CUBE_SIZE); //x
    cube_vertices.push(-CUBE_SIZE); //y
    cube_vertices.push(CUBE_SIZE); //z

    cube_indices = [0, 1, 2, 0, 2, 3, 0, 3, 7, 0, 7, 4, 6, 2, 3, 6, 3, 7, 5, 1, 2, 5, 2, 6, 5, 1, 0, 5, 0, 4, 5, 6, 7, 5, 7, 4];

    for (var i = 0; i < 8; i++) {
        cube_colors = cube_colors.concat(CUBE_COLOR);
    }
}
