import {Plane} from "./canvas.js";
import {Store} from "./store.js";
import {Dot} from "./dot.js";
import {Table} from "./table.js";
import {validate, validateY} from "./validation.js";

const canvas = document.getElementById("plane");
const resetBtn = document.getElementById("reset-btn");
const form = document.getElementById("form");
const offscreenCanvas = document.createElement("canvas");
const yCord = document.getElementById("y");
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

resetBtn.addEventListener("click", () => {
    store.clear();
    form.reset();
});

form.addEventListener("submit", (ev) => {
    const data = new FormData(form);
    const valid = validate(form, "x-cord", 'y-cord', 'r-group');
    if (!valid) return;

    store.addDot(new Dot(Number(data.get("x-cord")),
        Number(data.get("y-cord")),
        Number(data.get("r-group")),
        Date.now()));
});
yCord.addEventListener("input", () => {
    const data = new FormData(form);
    yCord.setCustomValidity("");
    validateY(data.get("y-cord"), yCord);
});

plane.bind(store);
table.bind(store);
