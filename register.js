import { registerUser } from "./supabase.js";

//========================================
// KG JOB FINDER
// REGISTER
//========================================

//========================================
// ELEMENTS
//========================================

const password =
    document.getElementById("password");

const confirmPassword =
    document.getElementById("confirmPassword");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

const registerForm =
    document.getElementById("registerForm");

//========================================
// SHOW / HIDE PASSWORD
//========================================

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            if (
                password.type === "password"
            ) {

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
// SHOW / HIDE CONFIRM PASSWORD
//========================================

if (toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener(
        "click",
        () => {

            if (
                confirmPassword.type === "password"
            ) {

                confirmPassword.type = "text";

                toggleConfirmPassword.innerHTML =
                    '<i class="fa-solid fa-eye-slash"></i>';

            } else {

                confirmPassword.type = "password";

                toggleConfirmPassword.innerHTML =
                    '<i class="fa-solid fa-eye"></i>';

            }

        }
    );

}

//========================================
// REGISTER
//========================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const fullName =
                document
                    .getElementById("fullname")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const pass =
                password.value.trim();

            const confirm =
                confirmPassword.value.trim();

            const accountType =
                document
                    .getElementById("accountType")
                    .value;

            const terms =
                document
                    .getElementById("terms")
                    .checked;

            //========================================
            // VALIDATION
            //========================================

            if (

                fullName === "" ||

                email === "" ||

                pass === "" ||

                confirm === "" ||

                accountType === ""

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

            if (!terms) {

                alert(
                    "Please accept the Terms & Conditions."
                );

                return;

            }

            //========================================
            // CREATE ACCOUNT
            //========================================

            const {
                data,
                error
            } = await registerUser(

                email,

                pass,

                accountType

            );

            if (error) {

                console.error(
                    "Registration error:",
                    error
                );

                alert(
                    error.message
                );

                return;

            }

            console.log(
                "Registration successful:",
                data
            );

            alert(
                "Account created successfully!\n\nPlease check your email to verify your account."
            );

            window.location.href =
                "login.html";

        }
    );

}