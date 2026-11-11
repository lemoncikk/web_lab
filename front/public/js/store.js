import {Dot} from "./dot.js";

export {Store};

class Store {
    #subs = new Set();
    #dots = [];
    #r
    constructor(key, r) {
        this.key = key;
        this.#dots = JSON.parse(window.localStorage.getItem(key) ?? "[]")
            .filter(d => d.id && typeof d.hit === "boolean");   // отбросить точки старого формата
        this.#r = Number(r ?? JSON.parse(window.localStorage.getItem(key + "r") ?? "3"));
    }

    set r(r) {
        this.#r = r
        this.#save();
        this.#emit();
    }
    change(index, x, y, r, time, hit) {
        this.#dots[index] = new Dot(x, y, r, time, hit, this.#dots[index].id);   // id сохраняется
        this.#r = r;
        this.#save();
        this.#emit();
    }

    #save() {
        window.localStorage.setItem(this.key, JSON.stringify(this.#dots));
        window.localStorage.setItem(this.key + 'r', JSON.stringify(this.#r));
    }

    addDot(dot) {
        this.#dots.push(dot);
        this.#r = dot.r;
        this.#save();
        this.#emit();
    }

    clear() {
        this.#dots = [];
        window.localStorage.setItem(this.key, JSON.stringify([]));
        this.#emit()
    }

    reload(key, r) {
        this.key = key;
        this.r = r;
        this.#dots = JSON.parse(window.localStorage.getItem(key) ?? "[]");
        this.#emit()
    }

    getDot(index) {
        return this.#dots[index];
    }

    getAll() {
        return this.#dots;
    }

    get r() {
        return this.#r;
    }

    isEmpty() {
        return this.#dots.length === 0;
    }

    #snapshot() {
        return {dots: [...this.#dots], r: this.#r}
    }

    subscribe(fn) {
        this.#subs.add(fn);
        fn(this.#snapshot());

        // returns unsub func
        return () => {
            this.#subs.delete(fn);
        }
    }

    #emit() {
        for (const fn of this.#subs) {
            fn(this.#snapshot());
        }
    }

}