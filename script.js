// ============================================
// NAVIGATION & MENU
// ============================================
(function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link, .cta-button');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Handle active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                    });
                    if (correspondingLink) {
                        correspondingLink.classList.add('active');
                        correspondingLink.setAttribute('aria-current', 'page');
                    }
                }
            });
        });
    }
})();

// ============================================
// HERO SECTION - Scroll Indicator & Animations
// ============================================
(function() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
        
        scrollIndicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollBy({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Intersection Observer for enhanced animation triggers
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.hero-content, .hero-image-wrapper');
    animatedElements.forEach(el => observer.observe(el));
    
    // Parallax effect on mouse move
    const heroImage = document.querySelector('.hero-image');
    const decorations = document.querySelectorAll('.hero-decoration');
    
    if (heroImage) {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            
            if (window.innerWidth > 768) {
                heroImage.style.transform = `translate(${mouseX * 15}px, ${mouseY * 15}px)`;
                
                decorations.forEach((decoration, index) => {
                    const speed = (index + 1) * 10;
                    decoration.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
                });
            }
        });
        
        // Performance optimization: Debounce resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth <= 768) {
                    heroImage.style.transform = '';
                    decorations.forEach(d => {
                        d.style.transform = '';
                    });
                }
            }, 250);
        });
    }
})();

// ============================================
// ABOUT SECTION - Animations & Counters
// ============================================
(function() {
    const observerOption = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observers = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOption);
    
    const animatedElement = document.querySelectorAll(
        '.about-header, .about-text, .about-image-wrapper, .achievements-section, .mission-block, .about-cta'
    );
    
    animatedElement.forEach(el => {
        observers.observe(el);
    });
    
    // Counter Animation for Statistics
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    const animateCounter = (element, target, duration = 5000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current).toLocaleString() + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString() + '+';
            }
        };
        
        updateCounter();
    };
    
    const achievementsObservers = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    setTimeout(() => {
                        animateCounter(stat, target);
                    }, 300);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const achievementsSection = document.querySelector('.achievements-section');
    if (achievementsSection) {
        achievementsObservers.observe(achievementsSection);
    }
    
    // Smooth Scroll for CTA Button
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            const href = ctaButton.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
    
    // Parallax Effect on Image (Desktop Only)
    const aboutImage = document.querySelector('.about-image');
    const aboutSection = document.querySelector('#about');
    
    if (window.innerWidth > 768 && aboutImage && aboutSection) {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const sectionTop = aboutSection.offsetTop;
                    const sectionHeight = aboutSection.offsetHeight;
                    
                    if (scrolled > sectionTop - window.innerHeight && 
                        scrolled < sectionTop + sectionHeight) {
                        const offset = (scrolled - sectionTop) * 0.1;
                        aboutImage.style.transform = `translateY(${offset}px)`;
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        });
    }
    
    // Performance: Pause animations when not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            animatedElement.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            animatedElement.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    });
})();

// ============================================
// SERVICES SECTION
// ============================================
(function() {
    const servicesObserverConfig = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const servicesScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('olawale-service-visible');
            }
        });
    }, servicesObserverConfig);

    // Observe all service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(serviceCard => {
        servicesScrollObserver.observe(serviceCard);
    });

    // Smooth scroll for service section links
    const serviceLinks = document.querySelectorAll('.service-btn[href^="#"]');
    serviceLinks.forEach(serviceLink => {
        serviceLink.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
})();

