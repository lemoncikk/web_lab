export function validateY(yElm) {
    yElm.setCustomValidity("");

    if (yElm.validity.patternMismatch || yElm.validity.valueMissing) {
        return;
    }
        const v = Number(yElm.value);
        if (v < -3 || v > 3) {
            yElm.setCustomValidity("Введите число от -3 до 3");
        }
}