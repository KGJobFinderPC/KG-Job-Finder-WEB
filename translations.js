// ============================================================
// KG JOB FINDER
// GLOBAL TRANSLATION SYSTEM
// 41 LANGUAGES
// ============================================================

const LANGUAGES = {

    en: "🇬🇧 English",
    ro: "🇷🇴 Romanian",
    de: "🇩🇪 German",
    fr: "🇫🇷 French",
    es: "🇪🇸 Spanish",
    it: "🇮🇹 Italian",
    pt: "🇵🇹 Portuguese",
    nl: "🇳🇱 Dutch",
    pl: "🇵🇱 Polish",
    el: "🇬🇷 Greek",
    cs: "🇨🇿 Czech",
    sk: "🇸🇰 Slovak",
    hu: "🇭🇺 Hungarian",
    bg: "🇧🇬 Bulgarian",
    hr: "🇭🇷 Croatian",
    sl: "🇸🇮 Slovenian",
    sr: "🇷🇸 Serbian",
    bs: "🇧🇦 Bosnian",
    sq: "🇦🇱 Albanian",
    mk: "🇲🇰 Macedonian",
    uk: "🇺🇦 Ukrainian",
    ru: "🇷🇺 Russian",
    be: "🇧🇾 Belarusian",
    sv: "🇸🇪 Swedish",
    da: "🇩🇰 Danish",
    no: "🇳🇴 Norwegian",
    fi: "🇫🇮 Finnish",
    is: "🇮🇸 Icelandic",
    et: "🇪🇪 Estonian",
    lv: "🇱🇻 Latvian",
    lt: "🇱🇹 Lithuanian",
    ga: "🇮🇪 Irish",
    mt: "🇲🇹 Maltese",
    cy: "🏴 Welsh",
    tr: "🇹🇷 Turkish",
    ka: "🇬🇪 Georgian",
    hy: "🇦🇲 Armenian",
    az: "🇦🇿 Azerbaijani",
    he: "🇮🇱 Hebrew",
    ar: "🇸🇦 Arabic"

};


// ============================================================
// STORAGE
// ============================================================

const LANGUAGE_KEY = "KG_JOB_FINDER_LANGUAGE";


// ============================================================
// GET CURRENT LANGUAGE
// ============================================================

function getCurrentLanguage() {

    const saved = localStorage.getItem(LANGUAGE_KEY);

    if (saved && LANGUAGES[saved]) {
        return saved;
    }

    return "en";

}


// ============================================================
// SAVE LANGUAGE
// ============================================================

function saveLanguage(language) {

    if (!LANGUAGES[language]) {
        return;
    }

    localStorage.setItem(
        LANGUAGE_KEY,
        language
    );

}


// ============================================================
// LOGIN TRANSLATIONS
// ============================================================

const TRANSLATIONS = {

    en: {

        "brand.jobFinder":
            "JOB FINDER",
"common.accept": "Accept",
"common.reject": "Reject",
"common.view": "View",
        "brand.findFuture":
            "FIND YOUR FUTURE",

        "brand.futureStarts":
            "YOUR FUTURE STARTS HERE",

        "login.candidate":
            "CANDIDATE",

        "login.candidateTitle":
            "Build Your",

        "login.candidateHighlight":
            "Career",

        "login.candidateText":
            "Discover opportunities, apply for jobs and take the next step in your career.",

        "login.memberLogin":
            "MEMBER LOGIN",

        "login.welcome":
            "Welcome Back",

        "login.subtitle":
            "Sign in to continue to KG Job Finder.",

        "login.email":
            "Email Address",

        "login.password":
            "Password",

        "login.remember":
            "Remember Me",

        "login.forgot":
            "Forgot Password?",

        "login.login":
            "Login",

        "login.noAccount":
            "Don't have an account?",

        "login.createAccount":
            "Create Account",

        "login.employer":
            "EMPLOYER",

        "login.employerTitle":
            "Find The",

        "login.employerHighlight":
            "Right Talent",

        "login.employerText":
            "Connect with candidates, discover talent and build your future team."

    },

    ro: {

        "brand.jobFinder":
            "LOCURI DE MUNCĂ",

        "brand.findFuture":
            "GĂSEȘTE-ȚI VIITORUL",

        "brand.futureStarts":
            "VIITORUL TĂU ÎNCEPE AICI",

        "login.candidate":
            "CANDIDAT",

        "login.candidateTitle":
            "Construiește-ți",

        "login.candidateHighlight":
            "Cariera",

        "login.candidateText":
            "Descoperă oportunități, aplică la locuri de muncă și fă următorul pas în cariera ta.",

        "login.memberLogin":
            "AUTENTIFICARE MEMBRU",

        "login.welcome":
            "Bine ai revenit",

        "login.subtitle":
            "Autentifică-te pentru a continua în KG Job Finder.",

        "login.email":
            "Adresă de email",

        "login.password":
            "Parolă",

        "login.remember":
            "Ține-mă minte",

        "login.forgot":
            "Ai uitat parola?",

        "login.login":
            "Autentificare",

        "login.noAccount":
            "Nu ai un cont?",

        "login.createAccount":
            "Creează un cont",

        "login.employer":
            "ANGAJATOR",

        "login.employerTitle":
            "Găsește",

        "login.employerHighlight":
            "Talentul potrivit",

        "login.employerText":
            "Conectează-te cu candidați, descoperă talente și construiește-ți viitoarea echipă."

    }

};


