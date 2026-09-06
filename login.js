import { loginUser } from "./supabase.js";

//========================================
// KG JOB FINDER
// LOGIN
//========================================


//========================================
// ELEMENTS
//========================================

const password =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const loginForm =
    document.getElementById("loginForm");


//========================================
// SHOW / HIDE PASSWORD
//========================================

if (togglePassword) {

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

}


//========================================
// LOGIN
//========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            //========================================
            // GET FORM VALUES
            //========================================

            const email =
                document
                .getElementById("email")
                .value
                .trim();

            const pass =
                password.value.trim();


            //========================================
            // VALIDATION
            //========================================

            if (
                email === "" ||
                pass === ""
            ) {

                alert(
                    "Please complete all fields."
                );

                return;

            }


            //========================================
            // SUPABASE LOGIN
            //========================================

            const {
                data,
                error
            } = await loginUser(
                email,
                pass
            );


            //========================================
            // LOGIN ERROR
            //========================================

            if (error) {

                alert(error.message);

                return;

            }


            //========================================
            // CHECK USER
            //========================================

            const user =
                data?.user;


            if (!user) {

                alert(
                    "Login failed. Please try again."
                );

                return;

            }


            //========================================
            // GET ACCOUNT TYPE
            //========================================

            const accountType =
                user.user_metadata?.account_type;


            //========================================
            // CANDIDATE
            //========================================

            if (accountType === "candidate") {

                window.location.replace(
                    "candidate-dashboard.html"
                );

                return;

            }


            //========================================
            // EMPLOYER
            //========================================

            if (accountType === "employer") {

                window.location.replace(
                    "employer-dashboard.html"
                );

                return;

            }


            //========================================
            // ADMIN
            //========================================

            if (
                accountType === "admin" ||
                user.email?.toLowerCase() ===
                "kgjobfinder@gmail.com"
            ) {

                /*
                Admin currently enters the main dashboard.
                Later we will connect the Admin Dashboard
                with Candidate and Employer access.
                */

                window.location.replace(
                    "admin.html"
                );

                return;

            }


            //========================================
            // UNKNOWN ACCOUNT TYPE
            //========================================

            alert(
                "Your account type is not configured. Please contact the administrator."
            );

        }
    );

}