export {Store};

class Store {
    #subs = new Set();
    #dots = [];
    constructor(key, r) {
        this.key = key;
        this.#dots = JSON.parse(window.localStorage.getItem(key) ?? "[]");
        this.r = r;
    }

    setR(r) {
        this.r = r;
        this.#emit();
    }

    addDot(dot) {
        this.#dots.push(dot);
        this.#emit()
    }

    clear() {
        this.#dots = [];
        window.localStorage.setItem(this.key, JSON.stringify("[]"));
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
        return this.r;
    }

    isEmpty() {
        return this.#dots.length === 0;
    }

    #snapshot() {
        return {dots: this.#dots, r: this.r}
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
        for (const fn in this.#subs) {
            fn(this.#snapshot());
        }
    }

}