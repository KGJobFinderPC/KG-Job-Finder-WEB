/*==================================================
                    RESET
==================================================*/

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    width: 100%;
    min-height: 100vh;

    font-family: 'Poppins', sans-serif;

    background:
        linear-gradient(
            135deg,
            #050816 0%,
            #0f172a 55%,
            #1e293b 100%
        );

    color: #ffffff;

    overflow-x: hidden;
}


/*==================================================
                APPLICATIONS PAGE
==================================================*/

.applications-page {

    position: relative;

    width: 100%;
    min-height: 100vh;

    padding-bottom: 30px;

    background:
        radial-gradient(
            circle at 10% 10%,
            rgba(212,175,55,.07),
            transparent 28%
        ),

        radial-gradient(
            circle at 90% 85%,
            rgba(49,46,129,.20),
            transparent 32%
        ),

        linear-gradient(
            135deg,
            #050816,
            #0f172a 55%,
            #17134a
        );
}


/*==================================================
                    OVERLAY
==================================================*/

.overlay {
    display: none;
}


/*==================================================
                    TOP BAR
==================================================*/

.top-bar {

    position: relative;

    z-index: 100;

    width: 100%;
    max-width: 1200px;

    margin: 0 auto;

    padding: 28px 30px 10px;

    display: flex;

    justify-content: space-between;
    align-items: center;

    gap: 20px;
}


/*==================================================
                    LOGO
==================================================*/

.logo h1 {

    font-size: 3.2rem;

    line-height: .9;

    font-weight: 900;

    background:
        linear-gradient(
            #ffffff,
            #fff5c4,
            #ffd700,
            #d4af37,
            #8b6508
        );

    background-clip: text;

    -webkit-background-clip: text;

    color: transparent;

    -webkit-text-fill-color: transparent;
}

.logo span {

    display: block;

    margin-top: 5px;

    color: #e6c765;

    letter-spacing: 6px;

    font-weight: 700;

    font-size: .72rem;
}


/*==================================================
                DASHBOARD BUTTON
==================================================*/

.back-btn {

    display: flex;

    align-items: center;
    justify-content: center;

    gap: 8px;

    min-width: 120px;

    height: 42px;

    padding: 0 16px;

    border:
        1px solid
        rgba(255,216,77,.18);

    border-radius: 11px;

    text-decoration: none;

    color: #ffffff;

    background:
        rgba(5,8,22,.65);

    font-size: .78rem;

    font-weight: 600;

    transition: .25s ease;

    backdrop-filter: blur(10px);

    -webkit-backdrop-filter: blur(10px);
}

.back-btn i {

    color: #ffd84d;

    font-size: .75rem;

    transition: .25s ease;
}

.back-btn:hover {

    background:
        linear-gradient(
            145deg,
            #ffe88a,
            #d4af37
        );

    border-color:
        #ffd700;

    color: #111111;

    transform:
        translateY(-2px);

    box-shadow:
        0 8px 22px
        rgba(212,175,55,.20);
}

.back-btn:hover i {

    color: #111111;
}


/*==================================================
                    PAGE TITLE
==================================================*/

.page-title {

    position: relative;

    z-index: 100;

    width: 100%;
    max-width: 1120px;

    margin: 0 auto;

    padding: 20px 30px 15px;

    text-align: center;
}

.page-title h2 {

    font-size: 2rem;

    line-height: 1.2;

    color: #ffd84d;

    margin-bottom: 6px;

    font-weight: 800;
}

.page-title p {

    color: #94a3b8;

    font-size: .80rem;

    margin-bottom: 12px;
}


/*==================================================
            APPLICATION CONTAINER
==================================================*/

.applications-container {

    position: relative;

    z-index: 100;

    width: 100%;
    max-width: 1120px;

    margin: 15px auto 0;

    padding: 0 30px 35px;

    display: grid;

    grid-template-columns:
        repeat(2, minmax(0, 1fr));

    gap: 13px;
}


/*==================================================
            APPLICATION CARD
==================================================*/

