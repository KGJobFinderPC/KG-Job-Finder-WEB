import { logoutUser } from "./supabase.js";

//========================================
// KG JOB FINDER
// LOGOUT
//========================================

const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        const { error } = await logoutUser();

        if (error) {

            alert("Logout error: " + error.message);
            return;

        }

        console.log("Logout successful.");

        window.location.replace("login.html");

    });

}