const BASE_URL = "http://127.0.0.1:8000/api";

async function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    
    const response = await fetch(`${BASE_URL}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    alert(data.message || data.error);
}

async function login(event) {
    if (event) event.preventDefault(); // Prevent form submission (if inside a form)

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    console.log("Attempting login..."); // Debugging log

    const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log("Login Response:", data); // Debugging log

    if (response.ok && data.access) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        console.log("Login successful! Redirecting...");
        window.location.href = "dashboard.html";  // Redirect after successful login
    } else {
        console.error("Login failed:", data);
        alert(data.detail || "Invalid login credentials");
    }
}


async function getUserInfo() {
    const token = localStorage.getItem("access");
    const response = await fetch(`${BASE_URL}/user/`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();
    document.getElementById("user-info").innerText = data.username || "Not authenticated";
}

document.addEventListener("DOMContentLoaded", async function () {
    const userInfo = document.getElementById("user-info");

    if (!userInfo) return; // Stop if user-info is not found

    const token = localStorage.getItem("access");

    if (!token) {
        window.location.href = "login.html"; // Redirect to login if not authenticated
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/user/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Failed to fetch user info");

        const data = await response.json();
        userInfo.innerText = `Hello, ${data.username}! 👋`; // Display username

    } catch (error) {
        console.error(error);
        alert("Session expired, please log in again.");
        localStorage.removeItem("access");
        window.location.href = "login.html";
    }
});


// Logout function
function logout() {
    localStorage.removeItem("access"); // Remove token
    window.location.href = "login.html"; // Redirect to login page
}