.application-card {

    position: relative;

    min-height: 215px;

    padding: 18px;

    border:
        1px solid
        rgba(255,216,77,.13);

    border-radius: 15px;

    background:
        linear-gradient(
            145deg,
            rgba(15,23,42,.88),
            rgba(8,12,27,.80)
        );

    backdrop-filter: blur(12px);

    -webkit-backdrop-filter: blur(12px);

    transition: .25s ease;

    overflow: hidden;

    box-shadow:
        0 8px 22px
        rgba(0,0,0,.15);
}


/*==================================================
                GOLD SIDE LINE
==================================================*/

.application-card::before {

    content: "";

    position: absolute;

    left: 0;
    top: 0;

    width: 2px;
    height: 100%;

    background:
        linear-gradient(
            180deg,
            #ffe88a,
            #ffd700,
            #8b6508
        );

    opacity: .65;
}


/*==================================================
                    HOVER
==================================================*/

.application-card:hover {

    transform:
        translateY(-3px);

    border-color:
        rgba(255,216,77,.35);

    box-shadow:
        0 14px 30px
        rgba(0,0,0,.28),

        0 0 18px
        rgba(212,175,55,.06);
}


/*==================================================
                APPLICATION TITLE
==================================================*/

.application-card h3 {

    color: #ffd84d;

    font-size: 1.02rem;

    line-height: 1.3;

    margin-bottom: 4px;

    font-weight: 700;
}


/*==================================================
                    COMPANY
==================================================*/

.application-card h4 {

    color: #ffd84d;

    font-size: .75rem;

    margin-bottom: 12px;

    font-weight: 600;
}


/*==================================================
                    INFORMATION
==================================================*/

.application-card p {

    color: #94a3b8;

    margin-bottom: 7px;

    font-size: .70rem;

    line-height: 1.45;
}

.application-card p i {

    color: #d4af37;

    margin-right: 6px;

    font-size: .68rem;
}


/*==================================================
                    STATUS
==================================================*/

.status {

    display: inline-flex;

    align-items: center;
    justify-content: center;

    margin-top: 5px;

    margin-bottom: 12px;

    padding: 5px 11px;

    border-radius: 20px;

    font-size: .66rem;

    font-weight: 700;

    background:
        rgba(255,216,77,.12);

    border:
        1px solid
        rgba(255,216,77,.20);

    color: #ffd84d;
}


/*==================================================
                    PENDING
==================================================*/

.status.pending {

    background: #f39c12 !important;

    border-color: #fbbf24 !important;

    color: #111111 !important;
}


/*==================================================
                    ACCEPTED
==================================================*/

.status.accepted {

    background: #16a34a !important;

    border-color: #22c55e !important;

    color: #ffffff !important;
}


/*==================================================
                    REJECTED
==================================================*/

.status.rejected {

    background: #b00020 !important;

    border-color: #ef4444 !important;

    color: #ffffff !important;
}


/*==================================================
                    INTERVIEW
==================================================*/

.status.interview {

    background: #2563eb !important;

    border-color: #3b82f6 !important;

    color: #ffffff !important;
}


/*==================================================
            APPLICATION BUTTONS
==================================================*/

.application-buttons {

    display: flex;

    gap: 8px;

    margin-top: 8px;

    flex-wrap: wrap;
}


/*==================================================
                VIEW DETAILS
==================================================*/

.view-details-button,
.view-btn {

    flex: 1;

    min-width: 120px;

    height: 36px;

    padding: 0 12px;

    border: 1px solid #22c55e;

    border-radius: 9px;

    background: #16a34a;

    color: #ffffff;

    font-family: 'Poppins', sans-serif;

    font-size: .70rem;

    font-weight: 700;

    cursor: pointer;

    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 6px;

    transition: .25s ease;
}

.view-details-button i,
.view-btn i {

    color: #ffffff;
}

.view-details-button:hover,
.view-btn:hover {

    transform:
        translateY(-2px);

    background: #15803d;

    border-color:
        #22c55e;

    color: #ffffff;

    box-shadow:
        0 8px 20px
        rgba(22,163,74,.35);
}


/*==================================================
                    DELETE
==================================================*/

.delete-application-button,
.delete-btn {

    flex: 1;

    min-width: 100px;

    height: 36px;

    padding: 0 12px;

    border:
        1px solid
        #ef4444;

    border-radius: 9px;

    background:
        #b00020;

    color:
        #ffffff;

    font-family: 'Poppins', sans-serif;

    font-size: .70rem;

    font-weight: 700;

    cursor: pointer;

    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 6px;

    transition: .25s ease;
}

