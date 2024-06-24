const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const resetBtn = document.getElementById('resetBtn');
const eraserBtn = document.getElementById('eraserBtn');
var drawing = false;
var erasing = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const socket = io();

function draw(x, y) {
    if (!drawing) return;
    if (erasing) {
        context.globalCompositeOperation = 'destination-out';
        context.lineWidth = 10;
    } else {
        context.globalCompositeOperation = 'source-over';
        context.lineWidth = 2;
    }
    context.lineTo(x, y);
    context.stroke();
    socket.emit('drawing', { x, y, erasing });
}

canvas.addEventListener('mousedown', () => {
    drawing = true;
    context.beginPath();
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

canvas.addEventListener('mousemove', (event) => {
    if (drawing) {
        draw(event.clientX, event.clientY);
    }
});

socket.on('drawing', (data) => {
    if (data.erasing) {
        context.globalCompositeOperation = 'destination-out';
        context.lineWidth = 10;
    } else {
        context.globalCompositeOperation = 'source-over';
        context.lineWidth = 2;
    }
    context.lineTo(data.x, data.y);
    context.stroke();
});

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

resetBtn.addEventListener('click', () => {
    clearCanvas();
    socket.emit('reset');
});

eraserBtn.addEventListener('click', () => {
    erasing = !erasing;
    eraserBtn.textContent = erasing ? 'Drawing' : 'Eraser';
});

socket.on('reset', () => {
    clearCanvas();
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
