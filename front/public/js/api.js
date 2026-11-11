const ENDPOINT = "/fcgi-bin/";

export class ApiError extends Error {}

const NUMBER = /^-?\d{1,10}(\.\d{1,10})?$/;
const R_VALUES = [1, 1.5, 2, 2.5, 3];

const fmt = (v) => typeof v === "number"
    ? (Number.isInteger(v) ? String(v) : v.toFixed(10).replace(/0+$/, ""))
    : String(v);

function assertValid(x, y, r) {
    if (!NUMBER.test(x) || +x < -5 || +x > 3 || !Number.isInteger(+x))
        throw new ApiError("X должен быть целым числом от -5 до 3");
    if (!NUMBER.test(y) || +y < -3 || +y > 3)
        throw new ApiError("Y должен быть числом от -3 до 3");
    if (!NUMBER.test(r) || !R_VALUES.includes(+r))
        throw new ApiError("R должен быть одним из: " + R_VALUES.join(", "));
}

export async function checkHit(x, y, r) {
    const params = new URLSearchParams({"x-cord": x, "y-cord": y, "r-group": r});
    assertValid(x, y, r);
    let res;
    try {
        res = await fetch(`${ENDPOINT}?${params}`, {signal: AbortSignal.timeout(5000)});
    } catch {
        throw new ApiError("Сервер недоступен или не ответил вовремя");
    }

    let body = null;
    try { body = await res.json(); } catch {/**/}

    if (!res.ok) throw new ApiError(body?.error ?? `Ошибка сервера (${res.status})`);
    if (typeof body?.isHit !== "boolean") throw new ApiError("Некорректный ответ сервера");
    return body.isHit;
}