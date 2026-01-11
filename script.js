/* ========================================
   SANGAMESH BIRADAR PORTFOLIO
   JavaScript Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initScrollAnimations();
    initFAQ();
    initReactionGame();
    initSmoothScroll();
});

/* ========================================
   NAVIGATION
   ======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect for navbar
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Active link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Stagger animation for grouped elements
    const staggerGroups = document.querySelectorAll('.projects-grid, .skills-content, .certifications-grid');
    
    staggerGroups.forEach(group => {
        const children = group.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

/* ========================================
   FAQ ACCORDION
   ======================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items (accordion behavior)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = null;
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
}

/* ========================================
   REACTION TIME GAME
   ======================================== */
function initReactionGame() {
    const gameDisplay = document.getElementById('game-display');
    const gameText = document.getElementById('game-text');
    const bestTimeEl = document.getElementById('best-time');
    const lastTimeEl = document.getElementById('last-time');
    const attemptsEl = document.getElementById('attempts');
    
    let gameState = 'idle'; // idle, waiting, ready, result
    let startTime = 0;
    let timeoutId = null;
    let bestTime = localStorage.getItem('reactionBestTime') || null;
    let attempts = parseInt(localStorage.getItem('reactionAttempts')) || 0;
    
    // Initialize display
    if (bestTime) {
        bestTimeEl.textContent = `${bestTime}ms`;
    }
    attemptsEl.textContent = attempts;
    
    function startGame() {
        gameState = 'waiting';
        gameDisplay.className = 'game-display waiting';
        gameText.textContent = 'Wait for green...';
        
        // Random delay between 1-5 seconds
        const delay = Math.random() * 4000 + 1000;
        
        timeoutId = setTimeout(() => {
            gameState = 'ready';
            gameDisplay.className = 'game-display ready';
            gameText.textContent = 'Click Now!';
            startTime = performance.now();
        }, delay);
    }
    
    function handleClick() {
        if (gameState === 'idle' || gameState === 'result') {
            startGame();
        } else if (gameState === 'waiting') {
            // Clicked too soon
            clearTimeout(timeoutId);
            gameState = 'result';
            gameDisplay.className = 'game-display too-soon';
            gameText.textContent = 'Too soon! Click to try again';
        } else if (gameState === 'ready') {
            // Calculate reaction time
            const reactionTime = Math.round(performance.now() - startTime);
            gameState = 'result';
            gameDisplay.className = 'game-display';
            gameText.textContent = `${reactionTime}ms - Click to try again`;
            
            // Update stats
            attempts++;
            attemptsEl.textContent = attempts;
            lastTimeEl.textContent = `${reactionTime}ms`;
            localStorage.setItem('reactionAttempts', attempts);
            
            if (!bestTime || reactionTime < bestTime) {
                bestTime = reactionTime;
                bestTimeEl.textContent = `${bestTime}ms`;
                localStorage.setItem('reactionBestTime', bestTime);
            }
        }
    }
    
    gameDisplay.addEventListener('click', handleClick);
    
    // Prevent accidental double-clicks
    gameDisplay.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Debounce function for performance
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ========================================
   OPTIONAL: CURSOR EFFECT
   ======================================== */
// Uncomment below for custom cursor effect

/*
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}
*/

/* ========================================
   OPTIONAL: TYPING EFFECT
   ======================================== */
// Uncomment for hero title typing effect

/*
function initTypingEffect() {
    const title = document.querySelector('.hero-title');
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    typeWriter();
}
*/

/* ========================================
   PAGE LOAD COMPLETE
   ======================================== */
window.addEventListener('load', () => {
    // Remove loading state if any
    document.body.classList.add('loaded');
    
    // Log welcome message
    console.log('%cSangamesh Biradar Portfolio', 'font-size: 24px; font-weight: bold; color: #1A1A1A;');
    console.log('%cBuilt with passion and precision', 'font-size: 14px; color: #7A7A7A;');
});
