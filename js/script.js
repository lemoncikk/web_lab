import {Plane, Dot} from "./canvas.js";

const canvas = document.getElementById("plane");

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
const plane = new Plane(canvas, options)

plane.render();

