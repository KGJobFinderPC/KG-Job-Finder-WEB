import { supabase } from "./supabase.js";


/* ==================================================
   ELEMENTS
================================================== */

const jobsTableBody =
    document.getElementById("jobsTableBody");

const applicationsList =
    document.getElementById("applicationsList");

const usersCount =
    document.getElementById("usersCount");

const jobsCount =
    document.getElementById("jobsCount");

const applicationsCount =
    document.getElementById("applicationsCount");


let jobs = [];

let applications = [];


/* ==================================================
   HELPERS
================================================== */

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function showMessage(message) {

    alert(message);

}

function makeCvUrl(cvData, cvName = "") {

    if (!cvData) {
        return null;
    }

    if (typeof cvData !== "string") {
        return null;
    }

    const value = cvData.trim();

    if (!value) {
        return null;
    }

    /* Existing normal URL */
    if (
        value.startsWith("https://") ||
        value.startsWith("http://")
    ) {
        return value;
    }

    let mimeType = "application/pdf";

    const extension = cvName
        .split(".")
        .pop()
        .toLowerCase();

    if (extension === "doc") {
        mimeType = "application/msword";
    }

    if (extension === "docx") {
        mimeType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    let base64 = value;

    /* Existing Data URL */
    if (value.startsWith("data:")) {

        const comma =
            value.indexOf(",");

        if (comma === -1) {
            return null;
        }

        const header =
            value.substring(
                0,
                comma
            );

        base64 =
            value.substring(
                comma + 1
            );

        const detectedMime =
            header.match(
                /^data:([^;,]+)/
            );

        if (detectedMime) {
            mimeType =
                detectedMime[1];
        }

    }

    base64 =
        base64.replace(/\s/g, "");

    try {

        const binary =
            atob(base64);

        const bytes =
            new Uint8Array(
                binary.length
            );

        for (
            let i = 0;
            i < binary.length;
            i++
        ) {

            bytes[i] =
                binary.charCodeAt(i);

        }

        const blob =
            new Blob(
                [bytes],
                {
                    type: mimeType
                }
            );

        return URL.createObjectURL(
            blob
        );

    } catch (error) {

        console.error(
            "CV conversion error:",
            error
        );

        return null;

    }

}

/* ==================================================
   MODAL BASE STYLES
================================================== */

function createOverlay(id) {

    const old =
        document.getElementById(id);

    if (old) {
        old.remove();
    }


    const overlay =
        document.createElement("div");


    overlay.id = id;


    overlay.style.position = "fixed";
    overlay.style.top = "0px";
    overlay.style.left = "0px";
    overlay.style.right = "auto";
    overlay.style.bottom = "auto";

    overlay.style.width =
        window.innerWidth + "px";

    overlay.style.height =
        window.innerHeight + "px";

    overlay.style.minWidth =
        window.innerWidth + "px";

    overlay.style.minHeight =
        window.innerHeight + "px";

    overlay.style.maxWidth = "none";
    overlay.style.maxHeight = "none";

    overlay.style.zIndex = "2147483647";

    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    overlay.style.padding = "20px";

    overlay.style.boxSizing =
        "border-box";

    overlay.style.background =
        "rgba(2, 6, 23, 0.82)";

    overlay.style.overflow =
        "auto";


    document.documentElement.appendChild(
        overlay
    );


    return overlay;

}


function closeOverlay(id) {

    document
        .getElementById(id)
        ?.remove();

}


/* ==================================================
   USER OVERVIEW
================================================== */

async function loadUsers() {

    try {

        const {
            data,
            error
        } = await supabase
            .from("profiles")
            .select(
                "id, full_name, email, city"
            )
            .order(
                "full_name",
                {
                    ascending: true
                }
            );


        if (error) {

            console.error(
                "Users loading error:",
                error
            );

            showMessage(
                "Unable to load users: " +
                error.message
            );

            return;
        }


        openUserOverview(
            data || []
        );

    } catch (error) {

        console.error(
            "Users function error:",
            error
        );

        showMessage(
            "Unable to load users."
        );

    }

}


function openUserOverview(users) {

    const overlay =
        createOverlay(
            "userOverviewOverlay"
        );


    const modal =
        document.createElement("div");


    modal.style.width =
        "min(920px, 100%)";

    modal.style.maxHeight =
        "calc(100% - 20px)";

    modal.style.overflow =
        "auto";

    modal.style.boxSizing =
        "border-box";

    modal.style.border =
        "1px solid rgba(255,255,255,.10)";

    modal.style.borderRadius =
        "22px";

    modal.style.background =
        "linear-gradient(145deg,#101827,#11182b 55%,#181442)";

    modal.style.boxShadow =
        "0 35px 90px rgba(0,0,0,.55)";

    modal.style.color =
        "#ffffff";


    modal.innerHTML = `

        <div style="
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
            gap:20px;
            padding:24px;
            border-bottom:1px solid rgba(255,255,255,.08);
        ">

            <div>

                <span style="
                    color:#ffd84d;
                    font-size:10px;
                    font-weight:700;
                    letter-spacing:2px;
                ">
                    KG JOB FINDER
                </span>

                <h2 style="
                    margin:6px 0 0;
                    color:#ffd84d;
                    font-size:26px;
                ">
                    User Overview
                </h2>

                <p style="
                    margin:5px 0 0;
                    color:#64748b;
                    font-size:12px;
                ">
                    Registered users
                </p>

            </div>


            <button
                id="closeUserOverviewButton"
                type="button"
                style="
                    width:40px;
                    height:40px;
                    border:1px solid rgba(255,255,255,.10);
                    border-radius:10px;
                   background:#b00020;
                   color:#ffffff;
                   border:1px solid #ef4444;
                    cursor:pointer;
                    font-size:18px;
                "
            >
                ×
            </button>

        </div>


        <div style="
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:12px;
            padding:20px 24px;
        ">

            <div style="
                padding:15px;
                border:1px solid rgba(255,255,255,.06);
                border-radius:12px;
                background:rgba(255,255,255,.025);
            ">

                <strong style="
                    display:block;
                    font-size:24px;
                ">
                    ${users.length}
                </strong>

                <span style="
                    color:#64748b;
                    font-size:10px;
                    text-transform:uppercase;
                ">
                    Total Users
                </span>

            </div>


            <div style="
                padding:15px;
                border:1px solid rgba(255,255,255,.06);
                border-radius:12px;
                background:rgba(255,255,255,.025);
            ">

                <strong style="
                    display:block;
                    font-size:24px;
                ">
                    ${
                        users.filter(
                            user => user.email
                        ).length
                    }
                </strong>

                <span style="
                    color:#64748b;
                    font-size:10px;
                    text-transform:uppercase;
                ">
                    With Email
                </span>

            </div>


            <div style="
                padding:15px;
                border:1px solid rgba(255,255,255,.06);
                border-radius:12px;
                background:rgba(255,255,255,.025);
            ">

                <strong style="
                    display:block;
                    font-size:24px;
                ">
                    ${
                        users.filter(
                            user => user.city
                        ).length
                    }
                </strong>

                <span style="
                    color:#64748b;
                    font-size:10px;
                    text-transform:uppercase;
                ">
                    With City
                </span>

            </div>

        </div>


        <div style="
            padding:0 24px 20px;
        ">

            ${
                users.length

                    ? users.map(
                        (user, index) => `

                            <div style="
                                display:flex;
                                align-items:center;
                                gap:14px;
                                padding:14px;
                                margin-bottom:10px;
                                border:1px solid rgba(255,255,255,.06);
                                border-radius:12px;
                                background:rgba(255,255,255,.025);
                            ">

                                <div style="
                                    width:44px;
                                    height:44px;
                                    flex-shrink:0;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    border-radius:11px;
                                    color:#ffd84d;
                                    background:rgba(255,216,77,.08);
                                    font-weight:700;
                                ">
                                    ${escapeHtml(
                                        (
                                            user.full_name ||
                                            "U"
                                        )
                                            .charAt(0)
                                            .toUpperCase()
                                    )}
                                </div>


                                <div style="
                                    min-width:0;
                                    flex:1;
                                ">

                                    <strong style="
                                        display:block;
                                        color:#f8fafc;
                                        font-size:14px;
                                    ">
                                        ${escapeHtml(
                                            user.full_name ||
                                            "Unnamed User"
                                        )}
                                    </strong>


                                    <span style="
                                        display:block;
                                        margin-top:4px;
                                        color:#94a3b8;
                                        font-size:11px;
                                    ">
                                        ${escapeHtml(
                                            user.email ||
                                            "No email"
                                        )}
                                    </span>


                                    <span style="
                                        display:block;
                                        margin-top:3px;
                                        color:#64748b;
                                        font-size:10px;
                                    ">
                                        ${escapeHtml(
                                            user.city ||
                                            "No city"
                                        )}
                                    </span>

                                </div>


                                <span style="
                                    color:#475569;
                                    font-size:10px;
                                ">
                                    #${index + 1}
                                </span>

                            </div>

                        `
                    ).join("")

                    : `

                        <div style="
                            padding:50px 20px;
                            text-align:center;
                            color:#64748b;
                        ">

                            No users found.

                        </div>

                    `
            }

        </div>


       

    `;


    overlay.appendChild(
        modal
    );


    document
        .getElementById(
            "closeUserOverviewButton"
        )
        ?.addEventListener(
            "click",
            () => {
                closeOverlay(
                    "userOverviewOverlay"
                );
            }
        );


    document
        .getElementById(
            "closeUserOverviewBottom"
        )
        ?.addEventListener(
            "click",
            () => {
                closeOverlay(
                    "userOverviewOverlay"
                );
            }
        );


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                closeOverlay(
                    "userOverviewOverlay"
                );

            }

        }
    );

}


