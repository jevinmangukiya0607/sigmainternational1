
/* =====================================================
   ELEMENT REFERENCES
===================================================== */

const body =
    document.body;


const header =
    document.getElementById(
        "siteHeader"
    );


const pageProgressBar =
    document.getElementById(
        "pageProgressBar"
    );


const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );


const mobileNavigation =
    document.getElementById(
        "mobileNavigation"
    );


const enquiryModal =
    document.getElementById(
        "enquiryModal"
    );


const footerSigma =
    document.getElementById(
        "footerSigma"
    );



/* =====================================================
   PAGE SCROLL PROGRESS + HEADER
===================================================== */

function updateScrollUI() {


    const scrollTop =
        window.scrollY;


    const scrollableHeight =
        document.documentElement
            .scrollHeight
        -
        window.innerHeight;


    const progress =
        scrollableHeight > 0
            ?
            (
                scrollTop
                /
                scrollableHeight
            )
            * 100
            :
            0;


    if (pageProgressBar) {

        pageProgressBar
            .style
            .width =
            `${progress}%`;

    }


    if (header) {

        header.classList.toggle(
            "scrolled",
            scrollTop > 15
        );

    }

}


window.addEventListener(
    "scroll",
    updateScrollUI,
    {
        passive: true
    }
);


updateScrollUI();



/* =====================================================
   MOBILE NAV OPEN / CLOSE
===================================================== */

function openMobileMenu() {


    if (
        !mobileNavigation
        ||
        !mobileMenuBtn
    ) {
        return;
    }


    mobileNavigation
        .classList
        .add(
            "active"
        );


    mobileMenuBtn
        .classList
        .add(
            "active"
        );


    mobileMenuBtn
        .setAttribute(
            "aria-expanded",
            "true"
        );


    body.classList.add(
        "menu-open"
    );

}



function closeMobileMenu() {


    if (
        !mobileNavigation
        ||
        !mobileMenuBtn
    ) {
        return;
    }


    mobileNavigation
        .classList
        .remove(
            "active"
        );


    mobileMenuBtn
        .classList
        .remove(
            "active"
        );


    mobileMenuBtn
        .setAttribute(
            "aria-expanded",
            "false"
        );


    body.classList.remove(
        "menu-open"
    );

}



if (mobileMenuBtn) {


    mobileMenuBtn.addEventListener(
        "click",
        () => {


            const open =
                mobileNavigation
                    .classList
                    .contains(
                        "active"
                    );


            if (open) {

                closeMobileMenu();

            }

            else {

                openMobileMenu();

            }


        }
    );

}



/* =====================================================
   MOBILE NAV DROPDOWNS
===================================================== */

document
    .querySelectorAll(
        ".mobile-nav-parent"
    )
    .forEach(
        button => {


            button.addEventListener(
                "click",
                () => {


                    const group =
                        button.closest(
                            ".mobile-nav-group"
                        );


                    const alreadyOpen =
                        group
                            .classList
                            .contains(
                                "open"
                            );


                    document
                        .querySelectorAll(
                            ".mobile-nav-group.open"
                        )
                        .forEach(
                            item => {

                                item
                                    .classList
                                    .remove(
                                        "open"
                                    );

                            }
                        );


                    if (!alreadyOpen) {

                        group
                            .classList
                            .add(
                                "open"
                            );

                    }


                }
            );


        }
    );



document
    .querySelectorAll(
        ".mobile-navigation a"
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        }
    );



/* =====================================================
   ENQUIRY MODAL
===================================================== */

function openEnquiryModal() {


    if (!enquiryModal) {
        return;
    }


    closeMobileMenu();


    enquiryModal
        .classList
        .add(
            "active"
        );


    enquiryModal
        .setAttribute(
            "aria-hidden",
            "false"
        );


    body.classList.add(
        "modal-open"
    );


    setTimeout(
        () => {


            const firstInput =
                enquiryModal
                    .querySelector(
                        "input"
                    );


            if (firstInput) {

                firstInput.focus();

            }


        },
        250
    );

}



function closeEnquiryModal() {


    if (!enquiryModal) {
        return;
    }


    enquiryModal
        .classList
        .remove(
            "active"
        );


    enquiryModal
        .setAttribute(
            "aria-hidden",
            "true"
        );


    body.classList.remove(
        "modal-open"
    );

}



