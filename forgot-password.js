//========================================
// KG JOB FINDER
// FORGOT PASSWORD
//========================================

import { resetPassword } from "./supabase.js";

const forgotForm =
    document.getElementById("forgotForm");

const email =
    document.getElementById("email");

//========================================
// SEND RESET LINK
//========================================

forgotForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const emailValue =
            email.value.trim();

        //========================================
        // VALIDATE EMAIL
        //========================================

        if (emailValue === "") {

            alert(
                "Please enter your email address."
            );

            return;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailValue)) {

            alert(
                "Please enter a valid email address."
            );

            return;
        }

        //========================================
        // SEND RESET EMAIL
        //========================================

        const {
            error
        } = await resetPassword(
            emailValue
        );

        if (error) {

            alert(
                "Password reset error: " +
                error.message
            );

            return;
        }

        //========================================
        // SUCCESS
        //========================================

        alert(
            "Password reset link sent successfully. Please check your email."
        );

    }
);