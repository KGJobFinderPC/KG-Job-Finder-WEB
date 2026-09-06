import { supabase } from "./supabase.js";

//========================================
// KG JOB FINDER
// UPLOAD CV
//========================================

const uploadForm =
    document.getElementById("uploadForm");

const cvFile =
    document.getElementById("cvFile");

const fileName =
    document.getElementById("fileName");
    //========================================
// SHOW FILE NAME
//========================================

cvFile.addEventListener("change", function () {

    if (this.files.length > 0) {

        fileName.textContent =
            this.files[0].name;

    } else {

        fileName.textContent =
            "No file selected";

    }

});

//========================================
// CHECK AUTHENTICATED USER
//========================================

async function getCurrentUser() {

    const {
        data,
        error
    } = await supabase.auth.getUser();

    if (error || !data.user) {

        window.location.replace("login.html");

        return null;

    }

    return data.user;

}
//========================================
// FORM VALIDATION
//========================================

uploadForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const fullName =
            document
                .getElementById("fullName")
                .value
                .trim();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const phone =
            document
                .getElementById("phone")
                .value
                .trim();

        const city =
            document
                .getElementById("city")
                .value
                .trim();

        const coverLetter =
            document
                .getElementById("coverLetter")
                .value
                .trim();

        if (
            fullName === "" ||
            email === "" ||
            phone === "" ||
            city === ""
        ) {

            alert(
                "Please complete all required fields."
            );

            return;

        }

        if (cvFile.files.length === 0) {

            alert(
                "Please select your CV."
            );

            return;

        }

        const file =
            cvFile.files[0];

        const extension =
            file.name
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

            alert(
                "Only PDF, DOC and DOCX files are allowed."
            );

            cvFile.value = "";

            fileName.textContent =
                "No file selected";

            return;

        }

        //========================================
        // GET AUTHENTICATED USER
        //========================================

        const user =
            await getCurrentUser();

        if (!user) {

            return;

        }

        //========================================
        // FILE INFORMATION
        //========================================

        console.log("User:", user.id);

        console.log("CV:", file.name);

        console.log(
            "CV size:",
            file.size,
            "bytes"
        );

        console.log(
            "Cover letter:",
            coverLetter
        );
        //========================================
// UPLOAD CV TO SUPABASE STORAGE
//========================================

        const filePath =
            `${user.id}/${Date.now()}-${file.name}`;

        const {
            error: uploadError
        } = await supabase.storage
            .from("cv-files")
            .upload(
                filePath,
                file,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );

        if (uploadError) {

            alert(
                "Unable to upload CV: " +
                uploadError.message
            );

            return;

        }

//========================================
// UPLOAD SUCCESS
//========================================

        alert(
            "CV uploaded successfully."
        );

        uploadForm.reset();

        fileName.textContent =
            "No file selected";

    }
);