.delete-application-button i,
.delete-btn i {

    color: #ffffff;
}

.delete-application-button:hover,
.delete-btn:hover {

    transform:
        translateY(-2px);

    background:
        #8f001a;

    border-color:
        #ff4d4d;

    color: #ffffff;

    box-shadow:
        0 8px 20px
        rgba(176,0,32,.35);
}


/*==================================================
                    LOADING
==================================================*/

.loading-message {

    grid-column: 1 / -1;

    min-height: 150px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    gap: 10px;

    color: #94a3b8;

    border:
        1px solid
        rgba(255,216,77,.10);

    border-radius: 15px;

    background:
        rgba(5,8,22,.55);
}

.loading-message i {

    color: #ffd84d;

    font-size: 1.25rem;
}

.loading-message p {

    font-size: .75rem;
}


/*==================================================
                NO APPLICATIONS
==================================================*/

.no-applications {

    grid-column: 1 / -1;

    min-height: 170px;

    padding: 30px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    text-align: center;

    border:
        1px solid
        rgba(255,216,77,.12);

    border-radius: 15px;

    background:
        linear-gradient(
            145deg,
            rgba(15,23,42,.88),
            rgba(8,12,27,.80)
        );

    box-shadow:
        0 8px 22px
        rgba(0,0,0,.15);
}

.no-applications h3 {

    color: #ffd84d;

    font-size: 1rem;

    margin-bottom: 6px;
}

.no-applications p {

    color: #94a3b8;

    font-size: .72rem;
}


/*==================================================
                    TABLET
==================================================*/

@media (max-width: 900px) {

    .top-bar {

        padding:
            25px 25px 10px;
    }

    .page-title {

        padding:
            18px 25px 12px;
    }

    .applications-container {

        padding:
            0 25px 30px;
    }
}


/*==================================================
                    MOBILE
==================================================*/

@media (max-width: 650px) {

    .top-bar {

        flex-direction: column;

        align-items: stretch;

        gap: 14px;

        padding:
            60px 16px 10px;
    }

    .logo {

        text-align: center;
    }

    .logo h1 {

        font-size:
            2.7rem;
    }

    .logo span {

        font-size:
            .63rem;

        letter-spacing:
            5px;
    }

    .back-btn {

        width: 100%;
    }

    .page-title {

        padding:
            18px 16px 10px;
    }

    .page-title h2 {

        font-size:
            1.55rem;
    }

    .page-title p {

        font-size:
            .70rem;
    }

    .applications-container {

        grid-template-columns:
            1fr;

        gap:
            10px;

        padding:
            0 16px 25px;

        margin-top:
            12px;
    }

    .application-card {

        min-height:
            190px;

        padding:
            15px;

        border-radius:
            13px;
    }

    .application-card h3 {

        font-size:
            .95rem;
    }

    .application-card h4 {

        font-size:
            .70rem;

        margin-bottom:
            10px;
    }

    .application-card p {

        font-size:
            .66rem;

        margin-bottom:
            5px;
    }

    .application-buttons {

        gap:
            7px;
    }

    .view-details-button,
    .view-btn,
    .delete-application-button,
    .delete-btn {

        height:
            35px;

        font-size:
            .66rem;
    }

    .no-applications {

        min-height:
            150px;

        padding:
            22px;
    }
}


/*==================================================
                SMALL MOBILE
==================================================*/

@media (max-width: 380px) {

    .top-bar {

        padding-top:
            55px;
    }

    .logo h1 {

        font-size:
            2.35rem;
    }

    .page-title h2 {

        font-size:
            1.35rem;
    }

    .application-card {

        min-height:
            180px;

        padding:
            13px;
    }

    .application-card h3 {

        font-size:
            .90rem;
    }

    .application-card p {

        font-size:
            .62rem;
    }

    .view-details-button,
    .view-btn,
    .delete-application-button,
    .delete-btn {

        min-width:
            90px;

        height:
            34px;

        font-size:
            .62rem;
    }
}


/*==================================================
                    END
==================================================*/