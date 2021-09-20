const dataToString = (data) =>
    (typeof data === 'object')
        ? JSON.stringify(data)
        : data.toString();

export default function updateElement (name, data) {
    const nodes = document.querySelectorAll(`[data-name=${name}]`);

    for (let el of Array.from(nodes)) {
        el.innerHTML = dataToString(data);
    }
}