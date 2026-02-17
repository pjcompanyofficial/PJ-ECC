<!-- Three-dot Menu -->
<div class="menu-btn" onclick="toggleMenu()">⋮</div>
<div class="menu-content" id="dropdown">
    <div onclick="showChangeLog(); toggleMenu();">CHANGE LOG</div>
    <div onclick="toggleMute()">MUTE/UNMUTE</div>
    <div onclick="toggleTheme()">THEME</div>
    <div onclick="toggleCyber()">CYBER MODE</div>
</div>

<!-- Change Log Popup -->
<div id="changeLog" class="hidden" style="
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ff6a00;
    color: #000;
    padding: 20px;
    border-radius: 20px;
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 9999;
    box-shadow: 0 0 25px rgba(255,106,0,0.6);
">
    <h3 style="margin-top:0; text-align:center;">PJ-ECC CHANGE LOG</h3>
    <ul id="logList" style="padding-left: 15px; font-size:0.85em;">
        <!-- Log items dynamically added here -->
    </ul>
    <button onclick="document.getElementById('changeLog').classList.add('hidden');"
        style="margin-top:10px; width:100%; padding:10px; border:none; border-radius:10px; background:#000; color:#ff6a00; font-weight:bold; cursor:pointer;">
        CLOSE
    </button>
</div>

<script>
const logs = [
    "✔ Bug fixes in QR scanner",
    "✔ Added Scan Purpose selector",
    "✔ Offline mode indicator",
    "✔ PWA update notification",
    "✔ Premium bubble + grid animation",
    "✔ Security & UX improvements",
    "✔ Admin panel enhancements"
];

function showChangeLog(){
    const ul = document.getElementById("logList");
    ul.innerHTML = ""; // Clear previous
    logs.forEach(log => {
        const li = document.createElement("li");
        li.innerText = log;
        ul.appendChild(li);
    });
    document.getElementById("changeLog").classList.remove("hidden");
}
</script>
