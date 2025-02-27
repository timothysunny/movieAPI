document.addEventListener("DOMContentLoaded", async function () {
    const greeting = document.getElementById("greeting");
    const logoutBtn = document.getElementById("logoutBtn");

    // Retrieve token from localStorage
    const token = localStorage.getItem("access");

    if (!token) {
        window.location.href = "login.html"; // Redirect to login if not authenticated
        return;
    }

    // Fetch user info from backend
    try {
        const response = await fetch("http://127.0.0.1:8000/api/user/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        greeting.innerText = `Hello, ${data.username}`; // Update greeting message

    } catch (error) {
        console.error(error);
        alert("Session expired, please log in again.");
        localStorage.removeItem("access");
        window.location.href = "login.html";
    }

    // Logout functionality
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("access");
        window.location.href = "login.html";
    });
});
