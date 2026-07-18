// --- SUPABASE CONFIGURATION ---
// Paste your actual project values here to make data storage real!
const SUPABASE_URL = "https://snfdxgjnwdihrjcwuess.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZmR4Z2pud2RpaHJqY3d1ZXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTUxNjAsImV4cCI6MjA5OTc5MTE2MH0.N7v89MvBDWLq2gLxHS-LbzptmmE81X7mSZzVqz1GsEg";

let supabase = null;

// Safety Switch: Checks for valid database keys
if (SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY") {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch(e) {
        console.error("Supabase connection error: ", e);
    }
}

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
        console.log("Audio block active. Manual play triggered via fallback UI.");
    });
}

// Optimized Instant-Data Submission
async function submitResponses() {
    const q1Val = document.getElementById('q1').value.trim();
    const q2Val = document.getElementById('q2').value.trim();
    const q4Val = document.getElementById('q4').value.trim();
    const q5Val = document.getElementById('q5').value.trim();

    // 1. Move to success screen instantly so the user experiences zero lag!
    showPage('page4');

    if (!supabase) return;

    // 2. Process database injection silently in the background
    try {
        await supabase
          .from('user_responses')
          .insert([
            { nickname: currentNickname, q1: q1Val, q2: q2Val, q4: q4Val, q5: q5Val }
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
    if (!supabase) {
        alert("Database keys missing.");
        showPage('pageAdminDashboard');
        document.getElementById('adminDataOutput').innerHTML = "<p>Please add your valid Supabase project details to see entries.</p>";
        return;
    }

    try {
        const { data, error } = await supabase
            .from('user_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const displayArea = document.getElementById('adminDataOutput');
        displayArea.innerHTML = ""; 

        if(data.length === 0) {
            displayArea.innerHTML = "<p>No entries recorded yet.</p>";
        } else {
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'response-card';
                card.innerHTML = `
                    <h3>User: ${item.nickname}</h3>
                    <p><strong>1. School Crush:</strong> ${item.q1 || 'N/A'}</p>
                    <p><strong>2. Hidden Happy:</strong> ${item.q2 || 'N/A'}</p>
                    <p><strong>4. Memorable Day:</strong> ${item.q4 || 'N/A'}</p>
                    <p><strong>5. Current Crush:</strong> ${item.q5 || 'N/A'}</p>
                `;
                displayArea.appendChild(card);
            });
        }
        showPage('pageAdminDashboard');
    } catch (err) {
        alert("Failed to grab admin details: " + err.message);
    }
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
