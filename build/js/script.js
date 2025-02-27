const BASE_URL = "https://moviebackend-production-2d2a.up.railway.app/api";

// 🔹 REGISTER FUNCTION
async function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    try {
        const response = await fetch(`${BASE_URL}/register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        alert(data.message || data.error);

    } catch (error) {
        console.error("Registration error:", error);
        alert("Failed to register. Try again.");
    }
}

// 🔹 LOGIN FUNCTION
async function login(event) {
    if (event) event.preventDefault(); // Prevent default form submission

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch(`${BASE_URL}/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.access) {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            console.log("Login successful!");
            window.location.href = "dashboard.html";  // Redirect after login
        } else {
            alert(data.detail || "Invalid login credentials");
        }

    } catch (error) {
        console.error("Login error:", error);
        alert("Failed to log in. Try again.");
    }
}

// 🔹 REFRESH TOKEN FUNCTION
async function refreshToken() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
        console.warn("No refresh token found.");
        logout();
        return null;
    }

    try {
        const response = await fetch(`${BASE_URL}/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh })
        });

        const data = await response.json();

        if (response.ok && data.access) {
            localStorage.setItem("access", data.access); // Update access token
            console.log("Token refreshed.");
            return data.access;
        } else {
            console.error("Token refresh failed:", data);
            logout();
            return null;
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        logout();
        return null;
    }
}

// 🔹 LOGOUT FUNCTION
function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "login.html"; // Redirect to login page
}

// 🔹 CENTRALIZED AUTHENTICATED REQUEST HANDLER
async function authenticatedFetch(url, options = {}) {
    let token = localStorage.getItem("access");

    if (!options.headers) options.headers = {};
    options.headers["Authorization"] = `Bearer ${token}`;

    let response = await fetch(url, options);

    if (response.status === 401) { // Token expired
        console.warn("Access token expired. Attempting refresh...");
        token = await refreshToken();
        if (!token) return; // If refresh fails, logout and stop execution

        options.headers["Authorization"] = `Bearer ${token}`; // Use new token
        response = await fetch(url, options); // Retry request
    }

    return response;
}

// 🔹 GET USER INFO (AFTER LOGIN)
async function getUserInfo() {
    const response = await authenticatedFetch(`${BASE_URL}/user/`, {
        method: "GET"
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById("user-info").innerText = `Welcome ${data.username} to Your Movie Dashboard`;
    } else {
        console.error("Failed to fetch user info.");
        logout();
    }
}

// 🔹 CHECK AUTHENTICATION STATUS ON PAGE LOAD
document.addEventListener("DOMContentLoaded", async function () {
    const userInfo = document.getElementById("user-info");

    if (!userInfo) return; // Stop if user-info is not found

    const token = localStorage.getItem("access");

    if (!token) {
        window.location.href = "login.html"; // Redirect if not authenticated
        return;
    }

    try {
        const response = await authenticatedFetch(`${BASE_URL}/user/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Failed to fetch user info");

        const data = await response.json();
        userInfo.innerText = `Welcome ${data.username} to Your Movie Dashboard`;

    } catch (error) {
        console.error(error);
        alert("Session expired, please log in again.");
        logout();
    }
});
