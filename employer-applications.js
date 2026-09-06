import { supabase } from "./supabase.js";

//========================================
// KG JOB FINDER
// EMPLOYER APPLICATIONS
//========================================

//========================================
// ELEMENTS
//========================================

const applicationsContainer =
    document.getElementById(
        "employerApplicationsContainer"
    );


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

    if (accountType !== "employer") {

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
// LOAD EMPLOYER APPLICATIONS
//========================================

async function loadEmployerApplications() {

    if (!applicationsContainer) {

        console.error(
            "employerApplicationsContainer was not found."
        );

        return;

    }

    const user =
        await checkEmployerAccess();

    if (!user) {

        return;

    }


    //========================================
    // LOAD EMPLOYER JOBS
    //========================================

    const {
        data: employerJobs,
        error: jobsError
    } = await supabase
        .from("jobs")
        .select("id")
        .eq("user_id", user.id);


    //========================================
    // HANDLE JOB ERROR
    //========================================

    if (jobsError) {

        console.error(
            "Unable to load employer jobs:",
            jobsError
        );

        showError(
            jobsError.message
        );

        return;

    }


    //========================================
    // NO JOBS
    //========================================

    if (
        !employerJobs ||
        employerJobs.length === 0
    ) {

        showNoApplications(
            "You have not published any jobs yet."
        );

        return;

    }


    //========================================
    // GET JOB IDS
    //========================================

    const jobIds =
        employerJobs.map(
            job => job.id
        );


    //========================================
    // LOAD APPLICATIONS
    //========================================

    const {
        data: applications,
        error: applicationsError
    } = await supabase
        .from("applications")
        .select("*")
        .in("job_id", jobIds);


    //========================================
    // HANDLE APPLICATION ERROR
    //========================================

    if (applicationsError) {

        console.error(
            "Unable to load applications:",
            applicationsError
        );

        showError(
            applicationsError.message
        );

        return;

    }


    //========================================
    // DISPLAY APPLICATIONS
    //========================================

    renderApplications(
        applications || []
    );

}


//========================================
// UPDATE APPLICATION STATUS
//========================================

async function updateApplicationStatus(
    applicationId,
    newStatus,
    card,
    button
) {

    if (!applicationId) {

        alert(
            "Unable to find this application."
        );

        return false;

    }


    //========================================
    // CHECK EMPLOYER
    //========================================

    const user =
        await checkEmployerAccess();

    if (!user) {

        return false;

    }


    //========================================
    // CHECK EMPLOYER JOBS
    //========================================

    const {
        data: employerJobs,
        error: jobsError
    } = await supabase
        .from("jobs")
        .select("id")
        .eq("user_id", user.id);


    if (jobsError) {

        console.error(
            "Unable to verify employer jobs:",
            jobsError
        );

        alert(
            "Unable to verify your jobs: " +
            jobsError.message
        );

        return false;

    }


    const jobIds =
        (employerJobs || []).map(
            job => job.id
        );


    if (jobIds.length === 0) {

        alert(
            "You do not have any jobs."
        );

        return false;

    }


    //========================================
    // DISABLE BUTTON
    //========================================

    if (button) {

        button.disabled = true;

        button.style.pointerEvents =
            "none";

    }


    //========================================
    // UPDATE APPLICATION
    //========================================

    const {
        data: updatedApplication,
        error
    } = await supabase
        .from("applications")
        .update({
            status: newStatus
        })
        .eq("id", applicationId)
        .in("job_id", jobIds)
        .select()
        .maybeSingle();


    //========================================
    // HANDLE ERROR
    //========================================

    if (error) {

        console.error(
            "Unable to update application:",
            error
        );

        alert(
            "Unable to update application: " +
            error.message
        );

        if (button) {

            button.disabled = false;

            button.style.pointerEvents =
                "auto";

        }

        return false;

    }


    //========================================
    // CHECK RESULT
    //========================================

    if (!updatedApplication) {

        alert(
            "The application could not be updated."
        );

        if (button) {

            button.disabled = false;

            button.style.pointerEvents =
                "auto";

        }

        return false;

    }


    //========================================
    // UPDATE STATUS ON CARD
    //========================================

    const statusElement =
        card.querySelector(
            ".application-status"
        );

    if (statusElement) {

        statusElement.textContent =
            newStatus;

    }


    //========================================
    // UPDATE BUTTONS
    //========================================

    const acceptButton =
        card.querySelector(
            ".accept-btn"
        );

    const rejectButton =
        card.querySelector(
            ".reject-btn"
        );


    if (newStatus === "Accepted") {

        if (acceptButton) {

            acceptButton.disabled =
                true;

            acceptButton.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Accepted
            `;

        }

        if (rejectButton) {

            rejectButton.disabled =
                false;

            rejectButton.style.pointerEvents =
                "auto";

        }

    }


    if (newStatus === "Rejected") {

        if (rejectButton) {

            rejectButton.disabled =
                true;

            rejectButton.innerHTML = `
                <i class="fa-solid fa-xmark"></i>
                Rejected
            `;

        }

        if (acceptButton) {

            acceptButton.disabled =
                false;

            acceptButton.style.pointerEvents =
                "auto";

        }

    }


    //========================================
    // SUCCESS
    //========================================

    alert(
        "Application status updated to " +
        newStatus +
        "."
    );

    return true;

}


//========================================
// VIEW CANDIDATE
//========================================

function viewCandidate(
    application
) {

    if (!application) {

        alert(
            "Application data is not available."
        );

        return;

    }
//========================================
// VIEW CV
//========================================

function viewCV(application) {

    if (!application) {

        alert(
            "Application data is not available."
        );

        return;
    }

    const cvData =
        application.cv_data;

    if (!cvData) {

        alert(
            "This candidate has not uploaded a CV."
        );

        return;
    }

    const cvWindow =
        window.open(
            "",
            "_blank"
        );

    if (!cvWindow) {

        alert(
            "Unable to open the CV. Please allow pop-ups for this site."
        );

        return;
    }

    cvWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                ${application.cv_name || "Candidate CV"}
            </title>

            <style>

                html,
                body {

                    margin: 0;
                    padding: 0;

                    width: 100%;
                    height: 100%;

                    overflow: hidden;

                    background: #111111;
                }

                iframe {

                    width: 100%;
                    height: 100%;

                    border: none;
                }

            </style>

        </head>

        <body>

            <iframe
                src="${cvData}">
            </iframe>

        </body>

        </html>

    `);

    cvWindow.document.close();

}

    //========================================
    // CANDIDATE DATA
    //========================================

    const fullName =
        application.full_name ||
        "Not provided";

    const email =
        application.email ||
        "Not provided";

    const phone =
        application.phone ||
        "Not provided";

    const city =
        application.city ||
        "Not provided";

    const cvName =
        application.cv_name ||
        "No CV uploaded";

    const coverLetter =
        application.cover_leter ||
        application.cover_letter ||
        "No cover letter provided";

    const jobTitle =
        application.job_title ||
        "Unknown Job";

    const company =
        application.company ||
        "Unknown Company";

    const status =
        application.status ||
        "Pending";


    //========================================
    // DISPLAY CANDIDATE
    //========================================

    alert(

        "Candidate Profile\n\n" +

        "Full Name:\n" +
        fullName +

        "\n\nEmail:\n" +
        email +

        "\n\nPhone:\n" +
        phone +

        "\n\nCity:\n" +
        city +

        "\n\nCV:\n" +
        cvName +

        "\n\nCover Letter:\n" +
        coverLetter +

        "\n\nJob:\n" +
        jobTitle +

        "\n\nCompany:\n" +
        company +

        "\n\nStatus:\n" +
        status

    );

}


//========================================
// RENDER APPLICATIONS
//========================================

function renderApplications(
    applications
) {

    applicationsContainer.innerHTML = "";


    //========================================
    // NO APPLICATIONS
    //========================================

    if (
        !applications ||
        applications.length === 0
    ) {

        showNoApplications(
            "No candidates have applied to your jobs yet."
        );

        return;

    }


    //========================================
    // CREATE APPLICATION CARDS
    //========================================

    applications.forEach(
        application => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "application-card";


            //========================================
            // APPLICATION DATA
            //========================================

            const applicationId =
                application.id;

            const jobTitle =
                application.job_title ||
                "Unknown Job";

            const company =
                application.company ||
                "Unknown Company";

            const city =
                application.city ||
                "Not specified";

            const salary =
                application.salary ||
                "Not specified";

            const status =
                application.status ||
                "Pending";

            const candidateId =
                application.user_id ||
                "";

            const fullName =
                application.full_name ||
                "Not provided";

            const email =
                application.email ||
                "Not provided";

            const phone =
                application.phone ||
                "Not provided";


            //========================================
            // CARD
            //========================================

            card.innerHTML = `

                <h3>
                    ${jobTitle}
                </h3>

                <h4>
                    ${company}
                </h4>

                <p>
                    <i class="fa-solid fa-location-dot"></i>
                    ${city}
                </p>

                <p>
                    <i class="fa-solid fa-money-bill-wave"></i>
                    ${salary}
                </p>

                <div class="candidate-info">

                    <strong>
                        Candidate
                    </strong>

                    <br>

                    <span>
                        Name: ${fullName}
                    </span>

                    <br>

                    <span>
                        Email: ${email}
                    </span>

                    <br>

                    <span>
                        Phone: ${phone}
                    </span>

                    <br>

                    <span>
                        City: ${city}
                    </span>

                    <br>

                    <span>
                        User ID: ${candidateId || "Not available"}
                    </span>

                </div>

                <span
                    class="application-status">

                    ${status}

                </span>

                <div class="application-actions">

                   <button
                       class="accept-btn"
                       type="button"
                       data-action="accept"
                       data-application-id="${applicationId}">

                       <i class="fa-solid fa-check"></i>

                       <span data-translate="common.accept">
                           Accept
                       </span>

                   </button>

                   <button
                       class="reject-btn"
                       type="button"
                       data-action="reject"
                       data-application-id="${applicationId}">

                       <i class="fa-solid fa-xmark"></i>

                       <span data-translate="common.reject">
                           Reject
                       </span>

                   </button>

                   <button
                       class="view-candidate-btn"
                       type="button"
                       data-action="view"
                       data-application-id="${applicationId}">

                       <i class="fa-solid fa-user"></i>

                       <span data-translate="common.view">
                           View
                       </span>

                   </button>
<button
    class="view-cv-btn"
    type="button"
    data-action="view-cv"
    data-application-id="${applicationId}">

    <i class="fa-solid fa-file-pdf"></i>

    <span>
        View CV
    </span>

</button>
                </div>

            `;


            applicationsContainer.appendChild(
                card
            );

        }
    );

}


