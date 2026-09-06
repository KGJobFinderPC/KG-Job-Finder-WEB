import { supabase } from "./supabase.js";

//========================================
// KG JOB FINDER
// EDIT JOB
//========================================

//========================================
// ELEMENTS
//========================================

const editJobForm =
    document.getElementById("editJobForm");

const saveJobButton =
    document.getElementById("saveJobBtn");


//========================================
// GET JOB ID
//========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const jobId =
    urlParams.get("id");


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
// LOAD JOB
//========================================

async function loadJob() {

    if (!jobId) {

        alert(
            "No job was selected."
        );

        window.location.replace(
            "my-jobs.html"
        );

        return;

    }

    const user =
        await checkEmployerAccess();

    if (!user) {

        return;

    }


    //========================================
    // GET JOB BELONGING TO CURRENT EMPLOYER
    //========================================

    const {
        data: job,
        error
    } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .eq("user_id", user.id)
        .maybeSingle();


    //========================================
    // HANDLE ERROR
    //========================================

    if (error) {

        console.error(
            "Unable to load job:",
            error
        );

        alert(
            "Unable to load job: " +
            error.message
        );

        window.location.replace(
            "my-jobs.html"
        );

        return;

    }


    //========================================
    // JOB NOT FOUND
    //========================================

    if (!job) {

        alert(
            "Job not found or you do not have permission to edit it."
        );

        window.location.replace(
            "my-jobs.html"
        );

        return;

    }


    //========================================
    // FILL FORM
    //========================================

    document.getElementById(
        "jobTitle"
    ).value =
        job.title || "";

    document.getElementById(
        "company"
    ).value =
        job.company || "";

    document.getElementById(
        "city"
    ).value =
        job.city || "";

    document.getElementById(
        "salary"
    ).value =
        job.salary || "";

    document.getElementById(
        "description"
    ).value =
        job.description || "";

}


//========================================
// SAVE CHANGES
//========================================

if (editJobForm) {

    editJobForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            //========================================
            // CHECK EMPLOYER
            //========================================

            const user =
                await checkEmployerAccess();

            if (!user) {

                return;

            }


            //========================================
            // CHECK JOB ID
            //========================================

            if (!jobId) {

                alert(
                    "No job was selected."
                );

                return;

            }


            //========================================
            // GET VALUES
            //========================================

            const title =
                document.getElementById(
                    "jobTitle"
                ).value.trim();

            const company =
                document.getElementById(
                    "company"
                ).value.trim();

            const city =
                document.getElementById(
                    "city"
                ).value.trim();

            const salary =
                document.getElementById(
                    "salary"
                ).value.trim();

            const description =
                document.getElementById(
                    "description"
                ).value.trim();


            //========================================
            // VALIDATION
            //========================================

            if (
                title === "" ||
                company === "" ||
                city === "" ||
                salary === "" ||
                description === ""
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            //========================================
            // DISABLE BUTTON
            //========================================

            if (saveJobButton) {

                saveJobButton.disabled = true;

                saveJobButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Saving...
                `;

            }


            //========================================
            // UPDATE JOB
            //========================================

            const {
                data,
                error
            } = await supabase
                .from("jobs")
                .update({

                    title: title,

                    company: company,

                    city: city,

                    salary: salary,

                    description: description

                })
                .eq("id", jobId)
                .eq("user_id", user.id)
                .select()
                .maybeSingle();


            //========================================
            // HANDLE ERROR
            //========================================

            if (error) {

                console.error(
                    "Unable to update job:",
                    error
                );

                alert(
                    "Unable to update job: " +
                    error.message
                );


                if (saveJobButton) {

                    saveJobButton.disabled = false;

                    saveJobButton.innerHTML = `
                        <i class="fa-solid fa-floppy-disk"></i>
                        Save Changes
                    `;

                }

                return;

            }


            //========================================
            // CHECK UPDATE RESULT
            //========================================

            if (!data) {

                alert(
                    "The job could not be updated."
                );


                if (saveJobButton) {

                    saveJobButton.disabled = false;

                    saveJobButton.innerHTML = `
                        <i class="fa-solid fa-floppy-disk"></i>
                        Save Changes
                    `;

                }

                return;

            }


            //========================================
            // SUCCESS
            //========================================

            console.log(
                "Job updated successfully:",
                data
            );

            alert(
                "Job updated successfully."
            );


            //========================================
            // RETURN TO MY JOBS
            //========================================

            window.location.replace(
                "my-jobs.html"
            );

        }
    );

}


//========================================
// START
//========================================

loadJob();