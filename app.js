let portals = [];
let historyIndex = -1;

async function bootstrap() {
    try {
        const payload = await fetch('database.json');
        portals = await payload.json();
        diveDeep(); 
    } catch (failure) {
        document.getElementById('site-title').innerText = "Failed to load discovery portals.";
        console.error(failure);
    }
}

function diveDeep() {
    if (portals.length === 0) return;
    let targetIndex;
    do {
        targetIndex = Math.floor(Math.random() * portals.length);
    } while (targetIndex === historyIndex && portals.length > 1);
    
    historyIndex = targetIndex;
    const activePortal = portals[targetIndex];
    
    document.getElementById('viewer-frame').src = activePortal.url;
    document.getElementById('site-title').innerText = activePortal.title;
    document.getElementById('site-tags').innerText = activePortal.tags;
}

window.onload = bootstrap;
