import { supabase } from "./supabase.js";


//========================================
// KG JOB FINDER
// MY JOBS
//========================================


//========================================
// ELEMENTS
//========================================

const jobsContainer =
    document.getElementById("myJobsContainer");


//========================================
// TRANSLATION HELPER
//========================================

function translateDynamicContent() {

    if (
        typeof translateDataAttributes ===
        "function"
    ) {

        translateDataAttributes();

    }

}


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

        window.location.replace(
            "login.html"
        );

        return null;

    }


    const user =
        data.session.user;


    const accountType =
        user.user_metadata?.account_type;


    if (
        accountType !== "employer"
    ) {

        alert(
            "Access denied. Employer account required."
        );

        window.location.replace(
            "employer-dashboard.html"
        );

        return null;

    }


    return user;

}


//========================================
// LOAD MY JOBS
//========================================

async function loadMyJobs() {

    if (!jobsContainer) {

        console.error(
            "myJobsContainer was not found."
        );

        return;

    }


    const user =
        await checkEmployerAccess();


    if (!user) {

        return;

    }


    //========================================
    // LOAD ONLY THIS EMPLOYER'S JOBS
    //========================================

    const {
        data: jobs,
        error
    } = await supabase

        .from("jobs")

        .select("*")

        .eq(
            "user_id",
            user.id
        );


    //========================================
    // HANDLE ERROR
    //========================================

    if (error) {

        console.error(
            "Unable to load jobs:",
            error
        );


        jobsContainer.innerHTML = `

            <div class="no-jobs">

                <h3 data-translate="myJobs.loadError">
                    Unable to load jobs
                </h3>

                <p>
                    ${escapeHtml(
                        error.message
                    )}
                </p>

            </div>

        `;


        translateDynamicContent();

        return;

    }


    //========================================
    // DISPLAY JOBS
    //========================================

    renderJobs(
        jobs || []
    );

}


//========================================
// ESCAPE HTML
//========================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


//========================================
// RENDER JOBS
//========================================

function renderJobs(jobs) {

    jobsContainer.innerHTML = "";


    //========================================
    // NO JOBS
    //========================================

    if (
        !jobs ||
        jobs.length === 0
    ) {

        jobsContainer.innerHTML = `

            <div class="no-jobs">

                <h3 data-translate="myJobs.noJobs">
                    No jobs yet
                </h3>

                <p data-translate="myJobs.noJobsText">
                    You have not published any jobs yet.
                </p>

            </div>

        `;


        translateDynamicContent();

        return;

    }


    //========================================
    // CREATE JOB CARDS
    //========================================

    jobs.forEach(
        job => {


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "job-card";


            //========================================
            // JOB DATA
            //========================================

            const title =
                job.title ||
                "Untitled Job";


            const company =
                job.company ||
                "Unknown Company";


            const city =
                job.city ||
                "Not specified";


            const salary =
                job.salary ||
                "Not specified";


            const description =
                job.description ||
                "No description available.";


            //========================================
            // CARD
            //========================================

            card.innerHTML = `

                <h3>
                    ${escapeHtml(title)}
                </h3>


                <h4>
                    ${escapeHtml(company)}
                </h4>


                <p>

                    <i class="fa-solid fa-location-dot"></i>

                    ${escapeHtml(city)}

                </p>


                <p>

                    <i class="fa-solid fa-money-bill-wave"></i>

                    ${escapeHtml(salary)}

                </p>


                <p class="job-description">

                    ${escapeHtml(description)}

                </p>


                <div class="job-actions">


                    <button
                        class="edit-btn"
                        type="button"
                        data-translate="common.edit">

                        <i class="fa-solid fa-pen"></i>

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        type="button"
                        data-translate="common.delete">

                        <i class="fa-solid fa-trash"></i>

                        Delete

                    </button>


                </div>

            `;


            //========================================
            // EDIT JOB
            //========================================

            const editButton =
                card.querySelector(
                    ".edit-btn"
                );


            editButton.addEventListener(
                "click",
                () => {

                    if (!job.id) {

                        alert(
                            "Unable to find this job."
                        );

                        return;

                    }


                    window.location.href =
                        "edit-job.html?id=" +
                        encodeURIComponent(
                            job.id
                        );

                }
            );


            //========================================
            // DELETE JOB
            //========================================

            const deleteButton =
                card.querySelector(
                    ".delete-btn"
                );


            deleteButton.addEventListener(
                "click",
                async () => {


                    if (!job.id) {

                        alert(
                            "Unable to find this job."
                        );

                        return;

                    }


                    //========================================
                    // CONFIRM DELETE
                    //========================================

                    const confirmed =
                        window.confirm(
                            "Are you sure you want to delete this job?"
                        );


                    if (!confirmed) {

                        return;

                    }


                    //========================================
                    // CHECK EMPLOYER
                    //========================================

                    const user =
                        await checkEmployerAccess();


                    if (!user) {

                        return;

                    }


                    //========================================
                    // DISABLE BUTTON
                    //========================================

                    deleteButton.disabled =
                        true;


                    deleteButton.innerHTML = `

                        <i class="fa-solid fa-spinner fa-spin"></i>

                        <span data-translate="myJobs.deleting">
                            Deleting...
                        </span>

                    `;


                    translateDynamicContent();


                    //========================================
                    // DELETE ONLY THIS EMPLOYER'S JOB
                    //========================================

                    const {
                        error
                    } = await supabase

                        .from("jobs")

                        .delete()

                        .eq(
                            "id",
                            job.id
                        )

                        .eq(
                            "user_id",
                            user.id
                        );


                    //========================================
                    // HANDLE ERROR
                    //========================================

                    if (error) {

                        console.error(
                            "Unable to delete job:",
                            error
                        );


                        alert(
                            "Unable to delete job: " +
                            error.message
                        );


                        deleteButton.disabled =
                            false;


                        deleteButton.innerHTML = `

                            <i class="fa-solid fa-trash"></i>

                            <span data-translate="common.delete">
                                Delete
                            </span>

                        `;


                        translateDynamicContent();

                        return;

                    }


                    //========================================
                    // SUCCESS
                    //========================================

                    alert(
                        "Job deleted successfully."
                    );


                    //========================================
                    // REMOVE CARD
                    //========================================

                    card.remove();


                    //========================================
                    // CHECK IF NO JOBS REMAIN
                    //========================================

                    const remainingCards =
                        jobsContainer.querySelectorAll(
                            ".job-card"
                        );


                    if (
                        remainingCards.length === 0
                    ) {

                        jobsContainer.innerHTML = `

                            <div class="no-jobs">

                                <h3 data-translate="myJobs.noJobs">
                                    No jobs yet
                                </h3>

                                <p data-translate="myJobs.noJobsText">
                                    You have not published any jobs yet.
                                </p>

                            </div>

                        `;


                        translateDynamicContent();

                    }

                }
            );


            //========================================
            // ADD CARD
            //========================================

            jobsContainer.appendChild(
                card
            );


            //========================================
            // TRANSLATE CARD
            //========================================

            translateDynamicContent();

        }
    );

}


//========================================
// START
//========================================

loadMyJobs();