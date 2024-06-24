const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const resetBtn = document.getElementById('resetBtn');
const eraserBtn = document.getElementById('eraserBtn');
let drawing = false;
let erasing = false;

// Set up the canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const socket = io();

// Utility function to draw on the canvas
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

// Event listeners for drawing
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

// Handle receiving drawings from other users
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

// Clear the canvas
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Handle reset button click
resetBtn.addEventListener('click', () => {
    clearCanvas();
    socket.emit('reset');
});

// Handle eraser button click
eraserBtn.addEventListener('click', () => {
    erasing = !erasing;
    eraserBtn.textContent = erasing ? 'Drawing' : 'Eraser';
});

// Handle reset event from server
socket.on('reset', () => {
    clearCanvas();
});

// Ensure the canvas resizes correctly with the window
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clearCanvas();
});
