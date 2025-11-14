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











         (function() {
            // Smooth scroll to next section
            const kwameScrollDownBtn = document.getElementById('kwameScrollDownBtn_Element');
            const diasporaExploreBtn = document.querySelector('.primaryCTABtn_Explore');
            
            if (kwameScrollDownBtn) {
                kwameScrollDownBtn.addEventListener('click', diasporaSmoothScrollToNext);
                kwameScrollDownBtn.addEventListener('keydown', function(keyboardEvent) {
                    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                        keyboardEvent.preventDefault();
                        diasporaSmoothScrollToNext();
                    }
                });
            }

            if (diasporaExploreBtn) {
                diasporaExploreBtn.addEventListener('click', function(clickEvent) {
                    const targetHref = this.getAttribute('href');
                    if (targetHref && targetHref.startsWith('#')) {
                        clickEvent.preventDefault();
                        const targetElement = document.querySelector(targetHref);
                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        } else {
                            // If target doesn't exist, scroll one viewport down
                            diasporaSmoothScrollToNext();
                        }
                    }
                });
            }

            function diasporaSmoothScrollToNext() {
                window.scrollBy({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            }

            // Parallax effect for floating shapes (desktop only)
            if (window.innerWidth > 768) {
                const ghanaFloatingShapes = document.querySelectorAll('.kwameFloatingShape_Circle');
                let diasporaMousePositionX = 0;
                let diasporaMousePositionY = 0;

                document.addEventListener('mousemove', function(mouseEvent) {
                    diasporaMousePositionX = (mouseEvent.clientX / window.innerWidth - 0.5) * 2;
                    diasporaMousePositionY = (mouseEvent.clientY / window.innerHeight - 0.5) * 2;

                    ghanaFloatingShapes.forEach(function(shapeElement, shapeIndex) {
                        const moveSpeed = (shapeIndex + 1) * 8;
                        shapeElement.style.transform = `translate(${diasporaMousePositionX * moveSpeed}px, ${diasporaMousePositionY * moveSpeed}px)`;
                    });
                });
            }

            // Performance: Hide scroll indicator on scroll
            let kwameScrollTimeout;
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 100 && kwameScrollDownBtn) {
                    kwameScrollDownBtn.style.opacity = '0';
                    kwameScrollDownBtn.style.pointerEvents = 'none';
                }
                
                clearTimeout(kwameScrollTimeout);
                kwameScrollTimeout = setTimeout(function() {
                    if (window.pageYOffset <= 100 && kwameScrollDownBtn) {
                        kwameScrollDownBtn.style.opacity = '1';
                        kwameScrollDownBtn.style.pointerEvents = 'auto';
                    }
                }, 150);
            });

            // Intersection Observer for enhanced animations
            const ghanaAnimationObserverConfig = {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            };

            const kwameIntersectionObserver = new IntersectionObserver(function(observedEntries) {
                observedEntries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                    }
                });
            }, ghanaAnimationObserverConfig);

            // Observe animated elements
            const diasporaAnimatedElements = document.querySelectorAll(
                '.diasporaTextBlock_Container, .heroVisualCard_Container'
            );
            
            diasporaAnimatedElements.forEach(function(element) {
                kwameIntersectionObserver.observe(element);
            });
        })();












        (function() {
            const kwameConceptObserverConfig = {
                threshold: 0.15,
                rootMargin: '0px 0px -80px 0px'
            };

            const diasporaConceptScrollObserver = new IntersectionObserver(function(observedEntries) {
                observedEntries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                    }
                });
            }, kwameConceptObserverConfig);

            // Observe all animated elements in concept section
            const ghanaConceptAnimatedElements = document.querySelectorAll(
                '.conceptVisionHeader_Wrapper, .conceptTextBlock_Column, .conceptVisualFrame_Column, .motivationalQuote_Callout, .trustPillars_Section'
            );

            ghanaConceptAnimatedElements.forEach(function(element) {
                diasporaConceptScrollObserver.observe(element);
            });

            // Counter animation for stats
            const kwameStatsNumberElements = document.querySelectorAll('.singleStat_Item strong');
            let diasporaStatsAnimated = false;

            const afroLinkStatsObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting && !diasporaStatsAnimated) {
                        diasporaStatsAnimated = true;
                        
                        kwameStatsNumberElements.forEach(function(statElement) {
                            const originalText = statElement.textContent;
                            const hasPercentage = originalText.includes('%');
                            const hasDollar = originalText.includes('$');
                            const hasPlus = originalText.includes('+');
                            const numericValue = parseInt(originalText.replace(/[^0-9]/g, ''));
                            
                            if (!isNaN(numericValue) && numericValue > 0) {
                                let currentValue = 0;
                                const increment = numericValue / 50;
                                
                                const counterInterval = setInterval(function() {
                                    currentValue += increment;
                                    if (currentValue >= numericValue) {
                                        clearInterval(counterInterval);
                                        statElement.textContent = originalText;
                                    } else {
                                        let displayText = Math.ceil(currentValue).toString();
                                        if (hasDollar) displayText = '$' + displayText;
                                        if (hasPercentage) displayText += '%';
                                        if (hasPlus) displayText += '+';
                                        statElement.textContent = displayText;
                                    }
                                }, 30);
                            }
                        });
                    }
                });
            }, { threshold: 0.5 });

            const statsCardElement = document.querySelector('.conceptStatsCard_Overlay');
            if (statsCardElement) {
                afroLinkStatsObserver.observe(statsCardElement);
            }

            // Parallax effect for decorative patterns (desktop only)
            if (window.innerWidth > 768) {
                const conceptSection = document.querySelector('.diasporaConceptBridge_Block');
                
                window.addEventListener('scroll', function() {
                    const sectionTop = conceptSection.offsetTop;
                    const scrollPosition = window.pageYOffset;
                    
                    if (scrollPosition > sectionTop - window.innerHeight && 
                        scrollPosition < sectionTop + conceptSection.offsetHeight) {
                        const offset = (scrollPosition - sectionTop) * 0.15;
                        conceptSection.style.backgroundPosition = `center ${offset}px`;
                    }
                });
            }

            // Hover enhancement for pillar cards
            const pillarCards = document.querySelectorAll('.singlePillar_Card');
            pillarCards.forEach(function(card) {
                card.addEventListener('mouseenter', function() {
                    this.style.borderColor = 'rgba(244, 180, 0, 0.6)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.borderColor = 'rgba(244, 180, 0, 0.1)';
                });
            });

            // Smooth scroll enhancement for internal links
            document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
                anchor.addEventListener('click', function(e) {
                    const targetHref = this.getAttribute('href');
                    if (targetHref && targetHref !== '#') {
                        const targetElement = document.querySelector(targetHref);
                        if (targetElement) {
                            e.preventDefault();
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }
                });
            });
        })();











        (function() {
            'use strict';
            
            // ============================================
            // Intersection Observer for Scroll Animations
            // ============================================
            const ghanaEstateObserverConfig = {
                threshold: 0.15,
                rootMargin: '0px 0px -80px 0px'
            };
            
            const diasporaPropertyAnimationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('afroEstateVisible_State');
                    }
                });
            }, ghanaEstateObserverConfig);
            
            // Observe header
            const ghanaPropertyHeaderElement = document.querySelector('.ghanaPropertyInvest_Header');
            if (ghanaPropertyHeaderElement) {
                diasporaPropertyAnimationObserver.observe(ghanaPropertyHeaderElement);
            }
            
            // Observe investment cards with staggered delay
            const ghanaInvestmentCards = document.querySelectorAll('.ghanaEstateCard_Block');
            ghanaInvestmentCards.forEach((card, index) => {
                card.style.transitionDelay = `${index * 0.15}s`;
                diasporaPropertyAnimationObserver.observe(card);
            });
            
            // Observe footer section
            const ghanaInvestFooterElement = document.querySelector('.ghanaInvestmentFooter_Info');
            if (ghanaInvestFooterElement) {
                diasporaPropertyAnimationObserver.observe(ghanaInvestFooterElement);
            }
            
            // ============================================
            // Enhanced Card Hover Interactions
            // ============================================
            ghanaInvestmentCards.forEach(card => {
                // Add subtle parallax effect on mouse move
                card.addEventListener('mousemove', (e) => {
                    const cardRect = card.getBoundingClientRect();
                    const cardCenterX = cardRect.left + cardRect.width / 2;
                    const cardCenterY = cardRect.top + cardRect.height / 2;
                    
                    const mouseX = e.clientX - cardCenterX;
                    const mouseY = e.clientY - cardCenterY;
                    
                    const rotateX = (mouseY / cardRect.height) * 5;
                    const rotateY = (mouseX / cardRect.width) * -5;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
                });
                
                // Reset transform on mouse leave
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });
            
            // ============================================
            // Smooth Scroll for Internal Links
            // ============================================
            const diasporaCTAButtons = document.querySelectorAll('a[href^="#"]');
            diasporaCTAButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const href = button.getAttribute('href');
                    
                    if (href !== '#' && href.startsWith('#')) {
                        e.preventDefault();
                        const targetElement = document.querySelector(href);
                        
                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }
                });
            });
            
            // ============================================
            // Track CTA Button Clicks (Analytics Ready)
            // ============================================
            const allGhanaCTAButtons = document.querySelectorAll('.diasporaPropertyCTA_Btn, .whatsappDirectCTA_Button');
            
            allGhanaCTAButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const buttonText = this.textContent.trim();
                    const buttonHref = this.getAttribute('href');
                    
                    // Console log for tracking (replace with actual analytics in production)
                    console.log('Ghana Real Estate CTA Clicked:', {
                        buttonText: buttonText,
                        buttonHref: buttonHref,
                        timestamp: new Date().toISOString()
                    });
                    
                    // Example: Send to Google Analytics
                    // if (typeof gtag !== 'undefined') {
                    //     gtag('event', 'cta_click', {
                    //         'event_category': 'Ghana Real Estate',
                    //         'event_label': buttonText,
                    //         'value': 1
                    //     });
                    // }
                });
            });
            
            // ============================================
            // Add Micro-Interactions to Feature Checkmarks
            // ============================================
            const featureListItems = document.querySelectorAll('.africanEstateFeature_Item');
            
            const featureItemObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                        }, index * 100);
                    }
                });
            }, { threshold: 0.5 });
            
            featureListItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                item.style.transition = 'all 0.4s ease';
                featureItemObserver.observe(item);
            });
            
            // ============================================
            // Dynamic Badge Animation on Scroll
            // ============================================
            const securityBadge = document.querySelector('.africanEstateSecure_Badge');
            
            if (securityBadge) {
                const badgeObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            securityBadge.style.animation = 'pulseBadge 2s ease-in-out infinite';
                        }
                    });
                }, { threshold: 0.8 });
                
                badgeObserver.observe(securityBadge);
            }
            
            // Add pulse animation dynamically
            const pulseStyleSheet = document.createElement('style');
            pulseStyleSheet.textContent = `
                @keyframes pulseBadge {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(244, 180, 0, 0.4);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 0 0 10px rgba(244, 180, 0, 0);
                    }
                }
            `;
            document.head.appendChild(pulseStyleSheet);
            
            // ============================================
            // Performance: Pause animations when not visible
            // ============================================
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    ghanaInvestmentCards.forEach(card => {
                        card.style.animationPlayState = 'paused';
                    });
                } else {
                    ghanaInvestmentCards.forEach(card => {
                        card.style.animationPlayState = 'running';
                    });
                }
            });
            
            // ============================================
            // Add Loading Animation for Images (if real images used)
            // ============================================
            const propertyImageContainers = document.querySelectorAll('.diasporaPropertyImage_Container img');
            
            propertyImageContainers.forEach(img => {
                img.addEventListener('load', function() {
                    this.style.opacity = '0';
                    this.style.animation = 'fadeInImage 0.8s ease forwards';
                });
            });
            
            // Add fade-in animation for images
            const imageAnimationStyle = document.createElement('style');
            imageAnimationStyle.textContent = `
                @keyframes fadeInImage {
                    from {
                        opacity: 0;
                        transform: scale(1.1);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `;
            document.head.appendChild(imageAnimationStyle);
            
            // ============================================
            // Responsive: Disable 3D transforms on mobile
            // ============================================
            function disableMobile3DEffects() {
                if (window.innerWidth <= 768) {
                    ghanaInvestmentCards.forEach(card => {
                        card.removeEventListener('mousemove', () => {});
                        card.style.transform = '';
                    });
                }
            }
            
            // Check on load and resize
            disableMobile3DEffects();
            
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    disableMobile3DEffects();
                }, 250);
            });
            
            // ============================================
            // Accessibility: Announce new content to screen readers
            // ============================================
            const announceToScreenReader = (message) => {
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.className = 'sr-only';
                announcement.textContent = message;
                
                document.body.appendChild(announcement);
                
                setTimeout(() => {
                    document.body.removeChild(announcement);
                }, 1000);
            };
            
            // Announce when cards become visible
            ghanaInvestmentCards.forEach((card, index) => {
                const cardObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const cardTitle = card.querySelector('.ghanaEstateCardTitle_Heading').textContent;
                            announceToScreenReader(`Investment opportunity: ${cardTitle} is now visible`);
                        }
                    });
                }, { threshold: 0.8 });
                
                cardObserver.observe(card);
            });
            
            // ============================================
            // Add Screen Reader Only Class for Accessibility
            // ============================================
            const srOnlyStyle = document.createElement('style');
            srOnlyStyle.textContent = `
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border-width: 0;
                }
            `;
            document.head.appendChild(srOnlyStyle);
            console.log('✅ Ghana Real Estate Investment Section Initialized Successfully');
            console.log(`📊 Total Investment Cards: ${ghanaInvestmentCards.length}`);
            console.log(`🔗 Total CTA Buttons: ${allGhanaCTAButtons.length}`);
            
        })();











        const diasporaShowcase_ObserverConfig_9xZ = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const diasporaShowcase_AnimateCards_7kP = new IntersectionObserver(function(diasporaShowcase_Entries_4mL) {
            diasporaShowcase_Entries_4mL.forEach(function(diasporaShowcase_Entry_2nQ) {
                if (diasporaShowcase_Entry_2nQ.isIntersecting) {
                    diasporaShowcase_Entry_2nQ.target.classList.add('diasporaShowcase_Visible');
                }
            });
        }, diasporaShowcase_ObserverConfig_9xZ);
        
        // Observe all product cards
        document.addEventListener('DOMContentLoaded', function() {
            const diasporaShowcase_AllCards_5hR = document.querySelectorAll('.mrMrsBrandCard_Uni');
            diasporaShowcase_AllCards_5hR.forEach(function(diasporaShowcase_Card_8wT) {
                diasporaShowcase_AnimateCards_7kP.observe(diasporaShowcase_Card_8wT);
            });
        });











        // Toggle for Team section