// ============================================================
// TRANSLATION LOOKUP
// ============================================================

function getTranslation(key, language) {

    const selectedLanguage =
        language || getCurrentLanguage();

    if (
        TRANSLATIONS[selectedLanguage] &&
        TRANSLATIONS[selectedLanguage][key]
    ) {
        return TRANSLATIONS[selectedLanguage][key];
    }

       if (
           TRANSLATIONS.en &&
           TRANSLATIONS.en[key]
       ) {
           if (selectedLanguage === "en") {
               return TRANSLATIONS.en[key];
           }

           return null;
       }

       return null;

}


// ============================================================
// ONLINE TRANSLATION
// ============================================================

function translateOnline(text, language) {

    if (!text || language === "en") {
        return Promise.resolve(text);
    }

    const cacheKey =
        "KG_TRANSLATION_" +
        language +
        "_" +
        text;

    const cached =
        localStorage.getItem(cacheKey);

    if (cached) {
        return Promise.resolve(cached);
    }

    const url =
        "https://translate.googleapis.com/translate_a/single" +
        "?client=gtx" +
        "&sl=en" +
        "&tl=" +
        encodeURIComponent(language) +
        "&dt=t" +
        "&q=" +
        encodeURIComponent(text);

    return fetch(url)
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Translation request failed."
                );
            }

            return response.json();

        })
        .then(data => {

            if (
                !Array.isArray(data) ||
                !Array.isArray(data[0])
            ) {
                return text;
            }

            const translated =
                data[0]
                    .map(part => part[0] || "")
                    .join("");

            if (!translated) {
                return text;
            }

            localStorage.setItem(
                cacheKey,
                translated
            );

            return translated;

        })
        .catch(() => text);

}


// ============================================================
// TRANSLATE ELEMENTS
// ============================================================

async function translateDataAttributes() {

    const language =
        getCurrentLanguage();


    const elements =
        document.querySelectorAll(
            "[data-translate]"
        );


    for (const element of elements) {

        const key =
            element.getAttribute(
                "data-translate"
            );

        if (!key) {
            continue;
        }


        let original =
            element.getAttribute(
                "data-original-text"
            );


        if (!original) {

            original =
                element.textContent
                    .replace(/\s+/g, " ")
                    .trim();

            element.setAttribute(
                "data-original-text",
                original
            );

        }


        const local =
            getTranslation(
                key,
                language
            );


        if (
            local &&
            local !== key
        ) {

            element.textContent =
                local;

            continue;

        }


        if (language === "en") {

            element.textContent =
                original;

            continue;

        }


        const translated =
            await translateOnline(
                original,
                language
            );

        element.textContent =
            translated;

    }


    // ========================================================
    // PLACEHOLDERS
    // ========================================================

    const placeholders =
        document.querySelectorAll(
            "[data-translate-placeholder]"
        );


    for (const element of placeholders) {

        const key =
            element.getAttribute(
                "data-translate-placeholder"
            );

        if (!key) {
            continue;
        }


        let original =
            element.getAttribute(
                "data-original-placeholder"
            );


        if (!original) {

            original =
                element.getAttribute(
                    "placeholder"
                ) || "";

            element.setAttribute(
                "data-original-placeholder",
                original
            );

        }


        const local =
            getTranslation(
                key,
                language
            );


        if (
            local &&
            local !== key
        ) {

            element.setAttribute(
                "placeholder",
                local
            );

            continue;

        }


        if (language === "en") {

            element.setAttribute(
                "placeholder",
                original
            );

            continue;

        }


        const translated =
            await translateOnline(
                original,
                language
            );

        element.setAttribute(
            "placeholder",
            translated
        );

    }

}


// ============================================================
// LANGUAGE SELECTOR
// ONLY CREATED ON LOGIN PAGE
// ============================================================

