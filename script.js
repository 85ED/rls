document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Carregado - Inicializando funções...');
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initParallax();
    initVideoBackground();
    initObrasSlideshow();
    initParallaxImages();
    console.log('✅ Todas as funções inicializadas!');
});

function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', debounce(function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        updateActiveNav();

        lastScroll = currentScroll;
    }, 10));
}

function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';

            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navToggle.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(8px, 8px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                body.style.overflow = '';

                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });
    });
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.getElementById('navbar').offsetHeight;

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionHeight = section.offsetHeight;

        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#' || href === '') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.stat-item, .segment-card, .service-mini, .service-featured, ' +
        '.process-step, .benefit-card, .differential-item, .client-placeholder, ' +
        '.about-content, .about-image, .efficiency-text, .efficiency-image, .ev-solution-card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

function initParallax() {
    const heroVideo = document.querySelector('.hero-video-container');
    window.addEventListener('scroll', debounce(function() {
        const scrolled = window.pageYOffset;

        if (heroVideo && scrolled < window.innerHeight) {
            const parallaxSpeed = 0.5;
            heroVideo.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    }, 10));
}

function initVideoBackground() {
    const video = document.querySelector('.hero-video');
    if (video) {
        video.addEventListener('loadeddata', function() {
            video.play().catch(err => {
                console.log('Video autoplay failed:', err);
            });
        });

        video.addEventListener('ended', function() {
            video.currentTime = 0;
            video.play();
        });

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        });

        videoObserver.observe(video);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll(
        '.stat-item, .segment-card, .service-mini, .benefit-card'
    );

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        card.addEventListener('mousemove', function(e) {
            if (window.innerWidth > 768) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                if (this.classList.contains('differential-item') ||
                    this.classList.contains('benefit-card')) {
                    this.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }
            }
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

function setVhProperty() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVhProperty();
window.addEventListener('resize', debounce(setVhProperty, 100));

document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
    });
});

function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    console.log('Event tracked:', category, action, label);
}

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const btnText = this.textContent.trim();
        trackEvent('CTA', 'click', btnText);
    });
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            trackEvent('Section', 'view', sectionId);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

document.querySelectorAll('.segment-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.segment-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
    });

    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.segment-icon');
        if (icon) {
            icon.style.transform = '';
        }
    });
});

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent.trim();
                
                const match = text.match(/^(\d+)(.*)/);
                
                if (match) {
                    const number = parseInt(match[1]);
                    const suffix = match[2]; 
                    let current = 0;
                    const increment = number / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= number) {
                            target.textContent = number + suffix;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(current) + suffix;
                        }
                    }, 30);
                }

                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
}

animateStats();

console.log('%c🔧 RLS Engenharia e Consultoria', 'font-size: 20px; font-weight: bold; color: #00d4ff;');
console.log('%cA energia que nos move', 'font-size: 14px; color: #00ff88;');
console.log('%cWebsite desenvolvido com tecnologias modernas | Desenvolvido por CODE85', 'font-size: 12px; color: #4a5568;');

if ('PerformanceObserver' in window) {
    try {
        const perfObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                console.log(`${entry.name}: ${entry.duration}ms`);
            });
        });
        perfObserver.observe({ entryTypes: ['measure'] });
    } catch (e) {
        console.log('Performance monitoring not available');
    }
}

function initObrasSlideshow() {
    const slides = document.querySelectorAll('.hero-slider img');
    
    console.log('🎬 Slideshow - Slides encontrados:', slides.length);
    
    if (slides.length === 0) {
        console.error('❌ Nenhuma imagem encontrada em .hero-slider img');
        return;
    }

    slides.forEach(img => {
        img.onload = () => {
            img.classList.add('loaded');
        };
        
        if (img.complete) {
            img.classList.add('loaded');
        }
    });

    let currentSlide = 0;
    const slideInterval = 4000;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        console.log('📸 Slide atual:', currentSlide + 1);
    }

    console.log('⏱️ Iniciando rotação automática a cada', slideInterval, 'ms');
    setInterval(nextSlide, slideInterval);
}

function initParallaxImages() {
    const parallaxImages = document.querySelectorAll('.parallax-img');

    window.addEventListener('scroll', debounce(function() {
        parallaxImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible) {
                const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const translateY = (scrollPercent - 0.5) * 50;

                img.style.transform = `translateY(${translateY}px)`;
            }
        });
    }, 10));
}