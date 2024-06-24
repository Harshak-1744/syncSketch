const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let drawing = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const socket = io();

function draw(x, y) {
    if (!drawing) return;
    context.lineTo(x, y);
    context.stroke();
    socket.emit('drawing', { x, y });
}

canvas.addEventListener('mousedown', () => {
    drawing = true;
    context.beginPath();
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

canvas.addEventListener('mousemove', (event) => {
    draw(event.clientX, event.clientY);
});

socket.on('drawing', (data) => {
    context.lineTo(data.x, data.y);
    context.stroke();
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
