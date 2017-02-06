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
