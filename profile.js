import { supabase } from "./supabase.js";

//========================================
// KG JOB FINDER
// MY PROFILE
//========================================

const profileForm =
    document.getElementById("profileForm");

const fullNameInput =
    document.getElementById("fullName");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const cityInput =
    document.getElementById("city");

const countryInput =
    document.getElementById("country");

const birthDateInput =
    document.getElementById("birthDate");

const bioInput =
    document.getElementById("bio");
    //========================================
// LOAD CURRENT USER PROFILE
//========================================

async function loadProfile() {

    const {
        data: userData,
        error: userError
    } = await supabase.auth.getUser();

    if (userError || !userData.user) {

        window.location.replace("login.html");

        return;

    }

    const user = userData.user;

    const {
        data: profile,
        error: profileError
    } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {

        alert(
            "Unable to load your profile: " +
            profileError.message
        );

        return;

    }

    //========================================
    // LOAD PROFILE DATA
    //========================================

    if (profile) {

        fullNameInput.value =
            profile.full_name || "";

        emailInput.value =
            profile.email ||
            user.email ||
            "";

        phoneInput.value =
            profile.phone || "";

        cityInput.value =
            profile.city || "";

        countryInput.value =
            profile.country || "";

        birthDateInput.value =
            profile.date_of_birth || "";

        bioInput.value =
            profile.bio || "";

    } else {

        emailInput.value =
            user.email || "";

    }

}

//========================================
// START PROFILE
//========================================

loadProfile();
//========================================
// SAVE PROFILE
//========================================

profileForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const fullName =
            fullNameInput.value.trim();

        const email =
            emailInput.value.trim();

        const phone =
            phoneInput.value.trim();

        const city =
            cityInput.value.trim();

        const country =
            countryInput.value.trim();

        const birthDate =
            birthDateInput.value;

        const bio =
            bioInput.value.trim();

        //========================================
        // VALIDATION
        //========================================

        if (
            fullName === "" ||
            email === ""
        ) {

            alert(
                "Please complete all required fields."
            );

            return;

        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            alert(
                "Please enter a valid email address."
            );

            return;

        }

        if (
            phone !== "" &&
            !/^[0-9+\-\s()]+$/.test(phone)
        ) {

            alert(
                "Please enter a valid phone number."
            );

            return;

        }

        //========================================
        // GET CURRENT USER
        //========================================

        const {
            data: userData,
            error: userError
        } = await supabase.auth.getUser();

        if (
            userError ||
            !userData.user
        ) {

            window.location.replace(
                "login.html"
            );

            return;

        }

        const userId =
            userData.user.id;

        //========================================
        // SAVE TO SUPABASE
        //========================================

        const {
            error: saveError
        } = await supabase
            .from("profiles")
            .upsert({

                id: userId,

                full_name: fullName,

                email: email,

                phone: phone,

                city: city,

                country: country,

                date_of_birth:
                    birthDate || null,

                bio: bio

            });

        if (saveError) {

            alert(
                "Unable to save your profile: " +
                saveError.message
            );

            return;

        }

        alert(
            "Profile saved successfully."
        );

    }
);
//========================================
// DASHBOARD NAVIGATION
//========================================

async function goToCorrectDashboard() {

    const {
        data,
        error
    } = await supabase.auth.getUser();

    if (error || !data.user) {

        window.location.replace(
            "login.html"
        );

        return;
    }

    const accountType =
        data.user.user_metadata?.account_type;


    // ADMIN

    if (accountType === "admin") {

        window.location.replace(
            "dashboard.html"
        );

        return;
    }


    // CANDIDATE

    if (accountType === "candidate") {

        window.location.replace(
            "candidate-dashboard.html"
        );

        return;
    }


    // EMPLOYER

    if (accountType === "employer") {

        window.location.replace(
            "employer-dashboard.html"
        );

        return;
    }


    window.location.replace(
        "login.html"
    );
}


//========================================
// DASHBOARD BUTTONS
//========================================

const dashboardButton =
    document.getElementById(
        "dashboardButton"
    );

const backDashboardButton =
    document.getElementById(
        "backDashboardButton"
    );


if (dashboardButton) {

    dashboardButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            goToCorrectDashboard();

        }
    );

}


if (backDashboardButton) {

    backDashboardButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            goToCorrectDashboard();

        }
    );

}