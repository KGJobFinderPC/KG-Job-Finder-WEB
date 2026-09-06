//========================================
// KG JOB FINDER
// RECOMMENDED JOBS
//========================================

const applyButtons = document.querySelectorAll(".apply-btn");

//========================================
// APPLY NOW
//========================================

applyButtons.forEach(button => {

    button.addEventListener("click", function () {

        const card = this.closest(".job-card");

        const jobTitle =
            card.querySelector("h3").textContent;

        const company =
            card.querySelector("h4").textContent;

        const match =
            card.querySelector(".match-score").textContent;

        alert(

            "Job: " + jobTitle +
            "\n\nCompany: " + company +
            "\n\nCompatibility: " + match +
            "\n\nReady for application."

        );

    });

});

//========================================
// READY FOR SUPABASE
//========================================

console.log("Recommended Jobs page ready for Supabase.");
