export {Dot, isHit};

class Dot {
    constructor(x, y, r, time) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.time = time;
    }
}

function isHit(dot) {
    const x = dot.x;
    const y = dot.y;
    const r = dot.r;
    return (y+(1/2)*x+r>=0 && y<=0 && x<=0 && x >= -2*r)
        || (y <= r && y>=0 && x <= r/2 && x >= 0)
        || (x*x + y*y <= r*r && x > 0 && y < 0);
}