// ============================================
// TESTIMONIALS SECTION
// ============================================
(function() {
    const olawaleTestimonialsTrackElement = document.getElementById('olawaleTestimonialsTrack');
    const olawaleTestimonialsPrevButton = document.getElementById('olawaleTestimonialsPrev');
    const olawaleTestimonialsNextButton = document.getElementById('olawaleTestimonialsNext');
    const olawaleTestimonialsDotsContainer = document.getElementById('olawaleTestimonialsDots');
    const olawaleTestimonialCards = document.querySelectorAll('.olawale-testimonial-card');
    
    // Exit if elements don't exist
    if (!olawaleTestimonialsTrackElement || !olawaleTestimonialCards.length) {
        return;
    }
    
    let olawaleCurrentTestimonialIndex = 0;
    const olawaleTestimonialsTotalCount = olawaleTestimonialCards.length;

    // Create dots
    for (let dotIndex = 0; dotIndex < olawaleTestimonialsTotalCount; dotIndex++) {
        const dotElement = document.createElement('div');
        dotElement.classList.add('olawale-testimonials-dot');
        if (dotIndex === 0) dotElement.classList.add('olawale-testimonials-dot-active');
        dotElement.addEventListener('click', () => olawaleGoToTestimonial(dotIndex));
        olawaleTestimonialsDotsContainer.appendChild(dotElement);
    }

    const olawaleTestimonialDots = document.querySelectorAll('.olawale-testimonials-dot');

    function olawaleUpdateTestimonialSlider() {
        olawaleTestimonialsTrackElement.style.transform = `translateX(-${olawaleCurrentTestimonialIndex * 100}%)`;
        
        olawaleTestimonialDots.forEach((dot, dotIdx) => {
            dot.classList.toggle('olawale-testimonials-dot-active', dotIdx === olawaleCurrentTestimonialIndex);
        });

        olawaleTestimonialsPrevButton.classList.toggle('olawale-testimonials-disabled', olawaleCurrentTestimonialIndex === 0);
        olawaleTestimonialsNextButton.classList.toggle('olawale-testimonials-disabled', olawaleCurrentTestimonialIndex === olawaleTestimonialsTotalCount - 1);
    }

    function olawaleGoToTestimonial(targetIndex) {
        olawaleCurrentTestimonialIndex = targetIndex;
        olawaleUpdateTestimonialSlider();
    }

    function olawaleNextTestimonial() {
        if (olawaleCurrentTestimonialIndex < olawaleTestimonialsTotalCount - 1) {
            olawaleCurrentTestimonialIndex++;
            olawaleUpdateTestimonialSlider();
        }
    }

    function olawaleePrevTestimonial() {
        if (olawaleCurrentTestimonialIndex > 0) {
            olawaleCurrentTestimonialIndex--;
            olawaleUpdateTestimonialSlider();
        }
    }

    olawaleTestimonialsNextButton.addEventListener('click', olawaleNextTestimonial);
    olawaleTestimonialsPrevButton.addEventListener('click', olawaleePrevTestimonial);

    // Auto-play functionality
    let olawaleTestimonialsAutoPlayInterval;

    function olawaleStartAutoPlay() {
        olawaleTestimonialsAutoPlayInterval = setInterval(() => {
            if (olawaleCurrentTestimonialIndex < olawaleTestimonialsTotalCount - 1) {
                olawaleNextTestimonial();
            } else {
                olawaleCurrentTestimonialIndex = 0;
                olawaleUpdateTestimonialSlider();
            }
        }, 6000);
    }

    function olawaleStopAutoPlay() {
        clearInterval(olawaleTestimonialsAutoPlayInterval);
    }

    olawaleStartAutoPlay();

    const olawaleTestimonialsSection = document.querySelector('.olawale-testimonials-wrapper');
    if (olawaleTestimonialsSection) {
        olawaleTestimonialsSection.addEventListener('mouseenter', olawaleStopAutoPlay);
        olawaleTestimonialsSection.addEventListener('mouseleave', olawaleStartAutoPlay);
    }

    // Touch/swipe support
    let olawaleTestimonialTouchStartX = 0;
    let olawaleTestimonialTouchEndX = 0;

    olawaleTestimonialsTrackElement.addEventListener('touchstart', (touchEvent) => {
        olawaleTestimonialTouchStartX = touchEvent.changedTouches[0].screenX;
        olawaleStopAutoPlay();
    });

    olawaleTestimonialsTrackElement.addEventListener('touchend', (touchEvent) => {
        olawaleTestimonialTouchEndX = touchEvent.changedTouches[0].screenX;
        olawaleHandleTestimonialSwipe();
        olawaleStartAutoPlay();
    });

    function olawaleHandleTestimonialSwipe() {
        const swipeThreshold = 50;
        if (olawaleTestimonialTouchStartX - olawaleTestimonialTouchEndX > swipeThreshold) {
            olawaleNextTestimonial();
        }
        if (olawaleTestimonialTouchEndX - olawaleTestimonialTouchStartX > swipeThreshold) {
            olawaleePrevTestimonial();
        }
    }

    // Keyboard navigation - scoped to avoid conflicts
    const olawaleTestimonialsWrapper = document.querySelector('.olawale-testimonials-wrapper');
    if (olawaleTestimonialsWrapper) {
        document.addEventListener('keydown', (keyEvent) => {
            // Only respond if testimonials section is in view
            const rect = olawaleTestimonialsWrapper.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInView) {
                if (keyEvent.key === 'ArrowLeft') {
                    olawaleePrevTestimonial();
                } else if (keyEvent.key === 'ArrowRight') {
                    olawaleNextTestimonial();
                }
            }
        });
    }

    olawaleUpdateTestimonialSlider();

    // Intersection Observer for scroll animations
    const olawaleTestimonialsObserverConfig = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const olawaleTestimonialsScrollObserver = new IntersectionObserver((observedItems) => {
        observedItems.forEach(observedItem => {
            if (observedItem.isIntersecting) {
                observedItem.target.style.animationPlayState = 'running';
            }
        });
    }, olawaleTestimonialsObserverConfig);

    olawaleTestimonialCards.forEach(cardElement => {
        olawaleTestimonialsScrollObserver.observe(cardElement);
    });
})();

// ============================================
// FOOTER - Back to Top
// ============================================
(function() {
    const olawaleBackToTopJS = document.getElementById('olawaleBackToTopBtnElement');
    
    if (olawaleBackToTopJS) {
        olawaleBackToTopJS.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                olawaleBackToTopJS.style.opacity = '1';
                olawaleBackToTopJS.style.pointerEvents = 'auto';
            } else {
                olawaleBackToTopJS.style.opacity = '0.7';
                olawaleBackToTopJS.style.pointerEvents = 'auto';
            }
        });
    }
})();















        (function() {
            const olawaleBackToTopJS = document.getElementById('olawaleBackToTopBtnElement');
            
            if (olawaleBackToTopJS) {
                olawaleBackToTopJS.addEventListener('click', function() {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });

                // Optional: Show/hide button based on scroll position
                window.addEventListener('scroll', function() {
                    if (window.pageYOffset > 300) {
                        olawaleBackToTopJS.style.opacity = '1';
                        olawaleBackToTopJS.style.pointerEvents = 'auto';
                    } else {
                        olawaleBackToTopJS.style.opacity = '0.7';
                        olawaleBackToTopJS.style.pointerEvents = 'auto';
                    }
                });
            }
        })();