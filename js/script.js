import {Plane} from "./canvas.js";
import {Store} from "./store.js";
import {Dot, isHit} from "./dot.js";
import {Table} from "./table.js";
import {validateY} from "./validation.js";

const canvas = document.getElementById("plane");
const resetBtn = document.getElementById("reset-btn");
const form = document.getElementById("form");
const offscreenCanvas = document.createElement("canvas");
const xCord = document.getElementById("x");
const yCord = document.getElementById("y");
let   rCord = document.querySelector("[name='r-group']:checked")
const tBody = document.getElementById("t-body");
const store = new Store("dots", 3);
const table = new Table(tBody);

const options = {
    padding: 20,
    tickCount: 11,
    maxValue: 5,
    labelFont: "14px Arial",
    tickLengthX: 12,
    tickLengthY: 12,
    maxDots: 10,
    dotRadius: 5,
    colors: {
        clearColor: "#ffffff",
        coordsLine: "#222222",
        label: "#333333",
    },
};
const plane = new Plane(canvas, offscreenCanvas, options)
window.addEventListener("resize", () => plane.resize());
plane.fullRender(store.getR());
resetBtn.addEventListener("click", () => store.clear());

form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    rCord = document.querySelector("[name='r-group']:checked")
    validateY(yCord);
    if (!yCord.checkValidity()) {
        yCord.reportValidity();
        return;
    }

    store.addDot(new Dot(Number(xCord.value), Number(yCord.value), Number(rCord.value), Date.now()));
});
yCord.addEventListener("input", () => {
    yCord.setCustomValidity("");
    validateY(yCord);
});

plane.bind(store);
table.bind(store);
