/* =========================================
   PAGE LOADED
========================================= */

document.addEventListener("DOMContentLoaded", async function () {


    /* =================================
       HERO IMAGE SLIDER
    ================================= */

    const slides = document.querySelectorAll(".hero-slide");

    if (slides.length > 0) {

        let currentSlide = 0;

        setInterval(function () {

            slides[currentSlide].classList.remove("active");

            currentSlide =
                (currentSlide + 1) % slides.length;

            slides[currentSlide].classList.add("active");

        }, 3000);

    }


    /* =================================
       SUPABASE JOBS
    ================================= */

    const jobsContainer =
        document.getElementById("jobsContainer");


    if (jobsContainer) {

        await loadJobs();

    }


    /* =================================
       HOME SEARCH
    ================================= */

    const searchInput =
        document.getElementById("searchInput");

    const searchButton =
        document.getElementById("searchButton");


    if (
        searchInput &&
        searchButton &&
        jobsContainer
    ) {

        searchButton.addEventListener(
            "click",
            function () {

                filterJobs();

            }
        );


        searchInput.addEventListener(
            "input",
            function () {

                filterJobs();

            }
        );


        function filterJobs() {

            const search =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const cards =
                jobsContainer.querySelectorAll(
                    ".job-card"
                );


            cards.forEach(function (card) {

                const text =
                    card.textContent
                        .toLowerCase();


                if (text.includes(search)) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        }

    }


    /* =================================
       PAGE TRANSITIONS
    ================================= */

    const links =
        document.querySelectorAll("nav a");


    links.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const target =
                    link.getAttribute("href");


                if (
                    !target ||
                    target === "#" ||
                    target.startsWith("#") ||
                    target.startsWith("http")
                ) {

                    return;

                }


                event.preventDefault();


                document.body.classList.add(
                    "page-leave"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            target;

                    },
                    300
                );

            }
        );

    });


});


/* =========================================
   LOAD JOBS FROM SUPABASE
========================================= */

