/**
 * Deepak Adhikari - Portfolio JavaScript File
 * Pure Vanilla JavaScript implementation
 * Includes: Preloader, Scrollspy navbar, Canvas Particle Background, 
 * Typing animation, Scroll-reveal triggers, Skills/Stats animations,
 * Project filtering, Testimonials slider, and Form overlays.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Initial State & Preloader Handling
    // ==========================================
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 500); // Brief delay for clean initial reveal
    });

    // Fallback if load event doesn't fire promptly
    setTimeout(() => {
        if (loader.style.visibility !== 'hidden') {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
    }, 2000);

    // ==========================================
    // 2. Cursor Glow Follower
    // ==========================================
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    // ==========================================
    // 3. Navigation Header Styles on Scroll
    // ==========================================
    const header = document.querySelector('.main-header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Call once initially

    // ==========================================
    // 4. Mobile Menu Navigation
    // ==========================================
    const hamburger = document.getElementById('hamburger-menu');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-btn-nav');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    };

    hamburger.addEventListener('click', toggleMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavOverlay.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ==========================================
    // 5. Typing Animation (Pure JavaScript)
    // ==========================================
    const typingSpan = document.getElementById('typing-text');
    const rolesArray = [
        'Technical Team Lead',
        'AI & LLM Architect',
        'Full Stack Developer',
        'Solutions Engineer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const performTyping = () => {
        const currentRole = rolesArray[roleIndex];
        
        if (isDeleting) {
            charIndex--;
            typingSpeed = 50; // Speed up deletion
        } else {
            charIndex++;
            typingSpeed = 100;
        }

        typingSpan.textContent = currentRole.substring(0, charIndex);

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % rolesArray.length;
            typingSpeed = 500; // Brief pause before typing next
        }

        setTimeout(performTyping, typingSpeed);
    };

    if (typingSpan) {
        performTyping();
    }

    // ==========================================
    // 6. Interactive Canvas Particle Background
    // ==========================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const maxParticles = 65;
    const connectionDistance = 115;
    
    // Mouse coords object
    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            // Palette matches accents (cyan, purple, blue)
            const colors = ['rgba(6, 182, 212, 0.4)', 'rgba(124, 58, 237, 0.3)', 'rgba(59, 130, 246, 0.3)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            // Collision with boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            this.x += this.vx;
            this.y += this.vy;

            // Push particles away from mouse pointer slightly
            if (mouse.x != null && mouse.y != null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const forceDirectionX = dx / dist;
                    const forceDirectionY = dy / dist;
                    this.x += forceDirectionX * force * 1.5;
                    this.y += forceDirectionY * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    };
    initParticles();

    // Re-initialize particles on major window size switches to re-distribute
    window.addEventListener('resize', () => {
        if (particles.length === 0) return;
        initParticles();
    });

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Connecting line checks
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < connectionDistance) {
                    // Line opacity map
                    const opacity = (1 - (dist / connectionDistance)) * 0.15;
                    ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    };
    animateParticles();

    // ==========================================
    // 7. Scroll Reveal & Intersection Observer Animations
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal-fade, .scroll-reveal-left, .scroll-reveal-right');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const stats = document.querySelectorAll('.stat-number');

    const revealObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before screen enter
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-reveal-active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Skills progress animation observer
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const percent = fill.getAttribute('data-progress');
                fill.style.width = percent;
                skillObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.1 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Statistics Counter Animation Observer
    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 1500; // Total count milliseconds
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let start = 0;
        const increment = target > 50 ? Math.ceil(target / 100) : 1;

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = start;
            }
        }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // ==========================================
    // 8. Navigation Active State (Scrollspy)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const handleScrollspy = () => {
        const scrollPosition = window.scrollY + 150; // Offset for header trigger

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', handleScrollspy);

    // ==========================================
    // 9. Portfolio Filter Logic
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active style from buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Fade out animation
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9) translateY(15px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 300);
            });
        });
    });

    // ==========================================
    // 10. Testimonials Slider Carousel
    // ==========================================
    const slider = document.getElementById('testimonial-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');
    
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let autoSlideInterval;

    // Create Navigation Dots
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    const updateDots = () => {
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const setSliderPosition = () => {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    const goToSlide = (index) => {
        currentIndex = index;
        setSliderPosition();
        updateDots();
        resetAutoSlide();
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(currentIndex);
    };

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    // Auto Play Interval
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, 7000); // Switch slides every 7s
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    startAutoSlide();

    // Swipe gestures drag logic
    const touchStart = (index) => {
        return function (event) {
            isDragging = true;
            currentIndex = index;
            startPos = getPositionX(event);
            clearInterval(autoSlideInterval);
        };
    };

    const touchMove = (event) => {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            const diff = currentPosition - startPos;
            
            // Move slider slightly with gesture mapping
            const slideWidth = slider.offsetWidth;
            const percentageMove = (diff / slideWidth) * 100;
            const translateVal = -currentIndex * 100 + percentageMove;
            
            slider.style.transform = `translateX(${translateVal}%)`;
        }
    };

    const touchEnd = () => {
        if (isDragging) {
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;
            
            // If moved enough, switch slide
            const threshold = 50;
            const slideWidth = slider.offsetWidth;
            const diff = (slider.style.transform.match(/translateX\((.*?)\)/) || [0, 0])[1];
            const diffNumber = parseFloat(diff);
            
            const expectedPosition = -currentIndex * 100;
            const offset = diffNumber - expectedPosition;

            if (offset > 15 && currentIndex > 0) {
                goToSlide(currentIndex - 1);
            } else if (offset < -15 && currentIndex < slides.length - 1) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex);
            }
            startAutoSlide();
        }
    };

    const getPositionX = (event) => {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    };

    // Add event listeners for slider dragging
    slides.forEach((slide, index) => {
        const slideImg = slide.querySelector('img');
        if(slideImg) {
            slideImg.addEventListener('dragstart', (e) => e.preventDefault());
        }

        // Touch events
        slide.addEventListener('touchstart', touchStart(index), { passive: true });
        slide.addEventListener('touchend', touchEnd);
        slide.addEventListener('touchmove', touchMove, { passive: true });

        // Mouse events
        slide.addEventListener('mousedown', touchStart(index));
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mouseleave', touchEnd);
        slide.addEventListener('mousemove', touchMove);
    });

    // ==========================================
    // 11. Contact Form Management
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const successOverlay = document.getElementById('form-success-overlay');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;

            // Simple loader inside button state
            submitBtn.style.pointerEvents = 'none';
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

            // Simulate form submission API trigger
            setTimeout(() => {
                successOverlay.classList.add('active');
                contactForm.reset();
                
                // Clear active floating label inputs manually
                const inputs = contactForm.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.blur();
                });

                submitBtn.style.pointerEvents = 'auto';
                submitBtn.innerHTML = originalText;
            }, 1200);
        });
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successOverlay.classList.remove('active');
        });
    }

    // ==========================================
    // 12. Back To Top circular Scroll Progress
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');
    const progressCircle = document.querySelector('.progress-ring__circle');
    
    let circumference = 0;
    if (progressCircle) {
        const radius = progressCircle.r.baseVal.value;
        circumference = radius * 2 * Math.PI;

        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
    }

    const setProgress = (percent) => {
        if (!progressCircle) return;
        const offset = circumference - (percent / 100 * circumference);
        progressCircle.style.strokeDashoffset = offset;
    };

    window.addEventListener('scroll', () => {
        // Toggle visibility offset
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }

        // Calculate progress percentage
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY;
        const scrollPercent = Math.min((scrollTop / scrollHeight) * 100, 100);

        setProgress(scrollPercent);
    });

    // ==========================================
    // 13. Certificate & Badge Lightbox Modal
    // ==========================================
    const certModal = document.getElementById('cert-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalTitle = document.getElementById('cert-modal-title');
    const certModalClose = document.getElementById('cert-modal-close');

    if (certModal && certModalImg) {
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.cert-trigger');
            if (trigger) {
                e.preventDefault();
                e.stopPropagation();
                const imgSrc = trigger.getAttribute('data-img');
                const title = trigger.getAttribute('data-title') || 'Verified Credential';
                if (imgSrc) {
                    certModalImg.src = imgSrc;
                    if (certModalTitle) certModalTitle.textContent = title;
                    certModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });

        const closeModal = () => {
            certModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        if (certModalClose) {
            certModalClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
            });
        }

        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

});
