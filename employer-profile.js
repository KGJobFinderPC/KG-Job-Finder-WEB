import { supabase, logoutUser } from "./supabase.js";

//==================================================
// KG JOB FINDER
// EMPLOYER PROFILE
//==================================================

//==================================================
// ELEMENTS
//==================================================

const profileForm =
    document.getElementById("employerProfileForm");

const companyNameInput =
    document.getElementById("companyName");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const cityInput =
    document.getElementById("city");

const countryInput =
    document.getElementById("country");

const websiteInput =
    document.getElementById("website");

const descriptionInput =
    document.getElementById("description");

//==================================================
// LOAD EMPLOYER PROFILE
//==================================================

async function loadEmployerProfile() {

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

        return;
    }

    const user =
        data.session.user;

    const accountType =
        user.user_metadata?.account_type;

    //==================================================
    // EMPLOYER ACCESS ONLY
    //==================================================

    if (accountType !== "employer") {

        alert(
            "Access denied. Employer account required."
        );

        window.location.replace(
            "dashboard.html"
        );

        return;
    }

    //==================================================
    // LOAD USER INFORMATION
    //==================================================

    const metadata =
        user.user_metadata || {};

    if (companyNameInput) {

        companyNameInput.value =
            metadata.company_name || "";
    }

    if (emailInput) {

        emailInput.value =
            user.email || "";
    }

    if (phoneInput) {

        phoneInput.value =
            metadata.phone || "";
    }

    if (cityInput) {

        cityInput.value =
            metadata.city || "";
    }

    if (countryInput) {

        countryInput.value =
            metadata.country || "";
    }

    if (websiteInput) {

        websiteInput.value =
            metadata.website || "";
    }

    if (descriptionInput) {

        descriptionInput.value =
            metadata.description || "";
    }
}

//==================================================
// SAVE EMPLOYER PROFILE
//==================================================

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const companyName =
                companyNameInput.value.trim();

            const phone =
                phoneInput.value.trim();

            const city =
                cityInput.value.trim();

            const country =
                countryInput.value.trim();

            const website =
                websiteInput.value.trim();

            const description =
                descriptionInput.value.trim();

            if (!companyName) {

                alert(
                    "Please enter your company name."
                );

                return;
            }

            //==================================================
            // UPDATE SUPABASE USER METADATA
            //==================================================

            const {
                data,
                error
            } = await supabase.auth.updateUser({

                data: {

                    company_name:
                        companyName,

                    phone:
                        phone,

                    city:
                        city,

                    country:
                        country,

                    website:
                        website,

                    description:
                        description,

                    account_type:
                        "employer"
                }

            });

            if (error) {

                alert(
                    "Profile update error: " +
                    error.message
                );

                return;
            }

            //==================================================
            // UPDATE EMAIL FIELD FROM CURRENT USER
            //==================================================

            if (
                data &&
                data.user &&
                emailInput
            ) {

                emailInput.value =
                    data.user.email || "";
            }

            alert(
                "Profile saved successfully."
            );
        }
    );
}

//==================================================
// START
//==================================================

loadEmployerProfile();