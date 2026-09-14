import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById("contactForm");

    if (!contactForm) {
        return;
    }

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const message =
            document.getElementById("message").value.trim();


        // ==========================================
        // VALIDATE FORM
        // ==========================================

        if (!name || !email || !subject || !message) {

            alert("Please complete all fields.");

            return;
        }


        // ==========================================
        // SAVE MESSAGE TO SUPABASE
        // ==========================================

        const { error } = await supabase
            .from("support_messages")
            .insert({

                name: name,

                email: email,

                subject: subject,

                message: message

            });


        // ==========================================
        // ERROR
        // ==========================================

        if (error) {

            console.error(
                "Contact message error:",
                error
            );

            alert(
                "Something went wrong. Please try again."
            );

            return;
        }


        // ==========================================
        // SUCCESS
        // ==========================================

        alert(
            "Your message has been sent successfully."
        );

        contactForm.reset();

    });

});