var has_data = false;
var data = {
    species: [],
    setosa : [],
    versicolor : [],
    virginica : [],
    setosa_avgs : [],
    versicolor_avgs : [],
    virginica_avgs : []
};

function setData(lines){
    var line, key, temp;
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];
        key = line[0];
        if (data.hasOwnProperty(key)){
            temp = [];
            for (var j = 1; j < line.length; j++){
                if (key === "species"){
                    temp.push(line[j]);
                } else {
                    temp.push(Number(line[j]));
                }
            }
            data[key].push(temp);
        } else {
            console.log("Invalid input key: " + line[0]);
        }
    }
    has_data = true;
}

function calculateAverages(key){
    var arr = data[key];
    var avg_key = key + "_avgs";
    data[avg_key] = arr[0];

    for(var i = 1; i < arr.length; i++){
        for(var j = 0; j < arr[i].length; j++){
            data[avg_key][j] += arr[i][j];
        }
    }
    for(var i = 0; i < data[avg_key].length; i++){
        data[avg_key][i] = data[avg_key][i] / arr.length;
    }
    return data;
}

function handleFiles(files) {
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(files[0]);
    } else {
        alert('FileReader are not supported in this browser.');
    }
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
    // Read file into memory as UTF-8
    reader.readAsText(fileToRead);
}

function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
    }
    console.log(lines);
    drawOutput(lines);
    setData(lines);
    console.log(data);
}

function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
}

function drawOutput(lines) {
    //Clear previous data
    document.getElementById("output").innerHTML = "";
    var table = document.createElement("table");
    for (var i = 0; i < lines.length; i++) {
        var row = table.insertRow(-1);
        for (var j = 0; j < lines[i].length; j++) {
            var firstNameCell = row.insertCell(-1);
            firstNameCell.appendChild(document.createTextNode(lines[i][j]));
        }
    }
    document.getElementById("output").appendChild(table);
}
