export {Table}
import {isHit} from "./dot.js";

class Table {
    #dataOptions
    #table
    constructor(table) {
        if (!(table instanceof HTMLElement)) {
            throw new Error("Bad table link");
        }
        this.#table = table;
        this.#dataOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
    }

    #addDot(dot) {
        this.#table.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${dot.x}</td>
            <td>${dot.y}</td>
            <td>${dot.r}</td>
            <td>${new Date(dot.time).toLocaleString("ru", this.#dataOptions)}</td>
            <td>${isHit(dot) ? "Попал" : "Не попал"}</td>
        </tr>`);
    }

    #subs(snap) {
        this.#render(snap.dots);
    }

    #render(dots) {
        this.#table.replaceChildren();
        dots.forEach((dot) => this.#addDot(dot))
    }

    bind(store) {
        store.subscribe((snap) => this.#subs(snap))
    }
}