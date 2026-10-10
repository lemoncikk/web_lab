import {validateRInput} from "./validation.js";

export {Table}
import {isHit} from "./dot.js";

class Table {
    #dataOptions
    #table
    #store
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

    #prepareInput(dot) {
        let input = document.createElement("input");
        input.type = "number";
        input.min = "1";
        input.max = "3"
        input.step = "0.5"
        input.value = dot.r;
        input.id = dot.time.toString();
        input.onchange = () => this.#editDot(input.id);
        return input;
    }

    #addDot(dot) {
        const input = this.#prepareInput(dot);
        const tdi = document.createElement("td");
        tdi.appendChild(input);
        const tr = document.createElement("tr");
        const tdx = document.createElement("td");
        tdx.textContent = dot.x;
        const tdy = document.createElement("td");
        tdy.textContent = dot.y;
        const tdt = document.createElement("td");
        tdt.textContent = new Date(dot.time).toLocaleString("ru", this.#dataOptions);
        const tdh = document.createElement("td");
        tdh.textContent = isHit(dot) ? "Попал" : "Не попал";
        tr.appendChild(tdx);
        tr.appendChild(tdy);
        tr.appendChild(tdi);
        tr.appendChild(tdt);
        tr.appendChild(tdh);
        this.#table.appendChild(tr);
    }

    #subs(snap) {
        this.#render(snap.dots);
    }


    #render(dots) {
        this.#table.replaceChildren();
        dots.sort((dot1, dot2) => {
            return dot1.r - dot2.r;
        })
        dots.forEach((dot) => this.#addDot(dot))
    }

    bind(store) {
        this.#store = store;
        store.subscribe((snap) => this.#subs(snap))
    }

    #editDot(id) {
        let inp = document.getElementById(id);
        validateRInput(inp.value, inp);
        if (!inp.checkValidity()) {
            inp.reportValidity();
            return;
        }
        let dots = this.#store.getAll();
        this.#store.setR(Number(inp.value));
        for (let i = 0; i < dots.length; i++) {
            if (dots[i].time.toString() === id) {
                this.#store.change(i, dots[i].x, dots[i].y, Number(inp.value), Date.now());
                break;
            }
        }

    }
}
