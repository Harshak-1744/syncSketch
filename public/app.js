const socket = io();

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 60;
canvas.height = 400;

const ctx = canvas.getContext('2d');
var start_background_color = "white";
ctx.fillStyle = start_background_color;
ctx.fillRect(0, 0, canvas.width, canvas.height);

var draw_color = "black";
var draw_width = 2;
var is_drawing = false;

var restore_array = [];
var index = -1;

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("touchend", stop, false);

canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

function change_color(element) {
    draw_color = element.style.background;
}

function start(event) {
    is_drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    event.preventDefault();
}

function draw(event) {
    if (is_drawing) {
        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.strokeStyle = draw_color;
        ctx.lineWidth = draw_width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Emit the drawing data to the server
        socket.emit('drawing', {
            x: event.clientX - canvas.offsetLeft,
            y: event.clientY - canvas.offsetTop,
            color: draw_color,
            width: draw_width
        });
    }
    event.preventDefault();
}

function stop(event) {
    if (is_drawing) {
        ctx.stroke();
        ctx.closePath();
        is_drawing = false;
    }
    event.preventDefault();

    if (event.type != 'mouseout') {
        restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
}

function clear_canvas() {
    ctx.fillStyle = start_background_color;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    restore_array = [];
    index = -1;

    socket.emit('clearCanvas');
}

function undo_last() {
    if (index < 0) {
        clear_canvas();
    } else {
        index -= 1;
        ctx.putImageData(restore_array[index], 0, 0);
        restore_array.pop();
    }

    socket.emit('undoLast', {
        restore_array,
        index
    });
}

// Listen for drawing events from the server
socket.on('drawing', (data) => {
    ctx.lineTo(data.x, data.y);
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
});

// Listen for clear canvas event from the server
socket.on('clearCanvas', () => {
    ctx.fillStyle = start_background_color;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    restore_array = [];
    index = -1;
});

// Listen for undo last event from the server
socket.on('undoLast', (data) => {
    restore_array = data.restore_array;
    index = data.index;
    if (index < 0) {
        clear_canvas();
    } else {
        ctx.putImageData(restore_array[index], 0, 0);
    }
});
