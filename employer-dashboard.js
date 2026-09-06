import { supabase, logoutUser } from "./supabase.js";

//========================================
// KG JOB FINDER
// EMPLOYER DASHBOARD
//========================================

//========================================
// CHECK EMPLOYER ACCESS
//========================================

async function checkEmployerAccess() {

    const {
        data,
        error
    } = await supabase.auth.getSession();

    if (
        error ||
        !data.session ||
        !data.session.user
    ) {

        window.location.replace("login.html");

        return null;

    }

    const user =
        data.session.user;

    const accountType =
        user.user_metadata?.account_type;

    if (accountType !== "employer") {

        alert(
            "Access denied. Employer account required."
        );

        window.location.replace(
            "dashboard.html"
        );

        return null;

    }

    return user;
}

//========================================
// BUTTONS
//========================================

const postJobButton =
    document.getElementById("postJobBtn");

const myJobsButton =
    document.getElementById("myJobsBtn");

const applicationsButton =
    document.getElementById("applicationsBtn");

const profileButton =
    document.getElementById("profileBtn");

const logoutButton =
    document.getElementById("logoutBtn");

//========================================
// POST JOB
//========================================

if (postJobButton) {

    postJobButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "post-job.html";

        }
    );

}

//========================================
// MY JOBS
//========================================

if (myJobsButton) {

    myJobsButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "my-jobs.html";

        }
    );

}

//========================================
// APPLICATIONS
//========================================

if (applicationsButton) {

    applicationsButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "employer-applications.html";

        }
    );

}

//========================================
// PROFILE
//========================================

if (profileButton) {

    profileButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "employer-profile.html";

        }
    );

}

//========================================
// LOGOUT
//========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            const {
                error
            } = await logoutUser();

            if (error) {

                alert(
                    "Logout error: " +
                    error.message
                );

                return;

            }

            window.location.replace(
                "login.html"
            );

        }
    );

}

//========================================
// START
//========================================

checkEmployerAccess();