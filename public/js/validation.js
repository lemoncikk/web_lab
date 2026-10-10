export function validateX(xValue, xElm) {
    xElm.setCustomValidity("");

    const v = Number(xValue);
    if (xValue === null ||v < -5 || v > 3 || Number.isNaN(v)) {
        xElm.setCustomValidity("Введите число от -5 до 3");
    }
}

export function validateRGroup(rValue, rGroup) {
    const radios = [...rGroup];
    radios.forEach(r => {
        r.setCustomValidity("");
    })

    const v = Number(rValue);
    if (rValue === null || v < 1 || v > 3 || Number.isNaN(v)) {
        radios.forEach(r => {
            r.setCustomValidity("Введите число от 1 до 3");
        })
    }
}

export function validateRInput(rValue, rElm) {
    rElm.setCustomValidity("");

    if (rElm.validity.patternMismatch || rElm.validity.valueMissing) {
        return;
    }

    const v = Number(rValue);
    if (rValue === null || v < 1 || v > 3 || Number.isNaN(v)) {
        rElm.setCustomValidity("Введите число от 1 до 3");
    }
}

export function validateY(yValue, yElm) {
    yElm.setCustomValidity("");

    if (yElm.validity.patternMismatch || yElm.validity.valueMissing) {
        return;
    }

    const v = Number(yValue);
    if (yValue === null || v < -3 || v > 3 || Number.isNaN(v)) {
        yElm.setCustomValidity("Введите число от -3 до 3");
    }
}

export function validate(form, xName, yName, rName) {
    const data = new FormData(form);
    validateX(data.get(xName),form.elements[xName]);
    validateY(data.get(yName), form.elements[yName]);
    validateRGroup(data.get(rName), form.elements[rName]);
    return form.reportValidity();
}