async function loadJobs() {

    const jobsContainer =
        document.getElementById("jobsContainer");


    if (!jobsContainer) {
        return;
    }


    jobsContainer.innerHTML = `
        <p class="loading-text">
            Loading latest jobs...
        </p>
    `;


    /* Get currently logged-in user */

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();


    /* Check whether user is admin */

    let isAdmin = false;


    if (user) {

        const {
            data: adminStatus,
            error: adminError
        } = await supabaseClient.rpc(
            "is_admin"
        );


        if (
            !adminError &&
            adminStatus === true
        ) {

            isAdmin = true;

        }

    }
const forgotPasswordLink = document.getElementById("forgotPasswordLink");

console.log("Forgot Password element:", forgotPasswordLink);
console.log("Supabase client:", supabaseClient);

if (forgotPasswordLink) {

    forgotPasswordLink.addEventListener("click", async function (event) {

        event.preventDefault();

        console.log("Forgot Password clicked!");

        const email = emailInput.value.trim();

        console.log("Email:", email);

        if (!email) {
            alert("Please enter your email address first.");
            emailInput.focus();
            return;
        }

        alert("Forgot Password code is working!");

        const resetURL =
            "http://127.0.0.1:5500/reset-password.html";

        console.log("Reset URL:", resetURL);

        const { error } =
            await supabaseClient.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: resetURL
                }
            );

        console.log("Supabase reset response:", error);

        if (error) {
            alert("Supabase Error: " + error.message);
            return;
        }

        alert(
            "Password reset link has been sent to your email. Please check your inbox."
        );
    });

}

    /* Get jobs */

    const {
        data: jobs,
        error
    } = await supabaseClient
        .from("jobs")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    /* Database error */

    if (error) {

        console.error(error);


        jobsContainer.innerHTML = `
            <p class="loading-text">
                Unable to load jobs.
            </p>
        `;

        return;

    }


    /* No jobs */

    if (!jobs || jobs.length === 0) {

        jobsContainer.innerHTML = `
            <p class="loading-text">
                No jobs available yet.
            </p>
        `;

        return;

    }


    /* Clear loading message */

    jobsContainer.innerHTML = "";


    /* =================================
       CREATE JOB CARDS
    ================================= */

    jobs.forEach(function (job) {


        /* Multiple locations */

        let locationsText = "Not specified";


        if (
            Array.isArray(job.locations) &&
            job.locations.length > 0
        ) {

            locationsText =
                job.locations.join(", ");

        }


        /* Advertisement image */

        let imageHTML = "";


        if (job.image_url) {

            imageHTML = `
                <div class="job-image-box">

                    <img
                        src="${job.image_url}"
                        alt="Job Advertisement"
                        class="job-ad-image"
                    >

                </div>
            `;

        }


        /* Apply button */

        let applyButton = "";


        if (job.apply_link) {

            applyButton = `
                <a
                    href="${job.apply_link}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="apply-btn"
                >
                    Apply Now
                </a>
            `;

        }


        /* Admin delete button */

        let deleteButton = "";


        if (isAdmin) {

            deleteButton = `
                <button
                    type="button"
                    class="delete-job-btn"
                    data-id="${job.id}"
                >
                    Delete Job
                </button>
            `;

        }


        /* Job title */

        const title =
            job.title ||
            "Job Advertisement";


        /* Create card */

        const card =
            document.createElement("article");


        card.className = "job-card";


        card.innerHTML = `

            ${imageHTML}

            <div class="job-card-content">

                <h3>
                    ${title}
                </h3>


                ${
                    job.department
                    ? `
                        <p>
                            <strong>
                                Department:
                            </strong>
                            ${job.department}
                        </p>
                    `
                    : ""
                }


                ${
                    job.province
                    ? `
                        <p>
                            <strong>
                                Province:
                            </strong>
                            ${job.province}
                        </p>
                    `
                    : ""
                }


                <p>
                    <strong>
                        Location:
                    </strong>
                    ${locationsText}
                </p>


                ${
                    job.category
                    ? `
                        <p>
                            <strong>
                                Category:
                            </strong>
                            ${job.category}
                        </p>
                    `
                    : ""
                }


                ${
                    job.job_type
                    ? `
                        <p>
                            <strong>
                                Job Type:
                            </strong>
                            ${job.job_type}
                        </p>
                    `
                    : ""
                }


                ${
                    job.qualification
                    ? `
                        <p>
                            <strong>
                                Qualification:
                            </strong>
                            ${job.qualification}
                        </p>
                    `
                    : ""
                }


                ${
                    job.last_date
                    ? `
                        <p>
                            <strong>
                                Last Date:
                            </strong>
                            ${job.last_date}
                        </p>
                    `
                    : ""
                }


                ${
                    job.description
                    ? `
                        <p class="job-description">
                            ${job.description}
                        </p>
                    `
                    : ""
                }


                <div class="job-actions">

                    ${applyButton}

                    ${deleteButton}

                </div>

            </div>

        `;


        jobsContainer.appendChild(card);

    });


    /* =================================
       DELETE JOB
    ================================= */

    if (isAdmin) {

        const deleteButtons =
            document.querySelectorAll(
                ".delete-job-btn"
            );


        deleteButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                async function () {

                    const jobId =
                        button.dataset.id;


                    const confirmDelete =
                        confirm(
                            "Are you sure you want to delete this job?"
                        );


                    if (!confirmDelete) {
                        return;
                    }


                    button.disabled = true;

                    button.textContent =
                        "Deleting...";


                    const {
                        error: deleteError
                    } = await supabaseClient
                        .from("jobs")
                        .delete()
                        .eq(
                            "id",
                            jobId
                        );


                    if (deleteError) {

                        console.error(
                            deleteError
                        );


                        alert(
                            "Job could not be deleted."
                        );


                        button.disabled = false;

                        button.textContent =
                            "Delete Job";

                        return;

                    }


                    /* Reload jobs */

                    await loadJobs();

                }
            );

        });

    }

}