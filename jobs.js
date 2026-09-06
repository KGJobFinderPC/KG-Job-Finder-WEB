import { supabase } from "./supabase.js";

//========================================
// KG JOB FINDER
// JOBS PAGE
//========================================

//========================================
// ELEMENTS
//========================================

const searchInput =
    document.getElementById("searchJob");

const locationInput =
    document.getElementById("searchLocation");

const categorySelect =
    document.getElementById("jobCategory");

const searchButton =
    document.getElementById("searchButton");

const jobsContainer =
    document.getElementById("jobsContainer");

let jobs = [];


//========================================
// LOAD JOBS
//========================================

async function loadJobs() {

    if (!jobsContainer) {

        console.error(
            "jobsContainer was not found."
        );

        return;

    }


    const {
        data,
        error
    } = await supabase
        .from("jobs")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Unable to load jobs:",
            error
        );

        jobsContainer.innerHTML = `

            <div class="no-jobs">

                <h3>
                    Unable to load jobs
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

        return;

    }


    jobs = data || [];

    renderJobs(jobs);

}


//========================================
// RENDER JOBS
//========================================

function renderJobs(jobList) {

    jobsContainer.innerHTML = "";


    if (
        !jobList ||
        jobList.length === 0
    ) {

        jobsContainer.innerHTML = `

            <div class="no-jobs">

                <h3>
                    No jobs found
                </h3>

                <p>
                    There are currently no jobs available.
                </p>

            </div>

        `;

        return;

    }


    jobList.forEach(
        job => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "job-card";


            card.dataset.jobId =
                job.id;


            card.innerHTML = `

                <h3>
                    ${job.title || "Untitled Job"}
                </h3>

                <h4>
                    ${job.company || "Unknown Company"}
                </h4>

                <p>
                    <i class="fa-solid fa-location-dot"></i>
                    ${job.city || "Not specified"}
                </p>

                <p>
                    <i class="fa-solid fa-money-bill-wave"></i>
                    ${job.salary || "Not specified"}
                </p>

                <p>
                    ${job.description || "No description available."}
                </p>

                <button
                   <button
                       class="apply-btn"
                       type="button"
                       data-translate="common.apply">

                       Apply Now

                   </button>

            `;


            //========================================
            // APPLY BUTTON
            //========================================

            const applyButton =
                card.querySelector(
                    ".apply-btn"
                );


            applyButton.addEventListener(
                "click",
                function () {

                    applyToJob(job);

                }
            );


            jobsContainer.appendChild(
                card
            );

        }
    );

}


//========================================
// APPLY TO JOB
//========================================

function applyToJob(job) {

    if (
        !job ||
        !job.id
    ) {

        alert(
            "Unable to find this job."
        );

        return;

    }


    //========================================
    // SAVE SELECTED JOB
    //========================================

    localStorage.setItem(
        "selectedjobtitle",
        job.title || ""
    );


    localStorage.setItem(
        "selectedjobcompany",
        job.company || ""
    );


    localStorage.setItem(
        "selectedjobsalary",
        job.salary || ""
    );


    localStorage.setItem(
        "selectedjobcity",
        job.city || ""
    );


    localStorage.setItem(
        "selectedjobid",
        job.id
    );


    //========================================
    // OPEN APPLICATION PAGE
    //========================================

    window.location.replace(
        "apply.html"
    );

}


//========================================
// SEARCH JOBS
//========================================

function filterJobs() {

    const jobText =
        searchInput.value
            .toLowerCase()
            .trim();


    const locationText =
        locationInput.value
            .toLowerCase()
            .trim();


    const categoryText =
        categorySelect.value
            .toLowerCase();


    const filteredJobs =
        jobs.filter(
            job => {

                const title =
                    (
                        job.title ||
                        ""
                    )
                    .toLowerCase();


                const company =
                    (
                        job.company ||
                        ""
                    )
                    .toLowerCase();


                const city =
                    (
                        job.city ||
                        ""
                    )
                    .toLowerCase();


                const description =
                    (
                        job.description ||
                        ""
                    )
                    .toLowerCase();


                const category =
                    (
                        job.category ||
                        ""
                    )
                    .toLowerCase();


                const content =
                    title +
                    " " +
                    company +
                    " " +
                    city +
                    " " +
                    description;


                const matchJob =
                    content.includes(
                        jobText
                    );


                const matchLocation =
                    locationText === "" ||
                    city.includes(
                        locationText
                    );


                const matchCategory =
                    categoryText === "" ||
                    category.includes(
                        categoryText
                    ) ||
                    content.includes(
                        categoryText
                    );


                return (
                    matchJob &&
                    matchLocation &&
                    matchCategory
                );

            }
        );


    renderJobs(
        filteredJobs
    );

}


//========================================
// SEARCH EVENTS
//========================================

if (searchButton) {

    searchButton.addEventListener(
        "click",
        filterJobs
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        filterJobs
    );

}


if (locationInput) {

    locationInput.addEventListener(
        "keyup",
        filterJobs
    );

}


if (categorySelect) {

    categorySelect.addEventListener(
        "change",
        filterJobs
    );

}


//========================================
// START
//========================================

loadJobs();


//========================================
// DASHBOARD NAVIGATION
//========================================

const dashboardButton =
    document.getElementById(
        "dashboardButton"
    );


if (dashboardButton) {

    dashboardButton.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();


            const {
                data,
                error
            } = await supabase.auth.getUser();


            if (
                error ||
                !data.user
            ) {

                window.location.replace(
                    "login.html"
                );

                return;

            }


            const user =
                data.user;


            const accountType =
                user.user_metadata?.account_type;


            //========================================
            // ADMIN
            //========================================

            if (
                accountType === "admin" ||
                user.email?.toLowerCase() ===
                    "kgjobfinder@gmail.com"
            ) {

                window.location.replace(
                    "admin.html"
                );

                return;

            }


            //========================================
            // CANDIDATE
            //========================================

            if (
                accountType === "candidate"
            ) {

                window.location.replace(
                    "candidate-dashboard.html"
                );

                return;

            }


            //========================================
            // EMPLOYER
            //========================================

            if (
                accountType === "employer"
            ) {

                window.location.replace(
                    "employer-dashboard.html"
                );

                return;

            }


            window.location.replace(
                "login.html"
            );

        }
    );

}