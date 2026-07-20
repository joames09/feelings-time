// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = "https://snfdxgjnwdihrjcwuess.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_sG_CpYhaZynQ3t4nARNngA_QShTkxYT";

let db = null;

// Initialize automatically on startup
window.addEventListener('DOMContentLoaded', () => {
    // Check both standard library variants (case sensitivity fallback)
    const supabaseLib = window.supabase || window.Supabase;
    
    if (supabaseLib) {
        db = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase connected successfully!");
    } else {
        console.error("Critical: Supabase script block was blocked by your browser network.");
    }
});

let currentNickname = "";

// Page Router Engine
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    if(pageId === 'page5') {
        document.body.classList.add('headphone-bg');
    } else {
        document.body.classList.remove('headphone-bg');
    }
}

function goToPage2() {
    const nick = document.getElementById('nicknameInput').value.trim();
    if(!nick) {
        alert("Please provide a nickname first!");
        return;
    }
    currentNickname = nick;
    document.getElementById('userGreeting').innerText = currentNickname;
    showPage('page2');
}

function goToQuestions() {
    showPage('page3');
}

function goToSadPage() {
    showPage('page5');
    const audio = document.getElementById('sadAudio');
    audio.currentTime = 0;
    audio.play().catch(e => {
        console.log("Audio play caught.");
    });
}

// Optimized Instant-Data Submission
async function submitResponses() {
    const q1Val = document.getElementById('q1').value.trim();
    const q2Val = document.getElementById('q2').value.trim();
    const q4Val = document.getElementById('q4').value.trim();
    const q5Val = document.getElementById('q5').value.trim();

    // Move to success screen instantly so the user experiences zero lag!
    showPage('page4');

    if (!db) {
        console.error("Database connection missing. Background save dropped.");
        return;
    }

    // Process database injection silently in the background
    try {
        await db
          .from('user_responses')
          .insert([
            { 
                nickname: currentNickname, 
                hidden_crush: q1Val, 
                secret_happiness: q2Val, 
                memorable_day: q4Val, 
                current_crush: q5Val 
            }
          ]);
    } catch (err) {
        console.error("Background save failed: " + err.message);
    }
}

// Admin Framework
function openAdminAuth() {
    showPage('pageAdminAuth');
}

function verifyAdminPassword() {
    const passInput = document.getElementById('adminPassword').value;
    if(passInput === "joel2006.") {
        document.getElementById('adminPassword').value = "";
        loadAdminData();
    } else {
        alert("Incorrect password!");
    }
}

async function loadAdminData() {
    if (!db) {
        alert("Your website cannot connect to the internet database right now. Please refresh and try again!");
        return;
    }

    try {
        const { data, error } = await db
            .from('user_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const displayArea = document.getElementById('adminDataOutput');
        displayArea.innerHTML = ""; 

        if(!data || data.length === 0) {
            displayArea.innerHTML = "<p style='color:#ccc; margin-top:10px;'>No entries recorded yet.</p>";
        } else {
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'response-card';
                card.innerHTML = `
                    <h3>User: ${escapeHtml(item.nickname)}</h3>
                    <p><strong>1. School Crush:</strong> ${escapeHtml(item.hidden_crush) || 'N/A'}</p>
                    <p><strong>2. Hidden Happy:</strong> ${escapeHtml(item.secret_happiness) || 'N/A'}</p>
                    <p><strong>4. Memorable Day:</strong> ${escapeHtml(item.memorable_day) || 'N/A'}</p>
                    <p><strong>5. Current Crush:</strong> ${escapeHtml(item.current_crush) || 'N/A'}</p>
                `;
                displayArea.appendChild(card);
            });
        }
        showPage('pageAdminDashboard');
    } catch (err) {
        alert("Failed to grab admin details: " + err.message);
    }
}

function escapeHtml(str) {
    if(!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function resetApp() {
    const audio = document.getElementById('sadAudio');
    audio.pause();
    
    document.getElementById('nicknameInput').value = "";
    document.getElementById('q1').value = "";
    document.getElementById('q2').value = "";
    document.getElementById('q4').value = "";
    document.getElementById('q5').value = "";
    
    showPage('page1');
}
