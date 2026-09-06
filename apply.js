import { supabase } from "./supabase.js";

//========================================
// KG JOB FINDER
// APPLY
//========================================

//========================================
// ELEMENTS
//========================================

const applicationForm =
    document.getElementById("applicationForm");

const jobTitleElement =
    document.getElementById("jobTitle");

const fullNameInput =
    document.getElementById("fullName");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const cityInput =
    document.getElementById("city");

const cvInput =
    document.getElementById("cv");

const coverLetterInput =
    document.getElementById("coverLetter");

const submitButton =
    document.getElementById("submitApplication");

const messageElement =
    document.getElementById("message");


//========================================
// SELECTED JOB
//========================================

const selectedJobId =
    localStorage.getItem("selectedjobid");

const selectedJobTitle =
    localStorage.getItem("selectedjobtitle");

const selectedJobCompany =
    localStorage.getItem("selectedjobcompany");

const selectedJobSalary =
    localStorage.getItem("selectedjobsalary");

const selectedJobCity =
    localStorage.getItem("selectedjobcity");


//========================================
// DISPLAY JOB
//========================================

if (selectedJobTitle) {

    jobTitleElement.textContent =
        selectedJobTitle;

} else {

    jobTitleElement.textContent =
        "No job selected";
}


//========================================
// MESSAGE
//========================================

function showMessage(
    message,
    type = ""
) {

    messageElement.textContent =
        message;

    messageElement.className =
        "message " + type;
}


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
// LOAD PROFILE
//========================================

async function loadUserInformation() {

    const user =
        await getCurrentUser();

    if (!user) {

        return;
    }


    emailInput.value =
        user.email || "";


    const {
        data: profile,
        error
    } = await supabase
        .from("profiles")
        .select(
            "full_name,email,phone,city"
        )
        .eq(
            "id",
            user.id
        )
        .maybeSingle();


    if (error) {

        console.error(
            "Unable to load profile:",
            error
        );

        return;
    }


    if (profile) {

        fullNameInput.value =
            profile.full_name || "";

        emailInput.value =
            profile.email ||
            user.email ||
            "";

        phoneInput.value =
            profile.phone || "";

        cityInput.value =
            profile.city || "";
    }
}


//========================================
// FILE TO ARRAY BUFFER
//========================================

function fileToArrayBuffer(file) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload =
                function() {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                function() {

                    reject(
                        new Error(
                            "Unable to read the CV file."
                        )
                    );

                };


            reader.onabort =
                function() {

                    reject(
                        new Error(
                            "CV file reading was cancelled."
                        )
                    );

                };


            reader.readAsArrayBuffer(
                file
            );

        }
    );
}


//========================================
// FILE TO BASE64
//========================================

