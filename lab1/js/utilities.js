/**
 * Date: 1/31/2017
 * Author: Zach Peugh
 * Class: CSE 5542
 * Assignment: Lab 1
 * Description: Extra utility functions used in the backend.
 **/


function minimum(arr){
    var min = arr[0];
    for (var i = 1; i < arr.length; i++) {
        temp = arr[i];
        if (temp < min) min = temp;
    }
    return min;
}

function maximum(arr){
    var max = arr[0];
    for (var i = 1; i < arr.length; i++) {
        temp = arr[i];
        if (temp > max) max = temp;
    }
    return max;
}

function average(arr){
    var mean = arr[0];
    for (var i = 1; i < arr.length; i++) {
        mean += arr[i];
    }
    return mean / arr.length;
}

function getColorFromKey(key){
    if (key == SETOSA){
        return TUFTS_BLUE;
    } else if (key == VERSI){
        return CARMINE_PINK;
    } else if (key == VIRG) {
        return VERDIGRIS;
    } else {
        console.log("INVALID ENUM: " + key);
    }
}

function scaleValues(arr, min, max){
    var new_max = 1-.1;
    var new_min = -1 + .1;
    // var mean = average(arr);
    values = [];

    arr.forEach(function(val){
        values.push( (new_max - new_min) / (max - min) * (val - max) + new_max );
    });

    return values;
}


function addBar(h_offset, bottom, scaled_value, width, bar_num, color_arr){
    vertices.push(-1 + h_offset + width);  //x- top right
    vertices.push(scaled_value);  //y- top right
    vertices.push(0.0); //z- top right
    vertices.push(-1 + h_offset);  //x- top left
    vertices.push(scaled_value);  //y- top left
    vertices.push(0.0); //z- top left
    vertices.push(-1 + h_offset);  //x- bottom right
    vertices.push(bottom);  //y- bottom right
    vertices.push(0.0); //z- bottom right
    vertices.push(-1 + h_offset + width);  //x- bottom left
    vertices.push(bottom);  //y- bottom left
    vertices.push(0.0); //z-bottom left

    indices.push(0 + bar_num * 4);
    indices.push(1 + bar_num * 4);
    indices.push(2 + bar_num * 4);
    indices.push(0 + bar_num * 4);
    indices.push(2 + bar_num * 4);
    indices.push(3 + bar_num * 4);

    for (var i = 0; i < 4; i++){
        colors = colors.concat(color_arr);
    }
}

function chartTitle(title){
    $('#chart-title').text(title);
}
