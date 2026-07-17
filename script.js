// GLOBAL DATABASE SETTINGS
let userNickname = "";
const BASE_API_URL = "https://snfdxgjnwdihrjcwuess.supabase.co"; 
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZmR4Z2pud2RpaHJqY3d1ZXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTUxNjAsImV4cCI6MjA5OTc5MTE2MH0.N7v89MvBDWLq2gLxHS-LbzptmmE81X7mSZzVqz1GsEg";

// NAVIGATION ENGINE
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function goToPage2() {
    userNickname = document.getElementById('nickname').value.trim();
    if (!userNickname) {
        alert("Please enter a nickname first!");
        return;
    }
    showPage('page2');
}

function handleStatus(status) {
    if (status === 'alright') {
        showPage('page3');
    } else {
        showPage('page5');
        try {
            const song = document.getElementById('sadSong');
            if (song) {
                song.currentTime = 0;
                setTimeout(() => {
                    song.play().catch(e => console.log("Audio waiting for user tap."));
                }, 100);
            }
        } catch(err) {
            console.log("Audio bypass.");
        }
    }
}

function stopMusic() {
    try { document.getElementById('sadSong').pause(); } catch(e){}
    showPage('page1');
}

// DATABASE DATA SUBMISSION
async function submitAnswers() {
    const payload = {
        nickname: userNickname,
        crush_school: document.getElementById('q1').value,
        happy_secret: document.getElementById('q2').value,
        memorable_day: document.getElementById('q4').value,
        current_crush: document.getElementById('q5').value
    };

    try {
        const response = await fetch(BASE_API_URL, {
            method: "POST",
            headers: {
                "apikey": ANON_KEY,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showPage('page4');
        } else {
            alert("Error saving answers. Check table schemas!");
        }
    } catch (err) {
        alert("Submission network error.");
    }
}

// SECRET ADMIN SUB-SYSTEM
function openAdminModal() {
    const password = prompt("Enter Admin Password:");
    if (password === "joel2006.") {
        showPage('page6');
        fetchAdminData();
    } else if (password !== null) {
        alert("Incorrect password!");
    }
}

async function fetchAdminData() {
    document.getElementById('adminData').innerText = "Loading responses...";
    
    try {
        // Cleaned up headers prevent header duplication errors
        const response = await fetch(`${BASE_API_URL}?select=*&order=created_at.desc`, {
            method: "GET",
            headers: {
                "apikey": ANON_KEY
            }
        });

        if (!response.ok) {
            document.getElementById('adminData').innerText = "Failed to pull records. Check database state.";
            return;
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            document.getElementById('adminData').innerText = "No responses recorded yet.";
            return;
        }

        let html = `<div class="admin-table-wrapper"><table class="admin-table">
            <tr>
                <th>Name</th>
                <th>Q1 (School)</th>
                <th>Q2 (Happy)</th>
                <th>Q4 (Memorable)</th>
                <th>Q5 (Crush)</th>
            </tr>`;
        
        data.forEach(row => {
            html += `<tr>
                <td><b>${escapeHtml(row.nickname)}</b></td>
                <td>${escapeHtml(row.crush_school)}</td>
                <td>${escapeHtml(row.happy_secret)}</td>
                <td>${escapeHtml(row.memorable_day)}</td>
                <td>${escapeHtml(row.current_crush)}</td>
            </tr>`;
        });
        html += `</table></div>`;
        document.getElementById('adminData').innerHTML = html;

    } catch (err) {
        document.getElementById('adminData').innerText = "Connection error dropped.";
        console.error(err);
    }
}

function exitAdmin() {
    showPage('page1');
}

function escapeHtml(text) {
    return text ? text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
}

// EVENT LISTENERS INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("nextBtn").addEventListener("click", goToPage2);
    document.getElementById("adminBtn").addEventListener("click", openAdminModal);
    document.getElementById("alrightBtn").addEventListener("click", () => handleStatus('alright'));
    document.getElementById("notAlrightBtn").addEventListener("click", () => handleStatus('not-alright'));
    document.getElementById("submitBtn").addEventListener("click", submitAnswers);
    document.getElementById("backBtn").addEventListener("click", stopMusic);
    document.getElementById("exitAdminBtn").addEventListener("click", exitAdmin);
});
