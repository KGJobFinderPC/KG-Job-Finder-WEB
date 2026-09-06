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

    try {

        const url =
            new URL(window.location.href);

        //========================================
        // CHECK FOR CODE
        //========================================

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
                    "Recovery code error:",
                    error
                );

                alert(
                    "This password reset link is invalid or has expired."
                );

                return false;
            }
        }

        //========================================
        // CHECK CURRENT SESSION
        //========================================

        const {
            data,
            error
        } =
            await supabase.auth.getSession();

        if (error) {

            console.error(
                "Session error:",
                error
            );

            alert(
                "Unable to verify password reset session."
            );

            return false;
        }

        if (!data || !data.session) {

            console.error(
                "No Supabase recovery session found."
            );

            alert(
                "This password reset link is invalid or has expired."
            );

            return false;
        }

        console.log(
            "Password recovery session ready."
        );

        return true;

    } catch (error) {

        console.error(
            "Password recovery error:",
            error
        );

        alert(
            "An error occurred while preparing the password reset."
        );

        return false;
    }
}


//========================================
// SHOW / HIDE PASSWORD
//========================================

togglePassword.addEventListener(
    "click",
    () => {

        if (
            password.type ===
            "password"
        ) {

            password.type =
                "text";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            password.type =
                "password";

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


        if (
            pass !== confirm
        ) {

            alert(
                "Passwords do not match."
            );

            return;
        }


        if (
            pass.length < 8
        ) {

            alert(
                "Password must contain at least 8 characters."
            );

            return;
        }


        //========================================
        // CHECK RECOVERY SESSION
        //========================================

        const sessionReady =
            await preparePasswordRecovery();

        if (!sessionReady) {

            return;
        }


        //========================================
        // UPDATE PASSWORD
        //========================================

        try {

            const {
                error
            } =
                await updatePassword(
                    pass
                );


            if (error) {

                console.error(
                    "Password update error:",
                    error
                );

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

        } catch (error) {

            console.error(
                "Unexpected password error:",
                error
            );

            alert(
                "An unexpected error occurred while changing the password."
            );
        }
    }
);