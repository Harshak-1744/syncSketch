const canvas = document.getElementById("canvas")
canvas.width = window.innerWidth - 60;
canvas.height = 400;

const ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0,0, canvas.width, canvas.height);
