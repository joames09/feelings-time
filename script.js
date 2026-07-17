// 1. DATABASE LINK CONFIGURATION (Make sure there are no slashes at the end!)
const PROJECT_ID = "snfdxgjnwdihrjcwuess"; 
const ANON_KEY = "sb_publishable_sG_CpYhaZynQ3t4nARNngA_QShTkxYT"; 

let currentUserName = "";

// 2. USER PASSWORD VERIFICATION (1234)
function checkPassword() {
    const nameInput = document.getElementById("username").value.trim();
    const passInput = document.getElementById("password").value;
    const errorMsg = document.getElementById("login-error");

    if (nameInput === "") {
        errorMsg.innerText = "Please enter your beautiful name first!";
        return;
    }

    if (passInput === "1234") {
        currentUserName = nameInput;
        document.getElementById("login-page").classList.remove("active");
        document.getElementById("question-page").classList.add("active");
    } else {
        errorMsg.innerText = "Wrong password! Hint: 1234";
    }
}

// 3. SUBMIT FORM (Sends data directly to the internet database)
async function submitAnswers(event) {
    event.preventDefault();

    const dataToSave = {
        name: currentUserName,
        question_1: document.getElementById("q1").value,
        question_2: document.getElementById("q2").value,
        question_3: document.getElementById("q3").value,
        question_4: document.getElementById("q4").value,
        question_5: document.getElementById("q5").value
    };

    // Show the user the success page instantly so they don't experience a loading freeze
    document.getElementById("question-page").classList.remove("active");
    document.getElementById("success-page").classList.add("active");
    document.getElementById("quiz-form").reset();

    // Silently send the data to the central internet database via a background fetch request
    try {
        await fetch(`https://${PROJECT_ID}.supabase.co/rest/v1/floral_responses`, {
            method: 'POST',
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(dataToSave)
        });
    } catch (error) {
        console.error("Database cloud backup failed:", error);
    }
}

// 4. OPEN ADMIN GATEWAY (Requires password: joel)
function openAdminPanel() {
    const adminPassword = prompt("Enter Admin Password:");
    
    if (adminPassword === "joel") {
        document.getElementById("login-page").classList.remove("active");
        document.getElementById("admin-page").classList.add("active");
        displayResponses();
    } else if (adminPassword !== null) {
        alert("Access Denied! You are not authorized to view subscriptions.");
    }
}

// 5. FETCH AND DISPLAY EVERYONE'S SUBMISSIONS FROM THE INTERNET
async function displayResponses() {
    const container = document.getElementById("responses-container");
    container.innerHTML = "<p style='text-align:center; color:#95a5a6;'>Gathering flower secrets from the cloud...</p>"; 
    
    try {
        const response = await fetch(`https://${PROJECT_ID}.supabase.co/rest/v1/floral_responses?select=*`, {
            method: 'GET',
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`
            }
        });
        
        const allResponses = await response.json();
        container.innerHTML = ""; 
        
        if (!allResponses || allResponses.length === 0) {
            container.innerHTML = "<p style='text-align:center; color:#95a5a6;'>No garden subscriptions found yet.</p>";
            return;
        }
        
        // Loop through everyone's responses across the world!
        allResponses.forEach((entry) => {
            const card = document.createElement("div");
            card.className = "response-card";
            card.innerHTML = `
                <h3>${entry.name}</h3>
                <div class="response-item"><strong>Outfit Secret:</strong> ${entry.question_1 || ''}</div>
                <div class="response-item"><strong>Alien Movie:</strong> ${entry.question_2 || ''}</div>
                <div class="response-item"><strong>Panicked Lie:</strong> ${entry.question_3 || ''}</div>
                <div class="response-item"><strong>Blind Argument:</strong> ${entry.question_4 || ''}</div>
                <div class="response-item"><strong>Terrible Advice:</strong> ${entry.question_5 || ''}</div>
            `;
            container.appendChild(card);
        });
    } catch (dbError) {
        container.innerHTML = "<p style='text-align:center; color:red;'>Could not load from server. Ensure RLS is disabled.</p>";
        console.error("Database connection issue:", dbError);
    }
}

// 6. DELETE EVERYONE'S RESPONSES FROM THE SERVER
async function clearAllData() {
    const confirmDelete = confirm("Permanently erase ALL responses across the entire server database?");
    if (confirmDelete) {
        try {
            await fetch(`https://${PROJECT_ID}.supabase.co/rest/v1/floral_responses`, {
                method: 'DELETE',
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${ANON_KEY}`
                }
            });
            displayResponses();
            alert("Garden database wiped clean!");
        } catch (err) {
            alert("Failed to delete entries from the server.");
        }
    }
}

function goBackToLogin() {
    document.getElementById("admin-page").classList.remove("active");
    document.getElementById("login-page").classList.add("active");
}
