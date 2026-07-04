let portals = [];
let historyIndex = -1;
let currentCategory = 'ALL';

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

function setCategory(categoryName, element) {
    currentCategory = categoryName;
    
    // Reset active visual states on buttons
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    
    // Jump straight into the newly selected category pipeline
    diveDeep();
}

function diveDeep() {
    if (portals.length === 0) return;
    
    // Filter portals based on user preference tags
    let pool = portals;
    if (currentCategory !== 'ALL') {
        pool = portals.filter(portal => 
            portal.tags.toUpperCase().includes(currentCategory)
        );
    }
    
    // Safety check if a category happens to be completely empty
    if (pool.length === 0) {
        document.getElementById('site-title').innerText = `No sites found matching category: ${currentCategory}`;
        return;
    }
    
    let targetIndex;
    let selectedPortal;
    let iterations = 0;
    
    // Shuffle code ensuring we don't immediately repeat sites if avoidable
    do {
        targetIndex = Math.floor(Math.random() * pool.length);
        selectedPortal = pool[targetIndex];
        iterations++;
    } while (document.getElementById('viewer-frame').src === selectedPortal.url && pool.length > 1 && iterations < 10);
    
    // Inject selected data into the front-end layout elements
    document.getElementById('viewer-frame').src = selectedPortal.url;
    document.getElementById('site-title').innerText = selectedPortal.title;
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
