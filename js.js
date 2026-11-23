document.addEventListener("DOMContentLoaded", () => {
    // 1. DYNAMIC CONTENT: Update Copyright Year across all pages
    const yearElements = document.querySelectorAll("#currentYear");
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // 2. DARK / LIGHT MODE WITH LOCALSTORAGE PERSISTENCE
    const themeToggleBtn = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("lesothoTheme") || "light";

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-bs-theme", theme);
        if (themeToggleBtn) {
            themeToggleBtn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
        }
    }

    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-bs-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            localStorage.setItem("lesothoTheme", newTheme);
            applyTheme(newTheme);
        });
    }

    // 3. SEARCH & CATEGORY FILTERING (services.html)
    const searchInput = document.getElementById("destinationSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const destinationCards = document.querySelectorAll(".destination-item");
    const noResultsMsg = document.getElementById("noResultsMessage");

    if (searchInput && destinationCards.length > 0) {
        let activeCategory = "all";

        function filterDestinations() {
            const query = searchInput.value.toLowerCase().trim();
            let visibleCount = 0;

            destinationCards.forEach(card => {
                const category = card.getAttribute("data-category").toLowerCase();
                const text = card.textContent.toLowerCase();
                const matchesCategory = activeCategory === "all" || category === activeCategory;
                const matchesSearch = text.includes(query);

                if (matchesCategory && matchesSearch) {
                    card.classList.remove("d-none");
                    visibleCount++;
                } else {
                    card.classList.add("d-none");
                }
            });

            if (noResultsMsg) {
                noResultsMsg.classList.toggle("d-none", visibleCount > 0);
            }
        }

        searchInput.addEventListener("input", filterDestinations);

        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                filterButtons.forEach(b => b.classList.remove("active", "btn-primary"));
                filterButtons.forEach(b => b.classList.add("btn-outline-primary"));
                btn.classList.remove("btn-outline-primary");
                btn.classList.add("active", "btn-primary");

                activeCategory = btn.getAttribute("data-filter").toLowerCase();
                filterDestinations();
            });
        });
    }

    // 4. JAVASCRIPT TRIP COST CALCULATOR (services.html)
    const calcForm = document.getElementById("tripCalculatorForm");
    if (calcForm) {
        calcForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const lodgeRate = parseFloat(document.getElementById("lodgeSelect").value);
            const nights = parseInt(document.getElementById("numNights").value, 10) || 1;
            const guests = parseInt(document.getElementById("numGuests").value, 10) || 1;
            const addPonyTrek = document.getElementById("ponyTrekCheck").checked;

            let total = lodgeRate * nights * guests;
            if (addPonyTrek) {
                total += 450 * guests;
            }

            const resultBox = document.getElementById("calcResult");
            resultBox.innerHTML = `
                <div class="alert alert-success mt-3 mb-0" role="alert">
                    <strong>Estimated Trip Total: M ${total.toLocaleString()} (LSL)</strong><br>
                    <small>${guests} guest(s) for ${nights} night(s)${addPonyTrek ? " + Guided Pony Trekking" : ""}.</small>
                </div>
            `;
        });
    }
// 5. INTERACTIVE IMAGE GALLERY (gallery.html)

const galleryItems = document.querySelectorAll(".gallery-card");

const previewImage = document.getElementById("previewImage");
const previewTitle = document.getElementById("previewTitle");
const previewDescription = document.getElementById("previewDescription");

const previousButton = document.getElementById("previousImage");
const nextButton = document.getElementById("nextImage");

if (galleryItems.length > 0 && previewImage &&
    previewTitle && previewDescription &&
    previousButton && nextButton) {

    let currentIndex = 0;

    // Function to display the selected image
    function showImage(index) {

        const card = galleryItems[index];

        const image = card.querySelector("img");
        const title = card.querySelector("h3");
        const description = card.querySelector("p");

        previewImage.src = image.src;
        previewImage.alt = image.alt;

        previewTitle.textContent = title.textContent;
        previewDescription.textContent = description.textContent;
    }

    // Select an image by clicking on it
    galleryItems.forEach((card, index) => {

        const image = card.querySelector("img");

        image.style.cursor = "pointer";

        image.addEventListener("click", () => {

            currentIndex = index;
            showImage(currentIndex);

        });

    });

    // Display the previous image
    previousButton.addEventListener("click", () => {

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = galleryItems.length - 1;
        }

        showImage(currentIndex);

    });

    // Display the next image
    nextButton.addEventListener("click", () => {

        currentIndex++;

        if (currentIndex >= galleryItems.length) {
            currentIndex = 0;
        }

        showImage(currentIndex);

    });

}

    // 6. FORM VALIDATION & LOCALSTORAGE SUBMISSION HISTORY (contact.html)
    const contactForm = document.getElementById("enquiryForm");
    const savedEnquiryBox = document.getElementById("savedEnquiryBanner");

    if (savedEnquiryBox) {
        const lastEnquiry = JSON.parse(localStorage.getItem("lastLesothoEnquiry"));
        if (lastEnquiry) {
            savedEnquiryBox.innerHTML = `
                <div class="alert alert-info">
                    <strong>Welcome back, ${lastEnquiry.name}!</strong> Your last enquiry regarding
                    <em>${lastEnquiry.type}</em> was saved on ${lastEnquiry.date}.
                </div>
            `;
        }
    }

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const alertContainer = document.getElementById("contactFormAlert");
            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const enquiryType = document.getElementById("enquiryType").value;
            const message = document.getElementById("message").value.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
            let errors = [];

            if (fullName.length < 2) errors.push("Full Name must be at least 2 characters.");
            if (!emailRegex.test(email)) errors.push("Please enter a valid email address.");
            if (phone !== "" && !phoneRegex.test(phone)) errors.push("Please enter a valid phone number.");
            if (!enquiryType) errors.push("Please select an enquiry category.");
            if (message.length < 10) errors.push("Your message must be at least 10 characters long.");

            if (errors.length > 0) {
                alertContainer.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        <strong>Please fix the following errors:</strong>
                        <ul class="mb-0 mt-1">${errors.map(err => `<li>${err}</li>`).join("")}</ul>
                    </div>
                `;
                return;
            }

            // Save to localStorage
            const submissionRecord = {
                name: fullName,
                email: email,
                type: enquiryType,
                date: new Date().toLocaleDateString()
            };
            localStorage.setItem("lastLesothoEnquiry", JSON.stringify(submissionRecord));

            alertContainer.innerHTML = `
                <div class="alert alert-success" role="alert">
                    <strong>Thank you, ${fullName}!</strong> Your enquiry about <strong>${enquiryType}</strong> has been validated and saved locally.
                </div>
            `;
            contactForm.reset();
        });
    }

    // Feedback Form Validation (contact.html)
    const feedbackForm = document.getElementById("feedbackForm");
    if (feedbackForm) {
        feedbackForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const feedbackAlert = document.getElementById("feedbackFormAlert");
            const rating = document.getElementById("rating").value;
            const feedbackText = document.getElementById("feedback").value.trim();

            if (!rating || feedbackText.length < 5) {
                feedbackAlert.innerHTML = `
                    <div class="alert alert-danger">Please select a rating and enter at least 5 characters of feedback.</div>
                `;
                return;
            }

            feedbackAlert.innerHTML = `
                <div class="alert alert-success">Thank you for rating Discover Lesotho ${rating}/5!</div>
            `;
            feedbackForm.reset();
        });
    }
});