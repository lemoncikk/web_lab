import {Dot} from "./dot.js";

export {Store};

class Store {
    #subs = new Set();
    #dots = [];
    #r
    constructor(key, r) {
        this.key = key;
        this.#dots = JSON.parse(window.localStorage.getItem(key) ?? "[]");
        this.#r = Number(JSON.parse((window.localStorage.getItem(key + 'r')) ?? 3));
    }

    setR(r) {
        this.#r = r
        this.#save();
        this.#emit();
    }
    change(index, x, y, r, time) {
        this.#dots[index] = new Dot(x, y, r, time);
        this.#save();
        this.#emit();
    }

    #save() {
        window.localStorage.setItem(this.key, JSON.stringify(this.#dots));
        window.localStorage.setItem(this.key + 'r', JSON.stringify(this.#r));
    }

    addDot(dot) {
        this.#dots.push(dot);
        this.setR(dot.r);
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

    getR() {
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