/* ==================================================
   USERS COUNT
================================================== */

async function loadUsersCount() {

    try {

        const {
            count,
            error
        } = await supabase
            .from("profiles")
            .select(
                "id",
                {
                    count: "exact",
                    head: true
                }
            );


        if (error) {

            console.error(
                "Users count error:",
                error
            );

            if (usersCount) {
                usersCount.textContent =
                    "0";
            }

            return;
        }


        if (usersCount) {

            usersCount.textContent =
                count ?? 0;

        }

    } catch (error) {

        console.error(
            "Users count function error:",
            error
        );

        if (usersCount) {
            usersCount.textContent =
                "0";
        }

    }

}


/* ==================================================
   JOBS
================================================== */

async function loadJobs() {

    try {

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
                "Jobs loading error:",
                error
            );

            if (jobsCount) {
                jobsCount.textContent =
                    "0";
            }

            if (jobsTableBody) {

                jobsTableBody.innerHTML = `

                    <tr>

                        <td colspan="5">
                            Unable to load jobs.
                        </td>

                    </tr>

                `;

            }

            return;
        }


        jobs =
            data || [];


        if (jobsCount) {

            jobsCount.textContent =
                jobs.length;

        }


        renderJobs();

    } catch (error) {

        console.error(
            "Jobs function error:",
            error
        );

    }

}


