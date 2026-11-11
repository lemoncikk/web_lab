import {validateRInput} from "./validation.js";

export {Table}
import {checkHit} from "./api.js";

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
            timeZone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
    }

    #prepareInput(dot) {
        const input = document.createElement("input");
        input.type = "number";
        input.min = "1";
        input.max = "3";
        input.step = "0.5";
        input.value = dot.r;
        input.onchange = async () => {
            input.disabled = true;
            try { await this.#editDot(dot.id, input); }
            finally { input.disabled = false; }
        };
        return input;
    }

    #addDot(dot) {
        const input = this.#prepareInput(dot);
        const tdi = document.createElement("td");
        tdi.append(input);
        const tr = document.createElement("tr");
        const tdx = document.createElement("td");
        tdx.textContent = dot.x;
        const tdy = document.createElement("td");
        tdy.textContent = dot.y;
        const tdt = document.createElement("td");
        tdt.textContent = new Date(dot.time).toLocaleString("ru", this.#dataOptions);
        const tdh = document.createElement("td");
        tdh.textContent = dot.hit ? "Попал" : "Не попал";
        tr.append(tdx);
        tr.append(tdy);
        tr.append(tdi);
        tr.append(tdt);
        tr.append(tdh);
        this.#table.append(tr);
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

    async #editDot(id, inp) {
        validateRInput(inp.value, inp);
        if (!inp.checkValidity()) { inp.reportValidity(); return; }

        const i = this.#store.getAll().findIndex(d => d.id === id);
        if (i < 0) return;
        const dot = this.#store.getDot(i);
        const newR = Number(inp.value);

        try {
            const hit = await checkHit(dot.x, dot.y, newR);
            this.#store.change(i, dot.x, dot.y, newR, Date.now(), hit);
        } catch (err) {
            inp.value = dot.r;                       // откатить поле
            inp.setCustomValidity(err.message);
            inp.reportValidity();
            inp.setCustomValidity("");
        }
    }
}
