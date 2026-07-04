let portals = [];
let historyIndex = -1;
let currentCategory = 'ALL';
let currentActiveUrl = '';

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
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    diveDeep();
}

function diveDeep() {
    if (portals.length === 0) return;
    
    let pool = portals;
    if (currentCategory !== 'ALL') {
        pool = portals.filter(portal => 
            portal.tags.toUpperCase().includes(currentCategory)
        );
    }
    
    if (pool.length === 0) {
        document.getElementById('site-title').innerText = `No sites found matching category: ${currentCategory}`;
        document.getElementById('fallback-banner').style.display = 'none';
        return;
    }
    
    let targetIndex;
    let selectedPortal;
    let iterations = 0;
    
    do {
        targetIndex = Math.floor(Math.random() * pool.length);
        selectedPortal = pool[targetIndex];
        iterations++;
    } while (currentActiveUrl === selectedPortal.url && pool.length > 1 && iterations < 10);
    
    currentActiveUrl = selectedPortal.url;
    
    // Turn the escape banner bar on automatically 
    document.getElementById('fallback-banner').style.display = 'flex';
    
    document.getElementById('viewer-frame').src = selectedPortal.url;
    document.getElementById('site-title').innerText = selectedPortal.title;
}

function openLinkExternally() {
    if (currentActiveUrl) {
        window.open(currentActiveUrl, '_blank');
    }
}

function copyCurrentLink() {
    if (!currentActiveUrl) return;
    
    navigator.clipboard.writeText(currentActiveUrl).then(() => {
        const shareBtn = document.getElementById('share-btn');
        shareBtn.innerText = "✅ COPIED!";
        setTimeout(() => { shareBtn.innerText = "📋 SHARE"; }, 2000);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

window.onload = bootstrap;

