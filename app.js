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

function copyCurrentLink() {
    const currentIframeSrc = document.getElementById('viewer-frame').src;
    if (!currentIframeSrc) return;
    
    navigator.clipboard.writeText(currentIframeSrc).then(() => {
        const shareBtn = document.getElementById('share-btn');
        shareBtn.innerText = "✅ COPIED!";
        setTimeout(() => { shareBtn.innerText = "📋 SHARE"; }, 2000);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

window.onload = bootstrap;
