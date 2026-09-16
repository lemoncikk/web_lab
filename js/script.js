/*
const canvas = document.getElementById("canvas");
const form = document.getElementById("coordForm");
const reset = document.getElementById("resetBtn");
const fx = document.getElementById("fx");
const fy = document.getElementById("fy");
const padding = 20;
let currentR = 2;
const btns = document.querySelectorAll("input[name='r']");
const ctx = canvas.getContext("2d");

arr = JSON.parse(localStorage.getItem("dots") || "[]")
btns.forEach(btn => {
    btn.addEventListener('change', () => {
        const r = parseFloat(btn.value);
        if (r <= 0 || isNaN(r)) return;
        currentR = r;
        drawPlane(r);
    })
})

form.addEventListener("reset", (e) => {
    localStorage.clear();
    arr.length = 0
    drawPlane(currentR);
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const x = parseFloat(fx.value);
    const y = parseFloat(fy.value);
    const r = currentR;

    if (!validate(x, y, r)) return;

    addDot(x, y);
    drawPlane(r);
})

function addDot(x, y) {
    if (!arr.some(dot => dot.x === x && dot.y === y)) {
        arr.push({x: x, y: y});
        localStorage.setItem("dots", JSON.stringify(arr));
    }
}

function validate(x, y, r) {
    if (isNaN(x)) { alert("X: выбери значение"); return false; }
    if (isNaN(y)) { alert("Y: введи число"); fy.focus(); return false; }
    if (y < -3 || y > 3) { alert("Y: от -3 до 3"); fy.focus(); return false; }
    if (isNaN(r) || r <= 0) { alert("R: положительное число"); return false; }
    return true;
}

function drawPlane(r) {

    ctx.fillStyle = "#fff"
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#222";
    ctx.beginPath();
    ctx.moveTo(w/2, padding);
    ctx.lineTo(w/2, h - padding);
    ctx.moveTo(padding, h/2);
    ctx.lineTo(w - padding, h/2);
    ctx.stroke();

    const N = 10;
    const step = (w - 2 * padding) / (N - 1);
    ctx.font = "14px serif";
    ctx.fillStyle = "#222";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for(let i = 0; i < 10; i++) {
        const c = padding + step * i;
        const valueW = -r + (2 * r / (N - 1)) * i;
        const valueH = r - (2 * r / (N - 1)) * i;

        if (Math.abs(valueW) < 1e-6) continue;

        ctx.beginPath();
        ctx.moveTo(c, h / 2 - h / 40);
        ctx.lineTo(c, h / 2 + h / 40);
        ctx.moveTo(w / 2 - w / 40, c);
        ctx.lineTo(w / 2 + w / 40, c);
        ctx.stroke();

        ctx.fillText(valueW.toFixed(1), c, h / 2 + h / 40 + 4);
        ctx.fillText(valueH.toFixed(1), w / 2 + w/40 + 10, c - 7);
    }

    arr.forEach(dot => {
        drawDot(dot.x, dot.y, r);
    });
}

function drawDot(x, y, r) {
    if (!hit(x, y, r)) return;
    const scale = (canvas.width - 2 * padding) / (2 * r);
    const px = canvas.width / 2 + x * scale;
    const py = canvas.height / 2 - y * scale;
    ctx.beginPath()
    ctx.arc(px, py, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
}

function hit(x, y, r) {
    return (y+(1/2)*x+r>=0 && y<=0 && x<=0 && x >= -2*r)
        || (y <= r && y>=0 && x <= r/2 && x >= 0)
        || (x*x + y*y <= r*r && x > 0 && y < 0);
}

drawPlane(currentR);*/