document
    .querySelectorAll(
        ".js-open-enquiry"
    )
    .forEach(
        button => {


            button.addEventListener(
                "click",
                event => {


                    event.preventDefault();

                    openEnquiryModal();


                }
            );


        }
    );



document
    .querySelectorAll(
        "[data-close-enquiry]"
    )
    .forEach(
        element => {


            element.addEventListener(
                "click",
                closeEnquiryModal
            );


        }
    );



document.addEventListener(
    "keydown",
    event => {


        if (
            event.key
            ===
            "Escape"
        ) {

            closeEnquiryModal();

            closeMobileMenu();

        }


    }
);



/* =====================================================
   SMOOTH INTERNAL LINKS
===================================================== */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        link => {


            link.addEventListener(
                "click",
                event => {


                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !href
                        ||
                        href === "#"
                    ) {
                        return;
                    }


                    const target =
                        document
                            .querySelector(
                                href
                            );


                    if (!target) {
                        return;
                    }


                    event
                        .preventDefault();


                    target
                        .scrollIntoView({
                            behavior:
                                "smooth",

                            block:
                                "start"
                        });


                    closeMobileMenu();


                }
            );


        }
    );



/* =====================================================
   FAQ
===================================================== */

const faqItems =
    document
        .querySelectorAll(
            ".faq-item"
        );


faqItems.forEach(
    item => {


        const button =
            item.querySelector(
                ".faq-question"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            () => {


                const open =
                    item
                        .classList
                        .contains(
                            "active"
                        );


                faqItems.forEach(
                    other => {

                        other
                            .classList
                            .remove(
                                "active"
                            );

                    }
                );


                if (!open) {

                    item
                        .classList
                        .add(
                            "active"
                        );

                }


            }
        );


    }
);



/* =====================================================
   SCROLL REVEALS
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


const revealObserver =
    new IntersectionObserver(

        entries => {


            entries.forEach(
                entry => {


                    if (
                        !entry
                            .isIntersecting
                    ) {
                        return;
                    }


                    entry
                        .target
                        .classList
                        .add(
                            "visible"
                        );


                    revealObserver
                        .unobserve(
                            entry.target
                        );


                }
            );


        },

        {

            threshold:
                .12,

            rootMargin:
                "0px 0px -35px 0px"

        }

    );


revealElements.forEach(
    element => {

        revealObserver
            .observe(
                element
            );

    }
);



/* =====================================================
   HERO PARALLAX
===================================================== */

const heroImage =
    document.querySelector(
        ".hero-background img"
    );


const motionAllowed =
    !window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


let motionTicking =
    false;



function updateMotion() {


    if (!motionAllowed) {

        motionTicking =
            false;

        return;

    }


    if (heroImage) {


        const heroOffset =
            Math.min(
                window.scrollY
                * .055,
                35
            );


        heroImage
            .style
            .transform =
            `
                    scale(1.035)
                    translate3d(
                        0,
                        ${heroOffset}px,
                        0
                    )
                `;

    }



    if (footerSigma) {


        const rect =
            footerSigma
                .getBoundingClientRect();


        if (
            rect.top
            <
            window.innerHeight
            &&
            rect.bottom
            >
            0
        ) {


            const progress =
                (
                    window.innerHeight
                    -
                    rect.top
                )
                /
                (
                    window.innerHeight
                    +
                    rect.height
                );


            const amount =
                (
                    progress
                    -
                    .5
                )
                * 28;


            footerSigma
                .style
                .setProperty(
                    "--footer-parallax",
                    `${amount}px`
                );


        }


    }


    motionTicking =
        false;

}



if (motionAllowed) {


    window.addEventListener(
        "scroll",
        () => {


            if (
                motionTicking
            ) {
                return;
            }


            motionTicking =
                true;


            requestAnimationFrame(
                updateMotion
            );


        },
        {
            passive: true
        }
    );


}



/* =====================================================
   FORM DEMO
   Replace this with API / CRM connection later.
===================================================== */

document
    .querySelectorAll(
        ".enquiry-form"
    )
    .forEach(
        form => {


            form.addEventListener(
                "submit",
                event => {


                    event
                        .preventDefault();


                    const submit =
                        form
                            .querySelector(
                                ".enquiry-submit"
                            );


                    if (!submit) {
                        return;
                    }


                    const original =
                        submit
                            .innerHTML;


                    submit.disabled =
                        true;


                    submit.innerHTML =
                        "Thank you ✓";


                    setTimeout(
                        () => {


                            form.reset();


                            submit.disabled =
                                false;


                            submit.innerHTML =
                                original;


                            if (
                                form.closest(
                                    ".enquiry-modal"
                                )
                            ) {

                                closeEnquiryModal();

                            }


                        },
                        1600
                    );


                }
            );


        }
    );