function renderJobs() {

    if (!jobsTableBody) {
        return;
    }


    if (!jobs.length) {

        jobsTableBody.innerHTML = `

            <tr>

                <td colspan="5">
                    No jobs available.
                </td>

            </tr>

        `;

        return;
    }


    jobsTableBody.innerHTML =
        jobs.map(
            job => {

                const title =
                    job.title ||
                    job.job_title ||
                    "Untitled Job";


                return `

                    <tr>

                        <td>
                            ${escapeHtml(title)}
                        </td>

                        <td>
                            ${escapeHtml(
                                job.company ||
                                ""
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                job.city ||
                                ""
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                job.salary ||
                                ""
                            )}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="admin-delete-job"
                                data-job-id="${escapeHtml(
                                    job.id
                                )}"
                            >

                                <i class="fa-solid fa-trash"></i>

                                Delete

                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");


    document
        .querySelectorAll(
            ".admin-delete-job"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteJob(
                            button.dataset.jobId
                        );

                    }
                );

            }
        );

}


async function deleteJob(jobId) {

    if (
        !confirm(
            "Are you sure you want to delete this job?"
        )
    ) {

        return;

    }


    const {
        error
    } = await supabase
        .from("jobs")
        .delete()
        .eq(
            "id",
            jobId
        );


    if (error) {

        console.error(
            "Delete job error:",
            error
        );

        showMessage(
            "Unable to delete job: " +
            error.message
        );

        return;

    }


    await loadJobs();


    showMessage(
        "Job deleted successfully."
    );

}


/* ==================================================
   APPLICATIONS
================================================== */

async function loadApplications() {

    try {

        const {
            data,
            error
        } = await supabase
            .from("applications")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "Applications loading error:",
                error
            );

            if (applicationsCount) {
                applicationsCount.textContent =
                    "0";
            }

            if (applicationsList) {

                applicationsList.innerHTML = `

                    <div class="application-card">
                        Unable to load applications.
                    </div>

                `;

            }

            return;
        }


        applications =
            data || [];


        if (applicationsCount) {

            applicationsCount.textContent =
                applications.length;

        }


        renderApplications();

    } catch (error) {

        console.error(
            "Applications function error:",
            error
        );

    }

}


function renderApplications() {

    if (!applicationsList) {
        return;
    }


    if (!applications.length) {

        applicationsList.innerHTML = `

            <div class="application-card">
                No applications yet.
            </div>

        `;

        return;
    }


    applicationsList.innerHTML =
        applications
            .map(
                application => {

                    const title =
                        application.job_title ||
                        "Job Application";


                    const company =
                        application.company ||
                        "Not provided";


                    const name =
                        application.full_name ||
                        "Not provided";


                    const email =
                        application.email ||
                        "Not provided";


                    const city =
                        application.city ||
                        "Not provided";


                    const phone =
                        application.phone ||
                        "Not provided";


                    const salary =
                        application.salary ||
                        "Not provided";


                    const status =
                        application.status ||
                        "Applied";


                    const cvUrl =
                        makeCvUrl(
                            application.cv_data
                        );


                    const cvName =
                        application.cv_name ||
                        "View CV";


                    const created =
                        application.created_at
                            ? new Date(
                                application.created_at
                            ).toLocaleString()
                            : "";


                    return `

                        <div class="application-card">

                            <div
                                class="application-card-header">

                                <div>

                                    <h3>
                                        ${escapeHtml(title)}
                                    </h3>

                                    <p>
                                        ${escapeHtml(company)}
                                    </p>

                                </div>


                                <span
                                    class="application-status">

                                    ${escapeHtml(status)}

                                </span>

                            </div>


                            <div
                                class="application-details">

                                <div>

                                    <strong>
                                        Applicant
                                    </strong>

                                    <span>
                                        ${escapeHtml(name)}
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Email
                                    </strong>

                                    <span>
                                        ${escapeHtml(email)}
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Phone
                                    </strong>

                                    <span>
                                        ${escapeHtml(phone)}
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        City
                                    </strong>

                                    <span>
                                        ${escapeHtml(city)}
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Salary
                                    </strong>

                                    <span>
                                        ${escapeHtml(salary)}
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        CV
                                    </strong>

                                    <span>

                                        ${
                                            cvUrl

                                                ? `

                                                    <a
                                                        class="admin-cv-link"
                                                        href="${cvUrl}"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >

                                                        ${escapeHtml(
                                                            cvName
                                                        )}

                                                    </a>

                                                `

                                                : `

                                                    <span class="admin-no-cv">
                                                        No CV
                                                    </span>

                                                `
                                        }

                                    </span>

                                </div>

                            </div>


                            ${
                                application.cover_letter

                                    ? `

                                        <div class="cover-letter">

                                            <strong>
                                                Cover Letter
                                            </strong>

                                            <p>
                                                ${escapeHtml(
                                                    application.cover_letter
                                                )}
                                            </p>

                                        </div>

                                    `

                                    : ""
                            }


                            <small class="application-date">

                                ${escapeHtml(
                                    created
                                )}

                            </small>

                        </div>

                    `;

                }
            )
            .join("");

}


/* ==================================================
   APPLICATIONS OVERVIEW
================================================== */

function openApplicationsOverview() {

    const overlay =
        createOverlay(
            "applicationsOverviewOverlay"
        );


    const modal =
        document.createElement("div");


    modal.style.width =
        "min(1000px, 100%)";

    modal.style.maxHeight =
        "calc(100% - 20px)";

    modal.style.overflow =
        "auto";

    modal.style.boxSizing =
        "border-box";

    modal.style.border =
        "1px solid rgba(255,255,255,.10)";

    modal.style.borderRadius =
        "22px";

    modal.style.background =
        "linear-gradient(145deg,#101827,#11182b 55%,#181442)";

    modal.style.boxShadow =
        "0 35px 90px rgba(0,0,0,.55)";

    modal.style.color =
        "#ffffff";


    modal.innerHTML = `

        <div style="
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            gap:20px;
            padding:24px;
            border-bottom:1px solid rgba(255,255,255,.08);
        ">

            <div>

                <span style="
                    color:#ffd84d;
                    font-size:10px;
                    font-weight:700;
                    letter-spacing:2px;
                ">
                    KG JOB FINDER
                </span>

               <h2 style="
                   margin:6px 0 0;
                   color:#ffd84d;
                   font-size:26px;
               ">
                   Applications
               </h2>

                <p style="
                    margin:5px 0 0;
                    color:#64748b;
                    font-size:12px;
                ">
                    Candidate applications
                </p>

            </div>


            <button
                id="closeApplicationsButton"
                type="button"
                style="
                    width:40px;
                    height:40px;
                    border:1px solid rgba(255,255,255,.10);
                    border-radius:10px;
background:#b00020;
color:#ffffff;
border:1px solid #ef4444;
                    cursor:pointer;
                    font-size:18px;
                "
            >
                ×
            </button>

        </div>


        <div style="
            padding:18px 24px;
            border-bottom:1px solid rgba(255,255,255,.06);
        ">

            <strong style="
                display:block;
                font-size:28px;
            ">
                ${applications.length}
            </strong>

            <span style="
                color:#64748b;
                font-size:10px;
                text-transform:uppercase;
            ">
                Total Applications
            </span>

        </div>


        <div style="
            padding:20px 24px;
        ">

            ${
                applications.length

                    ? applications
                        .map(
                            (
                                application,
                                index
                            ) => `

                                <div style="
                                    display:flex;
                                    align-items:center;
                                    gap:14px;
                                    padding:15px;
                                    margin-bottom:10px;
                                    border:1px solid rgba(255,255,255,.06);
                                    border-radius:12px;
                                    background:rgba(255,255,255,.025);
                                ">

                                    <div style="
                                        width:42px;
                                        height:42px;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        flex-shrink:0;
                                        border-radius:10px;
                                        background:rgba(255,216,77,.08);
                                        color:#ffd84d;
                                        font-size:11px;
                                        font-weight:700;
                                    ">
                                        #${index + 1}
                                    </div>


                                    <div style="
                                        min-width:0;
                                        flex:1;
                                    ">

                                        <strong style="
                                            display:block;
                                            color:#ffd84d;
                                            font-size:14px;
                                        ">
                                            ${escapeHtml(
                                                application.job_title ||
                                                "Job Application"
                                            )}
                                        </strong>


                                        <span style="
                                            display:block;
                                            margin-top:4px;
                                            color:#cbd5e1;
                                            font-size:11px;
                                        ">
                                            ${escapeHtml(
                                                application.full_name ||
                                                "Not provided"
                                            )}
                                        </span>


                                        <span style="
                                            display:block;
                                            margin-top:3px;
                                            color:#64748b;
                                            font-size:10px;
                                        ">
                                            ${escapeHtml(
                                                application.email ||
                                                "Not provided"
                                            )}
                                        </span>

                                    </div>


                                    <span style="
                                        padding:6px 10px;
                                        border-radius:20px;
                                        background:${
                                            String(application.status || "Applied").toLowerCase() === "accepted"
                                                ? "rgba(34,197,94,.12)"
                                                : String(application.status || "Applied").toLowerCase() === "rejected"
                                                    ? "rgba(239,68,68,.12)"
                                                    : "rgba(245,158,11,.12)"
                                        };
                                        color:${
                                            String(application.status || "Applied").toLowerCase() === "accepted"
                                                ? "#22c55e"
                                                : String(application.status || "Applied").toLowerCase() === "rejected"
                                                    ? "#ef4444"
                                                    : "#f59e0b"
                                        };
                                        font-size:10px;
                                        font-weight:500;
                                    ">
                                        ${escapeHtml(
                                            application.status ||
                                            "Applied"
                                        )}
                                    </span>


                                    <button
                                        type="button"
                                        class="admin-view-application"
                                        data-index="${index}"
                                        style="
                                            padding:8px 11px;
                                            border:1px solid rgba(255,255,255,.10);
                                            border-radius:8px;
                                            background:rgba(255,255,255,.04);
                                            color:#cbd5e1;
                                            cursor:pointer;
                                        "
                                    >
                                        View
                                    </button>


                                    <button
                                        type="button"
                                        class="admin-delete-application"
                                        data-index="${index}"
                                        style="
                                            padding:8px 11px;
                                            border:1px solid rgba(239,68,68,.20);
                                            border-radius:8px;
                                            background:rgba(239,68,68,.06);
                                            color:#fca5a5;
                                            cursor:pointer;
                                        "
                                    >
                                        Delete
                                    </button>

                                </div>

                            `
                        )
                        .join("")

                    : `

                        <div style="
                            padding:50px 20px;
                            text-align:center;
                            color:#64748b;
                        ">

                            No applications found.

                        </div>

                    `
            }

        </div>


       

    `;


    overlay.appendChild(
        modal
    );


    document
        .getElementById(
            "closeApplicationsButton"
        )
        ?.addEventListener(
            "click",
            () => {

                closeOverlay(
                    "applicationsOverviewOverlay"
                );

            }
        );





    overlay
        .querySelectorAll(
            ".admin-view-application"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const application =
                            applications[
                                Number(
                                    button.dataset.index
                                )
                            ];

                        openApplicationDetails(
                            application
                        );

                    }
                );

            }
        );


    overlay
        .querySelectorAll(
            ".admin-delete-application"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const application =
                            applications[
                                Number(
                                    button.dataset.index
                                )
                            ];

                        await deleteApplication(
                            application
                        );

                    }
                );

            }
        );


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                closeOverlay(
                    "applicationsOverviewOverlay"
                );

            }

        }
    );

}


/* ==================================================
   APPLICATION DETAILS
================================================== */

function openApplicationDetails(
    application
) {

    if (!application) {

        showMessage(
            "Application not found."
        );

        return;
    }


    const overlay =
        createOverlay(
            "applicationDetailsOverlay"
        );


    const modal =
        document.createElement("div");


    modal.style.width =
        "min(760px, 100%)";

    modal.style.maxHeight =
        "calc(100% - 20px)";

    modal.style.overflow =
        "auto";

    modal.style.boxSizing =
        "border-box";

    modal.style.borderRadius =
        "20px";

    modal.style.background =
        "linear-gradient(145deg,#101827,#11182b 55%,#181442)";

    modal.style.border =
        "1px solid rgba(255,255,255,.10)";

    modal.style.color =
        "#ffffff";


    modal.innerHTML = `

        <div style="
            display:flex;
            justify-content:space-between;
            gap:20px;
            padding:24px;
            border-bottom:1px solid rgba(255,255,255,.08);
        ">

            <div>

                <span style="
                    color:#ffd84d;
                    font-size:10px;
                    font-weight:700;
                    letter-spacing:2px;
                ">
                    APPLICATION DETAILS
                </span>

                <h2 style="
                    margin-top:5px;
                    font-size:24px;
                ">
                    ${escapeHtml(
                        application.job_title ||
                        "Job Application"
                    )}
                </h2>

            </div>


            <button
                type="button"
                id="closeApplicationDetails"
                style="
                    width:40px;
                    height:40px;
                    border:1px solid rgba(255,255,255,.10);
                    border-radius:10px;
                    background:rgba(255,255,255,.04);
                    color:#cbd5e1;
                    cursor:pointer;
                    font-size:18px;
                "
            >
                ×
            </button>

        </div>


        <div style="
            display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:12px;
            padding:24px;
        ">

            ${detailBox(
                "Applicant",
                application.full_name
            )}

            ${detailBox(
                "Email",
                application.email
            )}

            ${detailBox(
                "Phone",
                application.phone
            )}

            ${detailBox(
                "City",
                application.city
            )}

            ${detailBox(
                "Company",
                application.company
            )}

            ${detailBox(
                "Salary",
                application.salary
            )}

            ${detailBox(
                "Status",
                application.status ||
                "Applied"
            )}

            ${detailBox(
                "Submitted",
                application.created_at
                    ? new Date(
                        application.created_at
                    ).toLocaleString()
                    : ""
            )}

            <div style="
                grid-column:1 / -1;
                padding:14px;
                border:1px solid rgba(255,255,255,.06);
                border-radius:11px;
                background:rgba(255,255,255,.025);
            ">

                <strong style="
                    display:block;
                    color:#64748b;
                    font-size:10px;
                    text-transform:uppercase;
                    margin-bottom:10px;
                ">
                    CV
                </strong>

                ${
                    application.cv_data
                        ? `
                            <button
                                type="button"
                                id="openApplicationCvButton"
                                style="
                                    width:100%;
                                    padding:12px 16px;
                                    border:0;
                                    border-radius:10px;
                                    background:#ffd84d;
                                    color:#111827;
                                    font-family:inherit;
                                    font-weight:700;
                                    cursor:pointer;
                                "
                            >
                                <i class="fa-solid fa-file-pdf"></i>
                                Open CV
                            </button>
                        `
                        : `
                            <span style="
                                color:#64748b;
                                font-size:12px;
                            ">
                                No CV available
                            </span>
                        `
                }

            </div>

        </div>


        <div style="
            margin:0 24px 24px;
            padding:16px;
            border:1px solid rgba(255,255,255,.06);
            border-radius:12px;
            background:rgba(255,255,255,.025);
        ">

            <strong style="
                color:#64748b;
                font-size:10px;
                text-transform:uppercase;
            ">
                Cover Letter
            </strong>

            <p style="
                margin-top:8px;
                color:#cbd5e1;
                font-size:12px;
                line-height:1.7;
                white-space:pre-wrap;
            ">
                ${
                    application.cover_letter
                        ? escapeHtml(
                            application.cover_letter
                        )
                        : "No cover letter provided."
                }
            </p>

        </div>


        <div style="
            display:flex;
            justify-content:flex-end;
            padding:16px 24px;
            border-top:1px solid rgba(255,255,255,.07);
        ">

            <button
                type="button"
                id="closeApplicationDetailsBottom"
                style="
                    padding:9px 16px;
                    border:0;
                    border-radius:9px;
                    background:#ffd84d;
                    color:#111827;
                    font-family:inherit;
                    font-weight:700;
                    cursor:pointer;
                "
            >
                Close
            </button>

        </div>

    `;


    overlay.appendChild(
        modal
    );


    const close =
        () => {

            closeOverlay(
                "applicationDetailsOverlay"
            );

        };


    document
        .getElementById(
            "closeApplicationDetails"
        )
        ?.addEventListener(
            "click",
            close
        );


    document
        .getElementById(
            "closeApplicationDetailsBottom"
        )
        ?.addEventListener(
            "click",
            close
        );
const cvButton =
    modal.querySelector(
        "#openApplicationCvButton"
    );


if (cvButton) {

    cvButton.addEventListener(
        "click",
        function () {

            openApplicationCv(
                application
            );

        }
    );

}
    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                close();

            }

        }
    );

}


function detailBox(
    label,
    value
) {

    return `

        <div style="
            padding:14px;
            border:1px solid rgba(255,255,255,.06);
            border-radius:11px;
            background:rgba(255,255,255,.025);
        ">

            <strong style="
                display:block;
                color:#64748b;
                font-size:10px;
                text-transform:uppercase;
            ">
                ${escapeHtml(label)}
            </strong>

            <span style="
                display:block;
                margin-top:5px;
                color:#e2e8f0;
                font-size:12px;
            ">
                ${escapeHtml(value)}
            </span>

        </div>

    `;

}


/* ==================================================
   DELETE APPLICATION
================================================== */

async function deleteApplication(
    application
) {

    if (
        !application ||
        !application.id
    ) {

        return;

    }


    if (
        !confirm(
            "Are you sure you want to delete this application?"
        )
    ) {

        return;

    }


    const {
        error
    } = await supabase
        .from("applications")
        .delete()
        .eq(
            "id",
            application.id
        );


    if (error) {

        console.error(
            "Delete application error:",
            error
        );

        showMessage(
            "Unable to delete application: " +
            error.message
        );

        return;

    }


    applications =
        applications.filter(
            item =>
                item.id !==
                application.id
        );


    if (applicationsCount) {

        applicationsCount.textContent =
            applications.length;

    }


    renderApplications();

    closeOverlay(
        "applicationsOverviewOverlay"
    );

}

/* ==================================================
   OPEN CV
================================================== */

async function openApplicationCv(
    application
) {

    if (
        !application ||
        !application.cv_path
    ) {

        showMessage(
            "This application does not have a Storage CV."
        );

        return;
    }


    try {

        showMessage(
            "Preparing CV..."
        );


        const {
            data,
            error
        } =
            await supabase
                .storage
                .from("cv-files")
                .createSignedUrl(
                    application.cv_path,
                    60 * 60
                );


        if (
            error ||
            !data ||
            !data.signedUrl
        ) {

            console.error(
                "CV signed URL error:",
                error
            );


            showMessage(
                "Unable to open the CV: " +
                (
                    error?.message ||
                    "Unable to create a secure CV link."
                )
            );


            return;
        }


        const signedUrl =
            data.signedUrl;


        console.log(
            "CV signed URL created successfully."
        );


        window.location.href =
            signedUrl;


    } catch (error) {

        console.error(
            "CV opening error:",
            error
        );


        showMessage(
            "Unable to open the CV: " +
            (
                error?.message ||
                "Unknown error."
            )
        );

    }

}
/* ==================================================
   CONTROL CENTER
================================================== */

function setupControlCenterButtons() {

    const controlItems =
        document.querySelectorAll(
            ".control-item"
        );


    controlItems.forEach(
        item => {

            const title =
                item.querySelector(
                    "strong"
                );


            if (!title) {
                return;
            }


            const name =
                title.textContent.trim();


            item.style.cursor =
                "pointer";


            item.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    if (
                        name ===
                        "Job Management"
                    ) {

                        document
                            .querySelector(
                                ".jobs-panel"
                            )
                            ?.scrollIntoView({
                                behavior:
                                    "smooth",
                                block:
                                    "start"
                            });

                        return;

                    }


                    if (
                        name ===
                        "User Overview"
                    ) {

                        loadUsers();

                        return;

                    }


                    if (
                        name ===
                        "Applications"
                    ) {

                        openApplicationsOverview();

                        return;

                    }


                    if (
                        name ===
                        "Candidate CV"
                    ) {

                        document
                            .querySelector(
                                ".applications-panel"
                            )
                            ?.scrollIntoView({
                                behavior:
                                    "smooth",
                                block:
                                    "start"
                            });

                    }

                }
            );

        }
    );

}


/* ==================================================
   INIT
================================================== */

async function initAdmin() {

    setupControlCenterButtons();


    await Promise.all([
        loadUsersCount(),
        loadJobs(),
        loadApplications()
    ]);

}


initAdmin();