//========================================
// BUTTON HANDLER
//========================================

if (applicationsContainer) {

    applicationsContainer.addEventListener(
        "click",
        async function(event) {

            const button =
                event.target.closest(
                    "button"
                );


            if (!button) {

                return;

            }


            //========================================
            // PREVENT DEFAULT
            //========================================

            event.preventDefault();

            event.stopPropagation();


            const card =
                button.closest(
                    ".application-card"
                );


            if (!card) {

                return;

            }


            const action =
                button.dataset.action;

            const applicationId =
                button.dataset.applicationId;
//========================================
// VIEW CV
//========================================

if (
    action === "view-cv"
) {

    const {
        data: application,
        error
    } = await supabase
        .from("applications")
        .select("cv_data, cv_name")
        .eq(
            "id",
            applicationId
        )
        .maybeSingle();


    if (error) {

        console.error(
            "Unable to load CV:",
            error
        );

        alert(
            "Unable to load CV: " +
            error.message
        );

        return;
    }


    if (
        !application ||
        !application.cv_data
    ) {

        alert(
            "This candidate has not uploaded a CV."
        );

        return;
    }


    //========================================
    // ANDROID APP
    //========================================

    if (
        window.AndroidBridge &&
        typeof window.AndroidBridge.openPdf === "function"
    ) {

        window.AndroidBridge.openPdf(
            application.cv_data
        );

        return;
    }


    //========================================
    // PC / NORMAL BROWSER
    //========================================

    const cvWindow =
        window.open(
            "",
            "_blank"
        );


    if (!cvWindow) {

        alert(
            "Please allow pop-ups to view the CV."
        );

        return;
    }


    cvWindow.document.write(`

        <html>

        <head>

            <title>
                ${application.cv_name || "Candidate CV"}
            </title>

        </head>

        <body style="margin:0;">

            <iframe
                src="${application.cv_data}"
                style="
                    width:100%;
                    height:100vh;
                    border:none;
                ">
            </iframe>

        </body>

        </html>

    `);


    cvWindow.document.close();

    return;

}
            //========================================
            // ACCEPT
            //========================================

            if (
                action === "accept"
            ) {

                await updateApplicationStatus(
                    applicationId,
                    "Accepted",
                    card,
                    button
                );

                return;

            }


            //========================================
            // REJECT
            //========================================

            if (
                action === "reject"
            ) {

                await updateApplicationStatus(
                    applicationId,
                    "Rejected",
                    card,
                    button
                );

                return;

            }


            //========================================
            // VIEW
            //========================================

            if (
                action === "view"
            ) {

                // Find the original application
                // using its ID.

                const {
                    data: application,
                    error
                } = await supabase
                    .from("applications")
                    .select("*")
                    .eq(
                        "id",
                        applicationId
                    )
                    .maybeSingle();


                //========================================
                // HANDLE ERROR
                //========================================

                if (error) {

                    console.error(
                        "Unable to load application:",
                        error
                    );

                    alert(
                        "Unable to load candidate details: " +
                        error.message
                    );

                    return;

                }


                //========================================
                // CHECK APPLICATION
                //========================================

                if (!application) {

                    alert(
                        "Application was not found."
                    );

                    return;

                }


                //========================================
                // SHOW CANDIDATE
                //========================================

                viewCandidate(
                    application
                );

                return;

            }

        }
    );

}


//========================================
// NO APPLICATIONS MESSAGE
//========================================

function showNoApplications(
    message
) {

    applicationsContainer.innerHTML = `

        <div class="no-applications">

            <h3>
                No Applications
            </h3>

            <p>
                ${message}
            </p>

        </div>

    `;

}


//========================================
// ERROR MESSAGE
//========================================

function showError(
    message
) {

    applicationsContainer.innerHTML = `

        <div class="no-applications">

            <h3>
                Unable to load applications
            </h3>

            <p>
                ${message}
            </p>

        </div>

    `;

}


//========================================
// START
//========================================

loadEmployerApplications();