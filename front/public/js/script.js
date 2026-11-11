import {Plane} from "./canvas.js";
import {Store} from "./store.js";
import {Dot} from "./dot.js";
import {Table} from "./table.js";
import {validate, validateY} from "./validation.js";
import {checkHit} from "./api.js";

const canvas = document.getElementById("plane");
const resetBtn = document.getElementById("reset-btn");
const form = document.getElementById("form");
const offscreenCanvas = document.createElement("canvas");
const yCord = document.getElementById("y");
const tBody = document.getElementById("t-body");
const store = new Store("dots", 3);
const table = new Table(tBody);
const submitBtn = document.getElementById("submit-form-btn");
const errorBox = document.getElementById("error");

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
plane.fullRender(store.r);

resetBtn.addEventListener("click", () => {
    store.clear();
    form.reset();
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate(form, "x-cord", "y-cord", "r-group")) return;

    const data = new FormData(form);
    const [x, y, r] = ["x-cord", "y-cord", "r-group"].map(n => data.get(n));

    submitBtn.disabled = true;
    errorBox.textContent = "";
    try {
        const hit = await checkHit(x, y, r);
        store.addDot(new Dot(Number(x), Number(y), Number(r), Date.now(), hit));
    } catch (err) {
        errorBox.textContent = err.message;
        console.error(err);
    } finally {
        submitBtn.disabled = false;
    }
});
yCord.addEventListener("input", () => {
    const data = new FormData(form);
    yCord.setCustomValidity("");
    validateY(data.get("y-cord"), yCord);
});

plane.bind(store);
table.bind(store);
