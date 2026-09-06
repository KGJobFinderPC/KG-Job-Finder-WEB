import { currentSession } from "./supabase.js";

//========================================
// KG JOB FINDER
// DASHBOARD
//========================================

//========================================
// DASHBOARD PROTECTION
//========================================

const {
    data,
    error
} = await currentSession();

if (error || !data.session) {

    window.location.replace("login.html");

} else {

    //========================================
    // DASHBOARD
    //========================================

    const dashboardButton =
        document.getElementById("dashboardBtn");

    if (dashboardButton) {

        dashboardButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "dashboard.html";

            }
        );

    }

    //========================================
    // FIND JOBS
    //========================================

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

    //========================================
    // APPLICATIONS
    //========================================

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

    //========================================
    // MY PROFILE
    //========================================

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

    //========================================
    // UPLOAD CV
    //========================================

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

    //========================================
    // RECOMMENDED JOBS
    //========================================

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

}