function createLanguageSelector() {

    const path =
        window.location.pathname
            .toLowerCase();

    if (
        !path.endsWith("login.html") &&
        !path.endsWith("index.html") &&
        !path.endsWith("/kg-job-finder-web/") &&
        path !== "/kg-job-finder-web"
    ) {
        return;
    }


    let selector =
        document.querySelector(
            ".language-selector"
        );


    if (selector) {

        updateLanguageSelector();

        return;

    }


    selector =
        document.createElement("div");

    selector.className =
        "language-selector";


    selector.innerHTML = `

        <button
            type="button"
            class="language-button"
            aria-label="Select language">

            <i class="fa-solid fa-globe"></i>

            <span class="language-current"></span>

            <i class="fa-solid fa-chevron-down language-arrow"></i>

        </button>

        <div class="language-menu"></div>

    `;


    document.body.appendChild(
        selector
    );


    const button =
        selector.querySelector(
            ".language-button"
        );


    const menu =
        selector.querySelector(
            ".language-menu"
        );


    Object.entries(
        LANGUAGES
    ).forEach(
        ([code, name]) => {

            const option =
                document.createElement(
                    "button"
                );

            option.type =
                "button";

            option.className =
                "language-option";

            option.dataset.language =
                code;

            option.textContent =
                name;


            option.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    setLanguage(code);

                    selector.classList.remove(
                        "open"
                    );

                }
            );


            menu.appendChild(
                option
            );

        }
    );


    button.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            selector.classList.toggle(
                "open"
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !selector.contains(
                    event.target
                )
            ) {

                selector.classList.remove(
                    "open"
                );

            }

        }
    );


    updateLanguageSelector();

}


// ============================================================
// UPDATE SELECTOR
// ============================================================

function updateLanguageSelector() {

    const selector =
        document.querySelector(
            ".language-selector"
        );

    if (!selector) {
        return;
    }


    const language =
        getCurrentLanguage();


    const current =
        selector.querySelector(
            ".language-current"
        );


    if (current) {

        current.textContent =
            LANGUAGES[language];

    }


    selector
        .querySelectorAll(
            ".language-option"
        )
        .forEach(option => {

            option.classList.toggle(
                "active",
                option.dataset.language ===
                language
            );

        });

}


// ============================================================
// SET LANGUAGE
// ============================================================

async function setLanguage(language) {

    if (!LANGUAGES[language]) {
        return;
    }


    saveLanguage(language);


    document.documentElement.setAttribute(
        "lang",
        language
    );


    const rtlLanguages = [
        "ar",
        "he"
    ];


    if (
        rtlLanguages.includes(language)
    ) {

        document.documentElement.setAttribute(
            "dir",
            "rtl"
        );

        document.body.classList.add(
            "rtl-language"
        );

    } else {

        document.documentElement.setAttribute(
            "dir",
            "ltr"
        );

        document.body.classList.remove(
            "rtl-language"
        );

    }


    updateLanguageSelector();

    await translateDataAttributes();

}


// ============================================================
// OBSERVE DYNAMIC CONTENT
// ============================================================

let observerTimer = null;


const translationObserver =
    new MutationObserver(
        mutations => {

            const changed =
                mutations.some(
                    mutation =>
                        mutation.addedNodes &&
                        mutation.addedNodes.length > 0
                );


            if (!changed) {
                return;
            }


            clearTimeout(
                observerTimer
            );


            observerTimer =
                setTimeout(
                    () => {

                        translateDataAttributes();

                    },
                    150
                );

        }
    );


// ============================================================
// INITIALIZE
// ============================================================

function initializeTranslations() {

    const start = async () => {

        const language =
            getCurrentLanguage();


        document.documentElement.setAttribute(
            "lang",
            language
        );


        const rtlLanguages = [
            "ar",
            "he"
        ];


        if (
            rtlLanguages.includes(language)
        ) {

            document.documentElement.setAttribute(
                "dir",
                "rtl"
            );

            if (document.body) {

                document.body.classList.add(
                    "rtl-language"
                );

            }

        } else {

            document.documentElement.setAttribute(
                "dir",
                "ltr"
            );

            if (document.body) {

                document.body.classList.remove(
                    "rtl-language"
                );

            }

        }

// CREATE LANGUAGE BUTTON ON LOGIN, INDEX AND GITHUB PAGES HOME
const path =
    window.location.pathname
        .toLowerCase();

if (
    path.endsWith("login.html") ||
    path.endsWith("index.html") ||
    path.endsWith("/kg-job-finder-web/") ||
    path === "/kg-job-finder-web"
) {
    createLanguageSelector();
}


        await translateDataAttributes();


        if (document.body) {

            translationObserver.observe(
                document.body,
                {
                    childList: true,
                    subtree: true
                }
            );

        }

    };


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start,
            {
                once: true
            }
        );

    } else {

        start();

    }

}


// ============================================================
// EXPORTS
// ============================================================

export {

    LANGUAGES,

    TRANSLATIONS,

    getCurrentLanguage,

    saveLanguage,

    getTranslation,

    setLanguage,

    translateDataAttributes,

    createLanguageSelector,

    updateLanguageSelector

};


// ============================================================
// START
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    initializeTranslations();
});
