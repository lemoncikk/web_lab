export class Dot {
    constructor(x, y, r, time, hit, id = crypto.randomUUID()) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = r;
        this.time = time;
        this.hit = hit;
    }
}