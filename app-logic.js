// app-logic.js
let scanner;
let adminPhotoBase64 = "";

// --- 1. Security Logic ---
function applySecurity(lock) {
    const targets = [document.getElementById('final-card'), document.getElementById('qr-wrap')];
    const overlay = document.getElementById('shield-overlay');
    targets.forEach(el => { if(el) lock ? el.classList.add('security-lock') : el.classList.remove('security-lock'); });
    overlay.style.display = lock ? "block" : "none";
}

window.onblur = () => applySecurity(true);
window.onfocus = () => applySecurity(false);

// --- 2. Navigation ---
function switchView(id) {
    document.querySelectorAll('.container > div').forEach(div => div.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// --- 3. Scanner Logic ---
async function startScanning() {
    if (scanner) { await scanner.clear(); } 
    scanner = new Html5Qrcode("reader");
    const config = { fps: 25, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };
    
    try {
        await scanner.start({ facingMode: "environment" }, config, (text) => {
            scanner.stop().then(() => {
                scanner.clear();
                processToken(text);
            });
        });
    } catch (err) { alert("Camera Permission Denied!"); }
}

function scanFromGallery(event) {
    const file = event.target.files[0];
    if (!file) return;
    const tempScanner = new Html5Qrcode("reader");
    tempScanner.scanFile(file, true)
        .then(text => processToken(text))
        .catch(() => switchView('view-error'));
}

// --- 4. Core Logic (Decryption) ---
function processToken(data) {
    try {
        if(!data.startsWith("SEC|")) throw new Error();
        const payload = data.split("SEC|")[1];
        const reversed = payload.split('').reverse().join('');
        const decrypted = atob(reversed); 
        const user = JSON.parse(decrypted);
        
        switchView('view-card');
        document.getElementById('resName').innerText = user.n;
        document.getElementById('resAddr').innerText = user.a;
        document.getElementById('resPhoto').src = user.p;
        
        if(navigator.vibrate) navigator.vibrate(100);
    } catch(e) { switchView('view-error'); }
}

// --- 5. Admin & Generator ---
function checkAdmin() {
    if(document.getElementById('adminPass').value === "sonu@jeet") switchView('view-admin');
    else switchView('view-error');
}

function previewAdminPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 80; canvas.height = 80;
                ctx.drawImage(img, 0, 0, 80, 80);
                adminPhotoBase64 = canvas.toDataURL('image/jpeg', 0.6);
                document.getElementById('photo-status').innerText = "PHOTO ATTACHED ✅";
            };
        };
        reader.readAsDataURL(file);
    }
}

function generateLuxuryQR() {
    const n = document.getElementById('mName').value;
    const a = document.getElementById('mAddr').value;
    if(!n || !adminPhotoBase64) return alert("Missing Info");
    const qrd = document.getElementById('qrcode');
    qrd.innerHTML = "";
    const raw = JSON.stringify({ n, a, p: adminPhotoBase64 });
    const encrypted = btoa(raw).split('').reverse().join('');
    new QRCode(qrd, { text: "SEC|" + encrypted, width: 200, height: 200 });
    document.getElementById('qr-result').classList.remove('hidden');
}

function saveQR() {
    html2canvas(document.getElementById('qr-wrap')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'PJ_TOKEN.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
