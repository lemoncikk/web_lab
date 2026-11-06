import {isHit} from "./dot.js";

export {Plane};

class Plane {
    #canvas
    #ctx
    #offscreenCanvas
    #offscreenCtx
    #dots

    #canvasWidth
    #canvasHeight
    #centerX
    #centerY
    #scaleX
    #scaleY
    #padding
    #colors
    #tickCount
    #maxValue
    #labelFont
    #tickLengthX
    #tickLengthY
    #dotRadius
    #maxDots

    #store
    constructor(canvas, offscreenCanvas, options = {}) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");

        const rect = canvas.getBoundingClientRect()
        this.#canvasWidth = rect.width;
        this.#canvasHeight = rect.height;
        this.#offscreenCanvas = offscreenCanvas;

        this.#offscreenCtx = offscreenCanvas.getContext("2d");
        this.#offscreenCanvas.width = this.#canvasWidth;
        this.#offscreenCanvas.height = this.#canvasHeight;

        this.#centerX = this.#canvasWidth / 2;
        this.#centerY = this.#canvasHeight / 2;
        this.#dots = [];

        this.#padding = options.padding ?? 20;
        this.#colors = {
            clearColor: "#fff",
            coordsLine: "#222",
            label: "#333",
            funcPlace: "rgba(51,152,253,0.7)",
            wrongDot: "#ff0000",
            successDot: "#13d616",
            ...options.colors,
        };
        this.#tickCount = options.tickCount ?? 11;
        this.#maxValue = options.maxValue ?? 5;
        this.#labelFont = options.labelFont ?? "14px Arial";
        this.#tickLengthX = options.tickLengthX ?? 12;
        this.#tickLengthY = options.tickLengthY ?? 12;
        this.#dotRadius = options.dotRadius ?? 10;
        this.#scaleX = (this.#canvasWidth-(2 * this.#padding))/(this.#maxValue*2);
        this.#scaleY = (this.#canvasHeight-(2 * this.#padding))/(this.#maxValue*2);
        this.#maxDots = options.maxDots;
    }

    #clearPlane(ctx) {
        ctx.fillStyle = this.#colors.clearColor;
        ctx.fillRect(0, 0, this.#canvasWidth, this.#canvasHeight);
    }

    #drawAxes(ctx) {
        const w = this.#canvasWidth;
        const h = this.#canvasHeight;
        const p = this.#padding;

        // Coords lines
        ctx.strokeStyle = this.#colors.coordsLine;
        ctx.beginPath();
        ctx.moveTo(this.#centerX, p);
        ctx.lineTo(this.#centerX, h - p);
        ctx.moveTo(p, this.#centerY);
        ctx.lineTo(w - p, this.#centerY);
        ctx.stroke();

    }

    #drawTicks(ctx) {
        const w = this.#canvasWidth;
        const h = this.#canvasHeight;
        const p = this.#padding;
        const n = this.#tickCount;
        const maxValue = this.#maxValue;

        const stepX = (w - 2 * p) / (n - 1);
        const stepY = (h - 2 * p) / (n - 1);

        // Ticks size (half of the length)
        // TODO: add to plane settings
        const tickW = (this.#tickLengthX ?? w / 20) / 2;
        const tickH = (this.#tickLengthY ?? h / 20) / 2;

        // Label settings
        ctx.font = this.#labelFont;
        ctx.fillStyle = this.#colors.label;

        if (n <= 1) {
            return;
        }

        for (let i = 0; i < n; i++) {
            const cx = p + stepX * i;
            const cy = p + stepY * i;
            const valueW = -maxValue + (2 * maxValue / (n - 1)) * i;
            const valueH = maxValue - (2 * maxValue / (n - 1)) * i;

            // Skip zeros
            if (Math.abs(valueW) < 1e-6) continue;

            // Ticks
            ctx.beginPath();
            ctx.moveTo(cx, h / 2 - tickH);
            ctx.lineTo(cx, h / 2 + tickH);
            ctx.moveTo(w / 2 - tickW, cy);
            ctx.lineTo(w / 2 + tickW, cy);
            ctx.stroke();

            // Labels
            // TODO: add fraction digits to settings
            // TODO: delete magic numbers
            if (Math.abs(i - (n-1)/2) > 1) {
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText(valueW.toFixed(1), cx, h / 2 + tickH + 4);

                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                ctx.fillText(valueH.toFixed(1), w / 2 - tickW - 6, cy);
            }
        }
    }

    #drawFunc(ctx, r) {
        const scaleX = this.#scaleX;
        const scaleY = this.#scaleY;
        const x = this.#centerX;
        const y = this.#centerY;
        ctx.fillStyle = this.#colors.funcPlace;
        ctx.fillRect(x, y - r*scaleY, (r/2)*scaleX, r*scaleY);
        ctx.beginPath()
        ctx.ellipse(x, y, r*scaleX, r*scaleY, 0, 0, Math.PI/2);
        ctx.lineTo(x, y)
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - r*scaleX, y);
        ctx.lineTo(x, y + (r/2)*scaleY);
        ctx.closePath();
        ctx.fill();
    }

    #drawDot(dot, ctx) {
        ctx.beginPath();
        const radios = this.#dotRadius;
        const scaleX = this.#scaleX;
        const scaleY = this.#scaleY;
        ctx.arc(this.#centerX + dot.x * scaleX,
            this.#centerY - dot.y * scaleY,
            radios, 0, Math.PI*2, false);
        ctx.fillStyle = isHit(dot) ? this.#colors.successDot : this.#colors.wrongDot;
        ctx.fill();
        ctx.closePath();
    }

    #drawDots(ctx) {
        if (this.#maxDots === null || this.#maxDots === undefined || isNaN(this.#maxDots)) {
            this.#dots.forEach((dot) => this.#drawDot(dot, ctx));
            return;
        }
        for (let i = 0; i < Math.min(this.#maxDots, this.#dots.length); i++) {
            const d = this.#dots.at(this.#dots.length - i - 1);
            this.#drawDot(d, ctx);
        }
    }

    resize() {
        const rect = this.#canvas.getBoundingClientRect();
        if (rect.width !== this.#canvasWidth || rect.height !== this.#canvasHeight) {
            this.#canvasWidth = rect.width;
            this.#canvasHeight = rect.height;
            this.#offscreenCanvas.width = this.#canvasWidth;
            this.#offscreenCanvas.height = this.#canvasHeight;
            this.#scaleX = (this.#canvasWidth-(2 * this.#padding))/(this.#maxValue*2);
            this.#scaleY = (this.#canvasHeight-(2 * this.#padding))/(this.#maxValue*2);
            this.#centerX = this.#canvasWidth / 2;
            this.#centerY = this.#canvasHeight / 2;
            this.fullRender(this.#store.getR());
        }
        this.render()
    }

    fullRender(r) {
        this.#clearPlane(this.#offscreenCtx);
        this.#drawAxes(this.#offscreenCtx);
        this.#drawTicks(this.#offscreenCtx);
        this.render(r);
    }

    render(r) {
        this.#ctx.drawImage(this.#offscreenCanvas, 0, 0);
        this.#drawFunc(this.#ctx, r);
        this.#drawDots(this.#ctx);
    }

    setDots(dots) {
        this.#dots = dots;
    }

    #subs(snap) {
        this.#dots = snap.dots;
        this.render(snap.r);
    }

    bind(store) {
        this.#store = store;
        store.subscribe((snap) => this.#subs(snap))
    }

}

