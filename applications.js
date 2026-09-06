import { supabase } from "./supabase.js";

//========================================
// KG JOB FINDER
// MY APPLICATIONS
//========================================

//========================================
// ELEMENTS
//========================================

const applicationsContainer =
    document.getElementById(
        "applicationsContainer"
    );


//========================================
// GET CURRENT USER
//========================================

async function getCurrentUser() {

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

        return null;

    }


    return data.user;

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
// LOAD APPLICATIONS
//========================================

async function loadApplications() {

    if (!applicationsContainer) {

        console.error(
            "Applications container was not found."
        );

        return;

    }


    applicationsContainer.innerHTML = `

        <div class="loading-message">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>
                Loading your applications...
            </p>

        </div>

    `;


    const user =
        await getCurrentUser();


    if (!user) {

        return;

    }


    const {
        data: applications,
        error
    } = await supabase
        .from("applications")
        .select("*")
        .eq(
            "user_id",
            user.id
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Unable to load applications:",
            error
        );


        applicationsContainer.innerHTML = `

            <div class="no-applications">

                <h3>
                    Unable to load applications
                </h3>

                <p>
                    ${escapeHtml(error.message)}
                </p>

            </div>

        `;

        return;

    }


    renderApplications(
        applications || []
    );

}


//========================================
// RENDER APPLICATIONS
//========================================

function renderApplications(
    applications
) {

    applicationsContainer.innerHTML = "";


    if (
        !applications ||
        applications.length === 0
    ) {

        applicationsContainer.innerHTML = `

            <div class="no-applications">

                <h3>
                    No applications yet
                </h3>

                <p>
                    You have not submitted any
                    job applications yet.
                </p>

            </div>

        `;

        return;

    }


    applications.forEach(
        application => {

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


            const createdAt =
                application.created_at ||
                new Date().toISOString();


            const formattedDate =
                new Date(
                    createdAt
                ).toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    }
                );


            const statusClass =
                status
                    .toLowerCase()
                    .replace(
                        /\s+/g,
                        "-"
                    );


            //========================================
            // CARD
            //========================================

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "application-card";


            card.innerHTML = `

                <h3>
                    ${escapeHtml(jobTitle)}
                </h3>

                <h4>
                    ${escapeHtml(company)}
                </h4>

                <p>

                    <i class="fa-solid fa-location-dot"></i>

                    ${escapeHtml(city)}

                </p>

                <p>

                    <i class="fa-solid fa-calendar-days"></i>

                    Applied:
                    ${escapeHtml(formattedDate)}

                </p>

                <span
                    class="status ${escapeHtml(statusClass)}">

                    ${escapeHtml(status)}

                </span>


                <div
                    class="application-actions">


                    <button
                        class="view-btn"
                        type="button">

                        <i class="fa-solid fa-eye"></i>

                        View Details

                    </button>


                    <button
                        class="delete-btn"
                        type="button">

                        <i class="fa-solid fa-trash"></i>

                        Delete

                    </button>


                </div>

            `;


            //========================================
            // VIEW DETAILS
            //========================================

            const viewButton =
                card.querySelector(
                    ".view-btn"
                );


            viewButton.addEventListener(
                "click",
                function() {

                    showApplicationDetails(
                        application
                    );

                }
            );


            //========================================
            // DELETE
            //========================================

            const deleteButton =
                card.querySelector(
                    ".delete-btn"
                );


            deleteButton.addEventListener(
                "click",
                async function() {

                    await deleteApplication(
                        application.id,
                        card
                    );

                }
            );


            applicationsContainer.appendChild(
                card
            );

        }
    );

}


//========================================
// SHOW APPLICATION DETAILS
//========================================

function showApplicationDetails(
    application
) {

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


    const fullName =
        application.full_name ||
        "Not specified";


    const email =
        application.email ||
        "Not specified";


    const phone =
        application.phone ||
        "Not specified";


    const coverLetter =
        application.cover_letter ||
        "No cover letter provided.";


    const cvName =
        application.cv_name ||
        "No CV attached.";


    const createdAt =
        application.created_at;


    const formattedDate =
        createdAt
            ? new Date(
                createdAt
            ).toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            )
            : "Not specified";


    alert(

        "JOB APPLICATION" +

        "\n\nJob: " +
        jobTitle +

        "\nCompany: " +
        company +

        "\nCity: " +
        city +

        "\nSalary: " +
        salary +

        "\nStatus: " +
        status +

        "\nApplied: " +
        formattedDate +

        "\n\nAPPLICANT" +

        "\nName: " +
        fullName +

        "\nEmail: " +
        email +

        "\nPhone: " +
        phone +

        "\n\nCV: " +
        cvName +

        "\n\nCover Letter:\n" +
        coverLetter

    );

}


//========================================
// DELETE APPLICATION
//========================================

async function deleteApplication(
    applicationId,
    card
) {

    if (!applicationId) {

        alert(
            "Unable to identify this application."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this application?"
        );


    if (!confirmed) {

        return;

    }


    const {
        error
    } = await supabase
        .from("applications")
        .delete()
        .eq(
            "id",
            applicationId
        );


    if (error) {

        console.error(
            "Unable to delete application:",
            error
        );


        alert(
            "Unable to delete application:\n\n" +
            error.message
        );

        return;

    }


    //========================================
    // REMOVE CARD
    //========================================

    card.remove();


    //========================================
    // CHECK IF EMPTY
    //========================================

    const remainingCards =
        applicationsContainer.querySelectorAll(
            ".application-card"
        );


    if (
        remainingCards.length === 0
    ) {

        applicationsContainer.innerHTML = `

            <div class="no-applications">

                <h3>
                    No applications yet
                </h3>

                <p>
                    You have not submitted any
                    job applications yet.
                </p>

            </div>

        `;

    }

}


//========================================
// START
//========================================

loadApplications();