const toggleBtn = document.getElementById('toggleBtnn');
const teamGrid = document.getElementById('teamGrid');
let isTeamExpanded = false;

if (toggleBtn && teamGrid) {
    toggleBtn.addEventListener('click', function() {
        isTeamExpanded = !isTeamExpanded;
        
        if (isTeamExpanded) {
            teamGrid.classList.add('team-expanded');
            toggleBtn.textContent = 'See Less';
            
            setTimeout(() => {
                const firstHiddenCard = teamGrid.querySelector('.olawale-about-team-member-profile-box:nth-child(4)');
                if (firstHiddenCard) {
                    firstHiddenCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 100);
        } else {
            teamGrid.classList.remove('team-expanded');
            toggleBtn.textContent = 'See More';
            teamGrid.closest('.olawale-about-team-showcase-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Toggle for Patrons section
const togglePatronsBtn = document.getElementById('togglePatronsBtn');
const patronsGrid = document.getElementById('patronsGrid');
let isPatronsExpanded = false;

if (togglePatronsBtn && patronsGrid) {
    togglePatronsBtn.addEventListener('click', function() {
        isPatronsExpanded = !isPatronsExpanded;
        
        if (isPatronsExpanded) {
            patronsGrid.classList.add('team-expanded');
            togglePatronsBtn.textContent = 'See Less';
            
            setTimeout(() => {
                const firstHiddenCard = patronsGrid.querySelector('.olawale-about-team-member-profile-box:nth-child(4)');
                if (firstHiddenCard) {
                    firstHiddenCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 100);
        } else {
            patronsGrid.classList.remove('team-expanded');
            togglePatronsBtn.textContent = 'See More';
            patronsGrid.closest('.olawale-about-team-showcase-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}






        