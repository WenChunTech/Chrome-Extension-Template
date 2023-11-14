const eventSource = new EventSource('http://localhost:3000/reload');

eventSource.addEventListener("compiled", () => {
    chrome.runtime.reload();
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //     if (tabs.length > 0) {
    //         chrome.tabs.reload(tabs[0].id as number);
    //     }
    // })
})

console.log('event source add event listener');