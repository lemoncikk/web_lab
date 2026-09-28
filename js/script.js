import {Plane} from "./canvas.js";
import {Store} from "./store.js";
import {Dot, isHit} from "./dot.js";
import {Table} from "./table.js";
import {validateX, validateY} from "./validation.js";

const canvas = document.getElementById("plane");
const resetPlaneBtn = document.getElementById("reset-plane-btn");
const form = document.getElementById("form");
const offscreenCanvas = document.createElement("canvas");
const xCord = document.getElementById("x");
const yCord = document.getElementById("y");
const rCord = document.querySelector("[name='r-group']:checked")
const tBody = document.getElementById("t-body");

const options = {
    padding: 20,
    tickCount: 11,
    maxValue: 5,
    labelFont: "14px Arial",
    tickLengthX: 12,
    tickLengthY: 12,
    colors: {
        clearColor: "#ffffff",
        coordsLine: "#222222",
        label: "#333333",
    },
};
const plane = new Plane(canvas, offscreenCanvas, options)
window.addEventListener("resize", () => plane.resize());
plane.fullRender(3);

form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${xCord.value}</td>
        <td>${yCord.value}</td>
        <td>${rCord.value}</td>
        <td>${Date.now()}</td>
        <td>Sosi</td>
    `
    tBody.appendChild(tr);
})


const store = new Store("dots", 3)
store.subscribe((s) => {
    plane.setDots(s.dots);
    plane.render(s.r);
});
