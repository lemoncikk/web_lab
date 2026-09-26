export {Plane, Dot};

class Plane {
    //TODO: add default values into const-block
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.padding = options.padding ?? 20;
        this.colors = options.colors;
        this.tickCount = options.tickCount;
        this.maxValue = options.maxValue;
        this.labelFont = options.labelFont;
        this.tickLengthX = options.tickLengthX
        this.tickLengthY = options.tickLengthY
    }

    #clearPlane() {
        this.ctx.fillStyle = this.colors.clearColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    #drawAxes() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const p = this.padding;

        // Coords lines
        ctx.strokeStyle = this.colors.coordsLine;
        ctx.beginPath();
        ctx.moveTo(w/2, p);
        ctx.lineTo(w/2, h - p);
        ctx.moveTo(p, h/2);
        ctx.lineTo(w - p, h/2);
        ctx.stroke();

    }

    #drawTicks() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const p = this.padding;
        const n = this.tickCount;
        const r = this.maxValue;

        const step = (w - 2 * p) / (n - 1);

        // Ticks size (half of the length)
        // TODO: add to plane settings
        const tickW = (this.tickLengthX ?? w / 20) / 2;
        const tickH = (this.tickLengthY ?? h / 20) / 2;

        // Label settings
        ctx.font = this.labelFont;
        ctx.fillStyle = this.colors.label;


        for (let i = 0; i < n; i++) {
            const c = p + step * i;
            const valueW = -r + (2 * r / (n - 1)) * i;
            const valueH = r - (2 * r / (n - 1)) * i;

            // Skip zeros
            if (Math.abs(valueW) < 1e-6) continue;

            // Ticks
            ctx.beginPath();
            ctx.moveTo(c, h / 2 - tickH);
            ctx.lineTo(c, h / 2 + tickH);
            ctx.moveTo(w / 2 - tickW, c);
            ctx.lineTo(w / 2 + tickW, c);
            ctx.stroke();

            // Labels
            // TODO: add fraction digits to settings
            // TODO: delete magic numbers
            if (Math.abs(i - (n-1)/2) > 1) {
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText(valueW.toFixed(1), c, h / 2 + tickH + 4);

                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                ctx.fillText(valueH.toFixed(1), w / 2 - tickW - 6, c);
            }
        }
    }

    render() {
        this.#clearPlane();
        this.#drawAxes();
        this.#drawTicks();
    }

}

class Dot {
    constructor(x, y, r, time) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.time = time;
    }
}