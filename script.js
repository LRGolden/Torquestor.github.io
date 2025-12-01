// Force page to top on load using different methods
window.addEventListener('load', function() {
    // Method 1: Scroll to top
    window.scrollTo(0, 0);

    // Method 2: Set body scrollTop
    if (document.body.scrollTop) document.body.scrollTop = 0;
    if (document.documentElement.scrollTop) document.documentElement.scrollTop = 0;
});

document.addEventListener('DOMContentLoaded', function () {
    // Clear any hash from URL if present
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    // Small delay to ensure page is at top
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 50);

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Update ARIA attributes
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function (e) {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Don't interfere with # links
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll-reveal animations
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.1, // Element is 10% in view
        rootMargin: "0px 0px -50px 0px" // Start animation 50px before element reaches bottom of viewport
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Image Carousel for Hero Section
    const carouselImages = document.querySelectorAll('.carousel-img');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.indicator');
    let currentImageIndex = 0;
    let autoSlideInterval;

    function showSlide(index) {
        // Remove active class from current slide
        carouselImages[currentImageIndex].classList.remove('active');
        if (indicators[currentImageIndex]) {
            indicators[currentImageIndex].classList.remove('active');
        }

        // Update to new slide
        currentImageIndex = index;
        // Force reflow to ensure smooth transition
        void carouselImages[currentImageIndex].offsetWidth;
        carouselImages[currentImageIndex].classList.add('active');
        if (indicators[currentImageIndex]) {
            indicators[currentImageIndex].classList.add('active');
        }
    }

    function showNextImage() {
        let nextIndex = (currentImageIndex + 1) % carouselImages.length;
        showSlide(nextIndex);
    }

    function showPrevImage() {
        let prevIndex = (currentImageIndex - 1 + carouselImages.length) % carouselImages.length;
        showSlide(prevIndex);
    }

    // Auto-advance carousel
    function startAutoSlide() {
        if (carouselImages.length > 1) {
            autoSlideInterval = setInterval(showNextImage, 5000); // Change image every 5 seconds
        }
    }

    // Stop auto-advance on hover or focus to prevent conflicts with user interaction
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
        
        // Add click event to advance to next image
        carouselContainer.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            showNextImage();
            startAutoSlide(); // Restart the auto slide after user interaction
        });
        
        // Add keyboard support for accessibility
        carouselContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                clearInterval(autoSlideInterval);
                showNextImage();
                startAutoSlide(); // Restart the auto slide after user interaction
            }
        });
    }

    // Event listeners for manual controls (kept for indicators)
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering container click
            clearInterval(autoSlideInterval);
            showPrevImage();
            startAutoSlide(); // Restart the auto slide after user interaction
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering container click
            clearInterval(autoSlideInterval);
            showNextImage();
            startAutoSlide(); // Restart the auto slide after user interaction
        });
    }

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering container click
            clearInterval(autoSlideInterval);
            showSlide(index);
            startAutoSlide(); // Restart the auto slide after user interaction
        });
    });

    // Initialize carousel
    startAutoSlide();

    // Legal content functionality
    const legalLinks = document.querySelectorAll('.legal-link');
    const legalOverlay = document.getElementById('legal-overlay');
    const legalTitle = document.getElementById('legal-title');
    const legalText = document.getElementById('legal-text');
    const closeLegalBtn = document.getElementById('close-legal');

    // Privacy Policy content
    const privacyPolicyContent = `
        <h3>Privacy Policy</h3>
        <p>Effective Date: November 30, 2025</p>

        <h3>Information We Collect</h3>
        <p>Torquestor does not collect, store, or share any personal information from users. The application operates locally on your device and does not require an internet connection for its primary functionality.</p>

        <h3>Use of the Application</h3>
        <p>Torquestor is designed to optimize images for video game development. All processed files remain locally on your system and are not transmitted to any external server.</p>

        <h3>Technical Data</h3>
        <p>In case of errors or failures, the application may collect anonymous technical information about the operating system, application version, and types of processed files to improve the user experience. This information does not contain personally identifiable data.</p>

        <h3>Information Sharing</h3>
        <p>We do not share your personal information with third parties, as we do not collect such information. We do not use cookies or similar technologies to track your activity.</p>

        <h3>Security</h3>
        <p>We take appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of information under our control.</p>

        <h3>Changes to This Policy</h3>
        <p>We may update this Privacy Policy periodically. We will notify you about significant changes through a notification within the application or on this page.</p>

        <h3>Trademark Statement</h3>
        <p>Torquestor does not own or claim rights to third-party trademarks mentioned in the application or on this website, including but not limited to platform names such as Microsoft Store, Play Store, Epic Games Store, Steam, or game engines like Unreal Engine, Unity, Godot, among others. These marks are property of their respective owners and are mentioned solely for descriptive purposes regarding the application's export and icon functionalities.</p>

        <h3>Contact</h3>
        <p>If you have questions about this Privacy Policy, you can contact us through the Torquestor page on itch.io.</p>
    `;

    // Terms of Service content
    const termsOfServiceContent = `
        <h3>Terms of Service</h3>
        <p>Effective Date: November 30, 2025</p>

        <h3>Acceptance of Terms</h3>
        <p>By downloading, installing, or using Torquestor, you agree to comply with these Terms of Service. If you do not agree with these terms, you should not use the application.</p>

        <h3>Description of Service</h3>
        <p>Torquestor is an image optimization tool for video game developers. The application provides functions to compress, convert, resize, and create icons from image files.</p>

        <h3>Use of Application</h3>
        <p>You agree to use Torquestor only for legal purposes and in compliance with all applicable laws. You should not use the application to process images you don't own or for which you don't have explicit permission.</p>

        <h3>Intellectual Property</h3>
        <p>Torquestor and all its contents, features, and functionalities are property of the developer and are protected by copyright laws and other intellectual property laws.</p>

        <h3>Trademark Statement</h3>
        <p>Torquestor does not own or claim rights to third-party trademarks mentioned in the application or on this website, including but not limited to platform names such as Microsoft Store, Play Store, Epic Games Store, Steam, or game engines like Unreal Engine, Unity, Godot, among others. These marks are property of their respective owners and are mentioned solely for descriptive purposes regarding the application's export and icon functionalities.</p>

        <h3>Warranties and Liability</h3>
        <p>The application is provided "as is", without warranty of any kind, express or implied. We do not warrant that the operation of the application will be uninterrupted or error-free.</p>

        <h3>Limitation of Liability</h3>
        <p>In no event shall Torquestor be liable for any indirect, incidental, special, or consequential damages arising from the use of the application.</p>

        <h3>Modifications</h3>
        <p>We reserve the right to modify these terms at any time. Continued use of the application after such changes constitutes acceptance of the new terms.</p>

        <h3>Contact</h3>
        <p>For questions about these Terms of Service, you can contact us through the Torquestor page on itch.io.</p>
    `;

    // Add event listeners to legal links
    legalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const contentType = this.getAttribute('data-content');

            if (contentType === 'privacy') {
                legalTitle.textContent = 'Privacy Policy';
                legalText.innerHTML = privacyPolicyContent;
            } else if (contentType === 'terms') {
                legalTitle.textContent = 'Terms of Service';
                legalText.innerHTML = termsOfServiceContent;
            }

            // Show the overlay with animation
            legalOverlay.style.display = 'flex'; // Ensure display is set to flex before adding active class
            setTimeout(() => {
                legalOverlay.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close button functionality
    closeLegalBtn.addEventListener('click', function() {
        legalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling

        // Optional: Add a small delay before completely hiding to allow animation
        setTimeout(() => {
            if (!legalOverlay.classList.contains('active')) {
                legalOverlay.style.display = 'none';
            }
        }, 300);
    });

    // Close when clicking on the overlay background
    legalOverlay.addEventListener('click', function(e) {
        if (e.target === legalOverlay) {
            legalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && legalOverlay.classList.contains('active')) {
            legalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});