const Inject = () => {
    let node = document.createElement('div');
    node.style.position = 'fixed';
    node.style.width = '110px';
    node.style.height = '30px';
    node.style.backgroundColor = 'aqua';
    chrome.storage.local.get(['context'], (result) => {
        if (result.context) {
            node.style.left = result.context.left;
            node.style.top = result.context.top;
        } else {
            node.style.left = '100px';
            node.style.top = '500px';
        }
    })
    node.textContent = 'Inject Context';
    node.draggable = true;
    const root = document.body.appendChild(node);
    root.ondragend = (e) => {
        console.log(e);
        root.style.left = e.clientX + 'px';
        root.style.top = e.clientY + 'px';
        chrome.storage.local.set({ context: { left: root.style.left, top: root.style.top } })
    }
}
Inject();

// const textElement = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'span', 'li']
// textElement.map(node => {
//     document.getElementsByTagName(node)!.length
//     for (let i = 0; i < document.getElementsByTagName(node)!.length; i++) {
//         const currentElement = document.getElementsByTagName(node)[i] as HTMLElement;
//         const newElement = document.createElement(node);
//         newElement.textContent = currentElement.textContent;
//         Object.assign(newElement.style, currentElement.style);
//         currentElement.classList.forEach(cls => {
//             newElement.classList.add(cls)
//         })
//         currentElement.insertAdjacentElement("beforebegin", newElement)
//     }
// })