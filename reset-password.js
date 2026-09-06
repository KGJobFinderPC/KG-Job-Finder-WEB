//========================================
// KG JOB FINDER
// RESET PASSWORD
//========================================

import {
    supabase,
    updatePassword
} from "./supabase.js";

const password =
    document.getElementById("password");

const confirmPassword =
    document.getElementById("confirmPassword");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

const resetForm =
    document.getElementById("resetForm");
//========================================
// HANDLE PASSWORD RECOVERY SESSION
//========================================

async function preparePasswordRecovery() {

    const url =
        new URL(window.location.href);

    const code =
        url.searchParams.get("code");

    if (code) {

        const {
            error
        } =
            await supabase.auth.exchangeCodeForSession(
                code
            );

        if (error) {

            console.error(
                "Recovery session error:",
                error
            );

            alert(
                "This password reset link is invalid or has expired."
            );

            return false;
        }

    }

    return true;
}

preparePasswordRecovery();
//========================================
// SHOW / HIDE PASSWORD
//========================================

togglePassword.addEventListener(
    "click",
    () => {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            password.type = "password";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    }
);

//========================================
// SHOW / HIDE CONFIRM PASSWORD
//========================================

toggleConfirmPassword.addEventListener(
    "click",
    () => {

        if (
            confirmPassword.type ===
            "password"
        ) {

            confirmPassword.type =
                "text";

            toggleConfirmPassword.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            confirmPassword.type =
                "password";

            toggleConfirmPassword.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    }
);

//========================================
// RESET PASSWORD
//========================================

resetForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const pass =
            password.value.trim();

        const confirm =
            confirmPassword.value.trim();

        //========================================
        // VALIDATION
        //========================================

        if (
            pass === "" ||
            confirm === ""
        ) {

            alert(
                "Please complete all fields."
            );

            return;
        }

        if (pass !== confirm) {

            alert(
                "Passwords do not match."
            );

            return;
        }

        if (pass.length < 8) {

            alert(
                "Password must contain at least 8 characters."
            );

            return;
        }

        //========================================
        // UPDATE PASSWORD IN SUPABASE
        //========================================

        const {
            error
        } = await updatePassword(
            pass
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
            "Password changed successfully. You can now log in with your new password."
        );

        window.location.replace(
            "login.html"
        );

    }
);