function fileToBase64(file) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload =
                function() {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                function() {

                    reject(
                        new Error(
                            "Unable to read the CV file."
                        )
                    );

                };


            reader.onabort =
                function() {

                    reject(
                        new Error(
                            "CV file reading was cancelled."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );
}


//========================================
// SUBMIT APPLICATION
//========================================

applicationForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        showMessage(
            "",
            ""
        );


        //========================================
        // CHECK JOB
        //========================================

        if (
            !selectedJobId ||
            !selectedJobTitle
        ) {

            showMessage(
                "No job has been selected.",
                "error"
            );

            return;
        }


        //========================================
        // FORM VALUES
        //========================================

        const fullName =
            fullNameInput.value.trim();

        const email =
            emailInput.value.trim();

        const phone =
            phoneInput.value.trim();

        const city =
            cityInput.value.trim();

        const coverLetter =
            coverLetterInput.value.trim();

        const cvFile =
            cvInput.files[0];


        //========================================
        // VALIDATION
        //========================================

        if (
            fullName === "" ||
            email === "" ||
            phone === "" ||
            city === ""
        ) {

            showMessage(
                "Please complete all required fields.",
                "error"
            );

            return;
        }


        if (!cvFile) {

            showMessage(
                "Please select your CV.",
                "error"
            );

            return;
        }


        //========================================
        // FILE EXTENSION
        //========================================

        const extension =
            cvFile.name
                .split(".")
                .pop()
                .toLowerCase();


        const allowedExtensions = [
            "pdf",
            "doc",
            "docx"
        ];


        if (
            !allowedExtensions.includes(
                extension
            )
        ) {

            showMessage(
                "Please upload a PDF, DOC or DOCX file.",
                "error"
            );

            return;
        }


        //========================================
        // FILE SIZE
        //========================================

        const maxFileSize =
            5 * 1024 * 1024;


        if (
            cvFile.size >
            maxFileSize
        ) {

            showMessage(
                "CV file must be smaller than 5 MB.",
                "error"
            );

            return;
        }


        //========================================
        // BUTTON
        //========================================

        submitButton.disabled =
            true;

        submitButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Sending Application...
        `;


        try {

            //========================================
            // CURRENT USER
            //========================================

            const user =
                await getCurrentUser();


            if (!user) {

                return;
            }


            //========================================
            // READ CV AS ARRAY BUFFER
            //========================================

            showMessage(
                "Preparing your CV...",
                ""
            );


            const cvBuffer =
                await fileToArrayBuffer(
                    cvFile
                );


            if (!cvBuffer) {

                throw new Error(
                    "Unable to prepare the CV file."
                );
            }


            //========================================
            // UPLOAD CV
            //========================================

            showMessage(
                "Uploading your CV...",
                ""
            );


            const storageFileName =
                Date.now() +
                "-" +
                cvFile.name;


            const storagePath =
                user.id +
                "/" +
                storageFileName;


            const {
                error: uploadError
            } =
                await supabase
                    .storage
                    .from("cv-files")
                    .upload(
                        storagePath,
                        cvBuffer,
                        {
                            contentType:
                                cvFile.type ||
                                "application/pdf",

                            upsert:
                                false
                        }
                    );


            if (uploadError) {

                console.error(
                    "CV upload error:",
                    uploadError
                );


                showMessage(
                    "Unable to upload your CV: " +
                    uploadError.message,
                    "error"
                );


                submitButton.disabled =
                    false;


                submitButton.innerHTML = `
                    <i class="fa-solid fa-paper-plane"></i>
                    Submit Application
                `;


                return;
            }


            //========================================
            // KEEP BASE64
            //========================================

            const cvData =
                await fileToBase64(
                    cvFile
                );


            //========================================
            // INSERT APPLICATION
            //========================================

            const applicationData = {

                user_id:
                    user.id,

                job_id:
                    selectedJobId,

                full_name:
                    fullName,

                email:
                    email,

                phone:
                    phone,

                city:
                    city,

                cv_name:
                    cvFile.name,

                cv_data:
                    cvData,

                cv_path:
                    storagePath,

                cover_letter:
                    coverLetter,

                job_title:
                    selectedJobTitle,

                company:
                    selectedJobCompany || "",

                salary:
                    selectedJobSalary || "",

                description:
                    "",

                status:
                    "Pending"

            };


            console.log(
                "Submitting application:",
                applicationData
            );


            const {
                data,
                error
            } = await supabase
                .from("applications")
                .insert(
                    applicationData
                )
                .select()
                .single();


            //========================================
            // DATABASE ERROR
            //========================================

            if (error) {

                console.error(
                    "Supabase application error:",
                    error
                );


                showMessage(
                    "Unable to submit application: " +
                    error.message,
                    "error"
                );


                submitButton.disabled =
                    false;


                submitButton.innerHTML = `
                    <i class="fa-solid fa-paper-plane"></i>
                    Submit Application
                `;


                return;
            }


            //========================================
            // SUCCESS
            //========================================

            console.log(
                "Application created:",
                data
            );


            showMessage(
                "Application submitted successfully!",
                "success"
            );


            submitButton.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Application Submitted
            `;


            //========================================
            // REDIRECT
            //========================================

            setTimeout(
                function() {

                    window.location.replace(
                        "applications.html"
                    );

                },
                1500
            );


        } catch (error) {

            console.error(
                "Unexpected application error:",
                error
            );


            showMessage(
                "Something went wrong: " +
                error.message,
                "error"
            );


            submitButton.disabled =
                false;


            submitButton.innerHTML = `
                <i class="fa-solid fa-paper-plane"></i>
                Submit Application
            `;
        }

    }
);


//========================================
// START
//========================================

loadUserInformation();