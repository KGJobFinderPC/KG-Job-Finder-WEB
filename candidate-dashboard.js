import { currentSession, logoutUser, supabase } from "./supabase.js";

//==================================================
// KG JOB FINDER
// CANDIDATE DASHBOARD
//==================================================


//==================================================
// SESSION CHECK
//==================================================

const {
    data,
    error
} = await currentSession();


//==================================================
// NO SESSION
//==================================================

if (error || !data.session) {

    window.location.replace("login.html");

}


//==================================================
// SESSION EXISTS
//==================================================

else {

    const user = data.session.user;

    const accountType =
        user.user_metadata?.account_type;


    //==================================================
    // ACCESS CONTROL
    // Candidate + Admin allowed
    // Employer denied
    //==================================================

    if (
        accountType !== "candidate" &&
        accountType !== "admin"
    ) {

        window.location.replace("login.html");

    }


    //==================================================
    // FIND JOBS
    //==================================================

    const findJobsButton =
        document.getElementById("findJobsBtn");

    if (findJobsButton) {

        findJobsButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "jobs.html";

            }
        );

    }


    //==================================================
    // APPLICATIONS
    //==================================================

    const applicationsButton =
        document.getElementById("applicationsBtn");

    if (applicationsButton) {

        applicationsButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "applications.html";

            }
        );

    }


    //==================================================
    // MY PROFILE
    //==================================================

    const profileButton =
        document.getElementById("profileBtn");

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "profile.html";

            }
        );

    }


    //==================================================
    // UPLOAD CV
    //==================================================

    const uploadCvButton =
        document.getElementById("uploadCvBtn");

    if (uploadCvButton) {

        uploadCvButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "upload-cv.html";

            }
        );

    }


    //==================================================
    // RECOMMENDED JOBS
    //==================================================

    const recommendedJobsButton =
        document.getElementById(
            "recommendedJobsBtn"
        );

    if (recommendedJobsButton) {

        recommendedJobsButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "jobs.html";

            }
        );

    }


    //==================================================
    // LOGOUT
    //==================================================

    const logoutButton =
        document.getElementById("logoutBtn");

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

}