/* =====================================================
   CLOSE MOBILE NAV ON DESKTOP RESIZE
===================================================== */

window.addEventListener(
    "resize",
    () => {


        if (
            window.innerWidth
            >
            920
        ) {

            closeMobileMenu();

        }


    }
);


// ABOUT US PAGE START 

/* ================================================================
   ================================================================
   ABOUT SIGMA PAGE
   ================================================================
   ================================================================ */


document.addEventListener("DOMContentLoaded", () => {

    const aboutPage =
        document.body.classList.contains(
            "page-about-sigma"
        );


    if (!aboutPage) return;



    /* ============================================================
       01. HERO IMAGE PARALLAX
    ============================================================ */

    const aboutHeroImage =
        document.querySelector(
            ".about-hero-image"
        );


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        aboutHeroImage &&
        !reducedMotion
    ) {

        let ticking = false;


        function updateAboutHero() {

            const scrollY =
                window.scrollY;


            /*
             * We limit the movement so the image
             * doesn't leave the hero container.
             */

            const movement =
                Math.min(
                    scrollY * 0.11,
                    75
                );


            aboutHeroImage.style.transform =
                `scale(1.04)
                 translate3d(
                    0,
                    ${movement}px,
                    0
                 )`;


            ticking = false;

        }


        window.addEventListener(
            "scroll",
            () => {

                if (!ticking) {

                    window.requestAnimationFrame(
                        updateAboutHero
                    );

                    ticking = true;

                }

            },
            {
                passive: true
            }
        );

    }



    /* ============================================================
       02. LEGACY IMAGE MICRO MOTION
    ============================================================ */

    const legacyVisual =
        document.querySelector(
            ".about-legacy-visual"
        );


    const legacyImage =
        document.querySelector(
            ".about-legacy-visual img"
        );


    if (
        legacyVisual &&
        legacyImage &&
        !reducedMotion
    ) {

        legacyVisual.addEventListener(
            "mousemove",
            event => {

                /*
                 * Very small movement only.
                 * Keeps the interaction premium
                 * instead of feeling gimmicky.
                 */

                const bounds =
                    legacyVisual
                        .getBoundingClientRect();


                const x =
                    (
                        event.clientX -
                        bounds.left
                    ) / bounds.width;


                const y =
                    (
                        event.clientY -
                        bounds.top
                    ) / bounds.height;


                const moveX =
                    (x - 0.5) * 8;


                const moveY =
                    (y - 0.5) * 8;


                legacyImage.style.transform =
                    `scale(1.045)
                     translate3d(
                        ${moveX}px,
                        ${moveY}px,
                        0
                     )`;

            }
        );


        legacyVisual.addEventListener(
            "mouseleave",
            () => {

                legacyImage.style.transform =
                    "scale(1) translate3d(0,0,0)";

            }
        );

    }



    /* ============================================================
       03. PHILOSOPHY STAMP MICRO ROTATION
    ============================================================ */

    const philosophyStamp =
        document.querySelector(
            ".about-philosophy-stamp"
        );


    if (
        philosophyStamp &&
        !reducedMotion
    ) {

        let stampTicking = false;


        window.addEventListener(
            "scroll",
            () => {

                if (stampTicking) return;


                window.requestAnimationFrame(
                    () => {

                        const rect =
                            philosophyStamp
                                .getBoundingClientRect();


                        const viewport =
                            window.innerHeight;


                        if (
                            rect.top < viewport &&
                            rect.bottom > 0
                        ) {

                            const progress =
                                (
                                    viewport -
                                    rect.top
                                ) /
                                (
                                    viewport +
                                    rect.height
                                );


                            const rotation =
                                -8 +
                                progress * 8;


                            philosophyStamp
                                .style
                                .transform =
                                `rotate(
                                    ${rotation}deg
                                )`;

                        }


                        stampTicking = false;

                    }
                );


                stampTicking = true;

            },
            {
                passive: true
            }
        );

    }

});

// ABOUT US PAGE END 