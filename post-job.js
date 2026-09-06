import { supabase } from "./supabase.js";

//========================================
// KG JOB FINDER
// POST JOB
//========================================

//========================================
// ELEMENTS
//========================================

const postJobForm =
    document.getElementById("postJobForm");

const postJobButton =
    document.getElementById("postJobBtn");


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
// POST JOB
//========================================

if (postJobForm) {

    postJobForm.addEventListener(
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
            // GET FORM VALUES
            //========================================

            const title =
                document
                .getElementById("jobTitle")
                .value
                .trim();

            const company =
                document
                .getElementById("company")
                .value
                .trim();

            const city =
                document
                .getElementById("city")
                .value
                .trim();

            const salary =
                document
                .getElementById("salary")
                .value
                .trim();

            const description =
                document
                .getElementById("description")
                .value
                .trim();


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

            if (postJobButton) {

                postJobButton.disabled = true;

                postJobButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Publishing...
                `;

            }


            //========================================
            // SAVE JOB TO SUPABASE
            //========================================

            const {
                data,
                error
            } = await supabase
                .from("jobs")
                .insert({

                    title: title,

                    company: company,

                    city: city,

                    description: description,

                    salary: salary,

                    user_id: user.id

                })
                .select()
                .single();


            //========================================
            // ERROR
            //========================================

            if (error) {

                console.error(
                    "Unable to publish job:",
                    error
                );

                alert(
                    "Unable to publish job: " +
                    error.message
                );


                if (postJobButton) {

                    postJobButton.disabled = false;

                    postJobButton.innerHTML = `
                        <i class="fa-solid fa-plus"></i>
                        Publish Job
                    `;

                }

                return;

            }


            //========================================
            // SUCCESS
            //========================================

            console.log(
                "Job published successfully:",
                data
            );

            alert(
                "Job published successfully."
            );


            //========================================
            // RETURN TO EMPLOYER DASHBOARD
            //========================================

            window.location.replace(
                "employer-dashboard.html"
            );

        }
    );

}


//========================================
// INITIAL ACCESS CHECK
//========================================

checkEmployerAccess();