// Dennis Heba Portfolio - Enhanced Dynamic JavaScript
(function() {
    'use strict';

    // Ignore reduced motion for particle network - always animate
    const prefersReducedMotion = false; // Disabled to ensure particle animation always runs
    
    // Loading state
    let isLoading = true;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
            console.log('Initializing portfolio...');
        console.log('Particle animation enabled with full motion');
        
        try {
            // Add loading indicator
            addLoadingIndicator();
            
            // Always create the parallax background (particle network included)
            createParallaxBackground();
            
            // Initialize components with error handling
            setupScrollEffects(); // Always enable scroll effects now
            setupSmoothScrolling();
            setupSkillModals();
            setupIntersectionObservers();
            setupFloatingNav();
            setupScrollProgress();
            
            // Remove loading indicator after initialization
            removeLoadingIndicator();
            console.log('Portfolio initialization complete');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
            removeLoadingIndicator();
        }
    }
    
    // Loading indicator functions
    function addLoadingIndicator() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.setAttribute('aria-hidden', 'true');
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(loader);
    }
    
    function removeLoadingIndicator() {
        isLoading = false;
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    }

    // Create parallax background with geometric shapes and particles
    function createParallaxBackground() {
        console.log('Creating parallax background...');
        const container = document.querySelector('.parallax-container');
        if (!container) {
            console.error('Parallax container not found!');
            return;
        }
        console.log('Parallax container found:', container);
        
        try {
            // Create particle network canvas first (behind everything)
            createParticleNetwork(container);

        // Create geometric shapes layer
        const geoLayer = document.createElement('div');
        geoLayer.className = 'parallax-layer geometric-bg';
        
        // Add geometric shapes
        const shapes = ['◆', '●', '■', '▲', '◆', '●'];
        for (let i = 0; i < 6; i++) {
            const shape = document.createElement('div');
            shape.className = 'geo-shape';
            shape.textContent = shapes[i];
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            shape.style.fontSize = (Math.random() * 100 + 50) + 'px';
            shape.style.color = '#667eea';
            geoLayer.appendChild(shape);
        }
        container.appendChild(geoLayer);

        // Create gradient orbs
        const orbsLayer = document.createElement('div');
        orbsLayer.className = 'parallax-layer';
        
        const orb1 = document.createElement('div');
        orb1.className = 'gradient-orb purple';
        orb1.style.width = '400px';
        orb1.style.height = '400px';
        orb1.style.left = '10%';
        orb1.style.top = '20%';
        orbsLayer.appendChild(orb1);
        
        const orb2 = document.createElement('div');
        orb2.className = 'gradient-orb pink';
        orb2.style.width = '300px';
        orb2.style.height = '300px';
        orb2.style.right = '10%';
        orb2.style.bottom = '20%';
        orbsLayer.appendChild(orb2);
        
        container.appendChild(orbsLayer);

        // Create particle field
        const particleLayer = document.createElement('div');
        particleLayer.className = 'parallax-layer';
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particleLayer.appendChild(particle);
        }
        container.appendChild(particleLayer);
        } catch (error) {
            console.error('Error creating parallax background:', error);
        }
    }
    
    // Create interactive particle network
    function createParticleNetwork(container) {
        console.log('Creating particle network...');
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-network';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        container.appendChild(canvas);
        console.log('Canvas added to container');
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        let mouseX = -1000;
        let mouseY = -1000;
        let scrollProgress = 0;
        let isAnimating = true; // Track animation state
        
        // Resize canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class
        class Particle {
            constructor() {
                this.reset();
                // Random initial position
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
            
            reset() {
                this.baseX = Math.random() * canvas.width;
                this.baseY = Math.random() * canvas.height;
                this.x = this.baseX;
                this.y = this.baseY;
                this.vx = (Math.random() - 0.5) * 0.3; // Slower, more graceful movement
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.3;
            }
            
            update() {
                // Always animate movement - no reduced motion check
                // Update base position with drift movement
                this.baseX += this.vx;
                this.baseY += this.vy;
                
                // Bounce off edges
                if (this.baseX < 0 || this.baseX > canvas.width) {
                    this.vx *= -1;
                    this.baseX = Math.max(0, Math.min(canvas.width, this.baseX));
                }
                if (this.baseY < 0 || this.baseY > canvas.height) {
                    this.vy *= -1;
                    this.baseY = Math.max(0, Math.min(canvas.height, this.baseY));
                }
                
                // Apply scroll-based zoom effect - reduced rate
                const zoomFactor = 1 + scrollProgress * 2; // Reduced from 3 to 2
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                
                // Move particles away from center as scroll increases
                const dx = this.baseX - centerX;
                const dy = this.baseY - centerY;
                
                // Apply zoom to drifting base position
                this.x = centerX + dx * zoomFactor;
                this.y = centerY + dy * zoomFactor;
                
                // Keep particles visible but fade slightly on scroll
                if (this.x < -100 || this.x > canvas.width + 100 || 
                    this.y < -100 || this.y > canvas.height + 100) {
                    this.opacity = 0;
                } else {
                    // More gradual fade - keep minimum visibility
                    const baseFade = Math.max(0.3, 1 - scrollProgress * 0.4);
                    this.opacity = (0.4 + Math.random() * 0.3) * baseFade;
                }
            }
            
            draw() {
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = '#667eea';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Initialize particles
        function initParticles() {
            particles = [];
            const baseCount = 150; // Increased density
            // Reduce particles on mobile but keep it dense
            const count = window.innerWidth < 768 ? baseCount * 0.7 : baseCount;
            
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
            console.log(`Initialized ${count} particles`);
        }
        initParticles();
        
        // Draw connections between particles - denser mesh
        function drawConnections() {
            const baseMaxDistance = 200; // Increased connection distance for denser mesh
            const maxDistance = baseMaxDistance * Math.max(0.6, 1 - scrollProgress * 0.2);
            
            for (let i = 0; i < particles.length; i++) {
                // Skip particles with very low opacity
                if (particles[i].opacity < 0.05) continue;
                
                // Track connections for this particle to create constellation effect
                let connections = 0;
                const maxConnections = 8; // Each particle can connect to up to 8 others
                
                for (let j = i + 1; j < particles.length; j++) {
                    if (particles[j].opacity < 0.05 || connections >= maxConnections) continue;
                    
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        connections++;
                        // More visible connections with gradient based on distance
                        const distanceFactor = 1 - (distance / maxDistance);
                        const opacity = distanceFactor * 0.4 * Math.max(0.4, 1 - scrollProgress * 0.4);
                        
                        // Gradient color based on distance
                        ctx.globalAlpha = opacity;
                        ctx.strokeStyle = distance < maxDistance * 0.5 ? '#667eea' : '#8b9fff';
                        ctx.lineWidth = distance < maxDistance * 0.3 ? 0.8 : 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                
                // Connect to mouse position with stronger effect
                if (mouseX > 0 && mouseY > 0) {
                    const dx = particles[i].x - mouseX;
                    const dy = particles[i].y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) { // Increased mouse interaction range
                        const opacity = (1 - distance / 150) * 0.6 * Math.max(0.4, 1 - scrollProgress * 0.3);
                        ctx.globalAlpha = opacity;
                        ctx.strokeStyle = '#f56565';
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Animation loop
        function animate() {
            if (!isAnimating) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections
            drawConnections();
            
            animationId = requestAnimationFrame(animate);
        }
        
        // Start animation (always run, but respect reduced motion)
        console.log('Starting particle animation...');
        animate();
        
        // Track mouse movement (only in hero section)
        document.addEventListener('mousemove', (e) => {
            const heroSection = document.querySelector('.hero');
            const rect = heroSection.getBoundingClientRect();
            
            if (e.clientY < rect.bottom) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            } else {
                mouseX = -1000;
                mouseY = -1000;
            }
        });
        
        // Update scroll progress for zoom effect
        function updateScrollProgress() {
            const scrolled = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            // Calculate progress based on entire document height, not just first viewport
            scrollProgress = Math.min(1, scrolled / (documentHeight - windowHeight));
            
            // Keep more particles visible longer
            const targetCount = Math.max(20, Math.floor((1 - scrollProgress * 0.7) * particles.length));
            if (particles.length > targetCount) {
                particles.forEach((particle, index) => {
                    if (index >= targetCount) {
                        // Gradual fade instead of instant hide
                        particle.opacity *= 0.95;
                    }
                });
            }
        }
        
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
        
        // Setup toggle switch functionality
        const toggle = document.getElementById('particleToggle');
        if (toggle) {
            console.log('Setting up particle toggle...');
            
            // Set initial state
            toggle.checked = true;
            
            toggle.addEventListener('change', (e) => {
                isAnimating = e.target.checked;
                console.log('Particle animation:', isAnimating ? 'ON' : 'OFF');
                
                if (isAnimating) {
                    // Resume animation
                    animate();
                    canvas.style.opacity = '0.9';
                } else {
                    // Stop animation and fade out
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                    canvas.style.opacity = '0';
                }
            });
        }
        
        // Return control functions
        return {
            start: () => {
                isAnimating = true;
                animate();
            },
            stop: () => {
                isAnimating = false;
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            },
            toggle: (state) => {
                isAnimating = state;
                if (state) {
                    animate();
                } else if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        };
    }

    // Simplified scroll effects - removed animation frame for stability
    function setupScrollEffects() {
        // No longer checking for reduced motion - always enable
        
        // Cache DOM elements
        const layers = document.querySelectorAll('.parallax-layer');
        const heroContent = document.querySelector('.hero-content');
        const geoShapes = document.querySelectorAll('.geo-shape');
        const orbs = document.querySelectorAll('.gradient-orb');
        
        // Throttle scroll events
        let ticking = false;
        
        function updateScrollEffects() {
            if (ticking) return;
            ticking = true;
            
            requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            
            // Simple parallax for layers
            layers.forEach((layer, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            });
            
            // Hero content - fade effect only, no vertical movement
            if (heroContent) {
                // Ensure opacity returns to 1 when scrolled back to top
                const heroOpacity = Math.max(0, Math.min(1, 1 - (scrolled / 500)));
                heroContent.style.opacity = heroOpacity;
            }
            
            // Gentle rotation for geometric shapes
            geoShapes.forEach((shape, index) => {
                const rotation = scrolled * (0.05 + index * 0.02);
                shape.style.transform = `rotate(${rotation}deg)`;
            });
            
            // Subtle scale for orbs
            orbs.forEach((orb, index) => {
                const scale = 1 + Math.sin(scrolled * 0.001 + index) * 0.03;
                orb.style.transform = `scale(${scale})`;
            });
            
            ticking = false;
            });
        }
        
        // Direct scroll event without animation frame for stability
        window.addEventListener('scroll', updateScrollEffects, { passive: true });
        window.addEventListener('resize', updateScrollEffects, { passive: true });
        
        // Initial call
        updateScrollEffects();
    }
    
    // Scroll progress bar
    function setupScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;
        
        function updateProgress() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrolled = window.pageYOffset;
            const progress = (scrolled / (documentHeight - windowHeight)) * 100;
            progressBar.style.width = progress + '%';
        }
        
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }
    
    // Floating navigation
    function setupFloatingNav() {
        const floatingNav = document.querySelector('.floating-nav');
        const heroSection = document.querySelector('.hero');
        if (!floatingNav || !heroSection) return;
        
        let ticking = false;
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const sections = document.querySelectorAll('.section');
        const navLinks = floatingNav.querySelectorAll('a');
        
        function updateFloatingNav() {
            const scrollY = window.pageYOffset;
            
            // Show/hide based on scroll position
            if (scrollY > heroBottom - 100) {
                floatingNav.classList.add('visible');
            } else {
                floatingNav.classList.remove('visible');
            }
            
            // Update active state - improved detection
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const scrollBottom = scrollY + windowHeight;
            
            // Check if we're at the bottom of the page (for Contact section)
            if (scrollBottom >= docHeight - 50) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#contact') {
                        link.classList.add('active');
                    }
                });
            } else {
                // Improved section detection - check which section's top is closest to viewport top
                let closestSection = null;
                let closestDistance = Infinity;
                
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const sectionTop = rect.top;
                    
                    // Check if section top is at or above viewport center
                    if (sectionTop <= windowHeight * 0.5 && Math.abs(sectionTop) < closestDistance) {
                        closestDistance = Math.abs(sectionTop);
                        closestSection = section;
                    }
                });
                
                if (closestSection) {
                    const id = closestSection.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateFloatingNav);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Add a small delay after navigation clicks to update highlighting correctly
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', () => {
                setTimeout(updateFloatingNav, 100);
            });
        });
        
        updateFloatingNav();
    }
    
    // Enhanced intersection observers for scroll animations
    function setupIntersectionObservers() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements immediately
            document.querySelectorAll('.section-title, .about-card, .skill-card, .experience-item').forEach(el => {
                el.classList.add('visible', 'animated');
            });
            return;
        }
        
        // Section animations
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Animate section title
                        const title = entry.target.querySelector('.section-title');
                        if (title) {
                            setTimeout(() => {
                                title.classList.add('visible');
                            }, 100);
                        }
                        
                        // Animate cards with stagger - fixed to prevent flickering
                        const cards = entry.target.querySelectorAll('.about-card, .skill-card, .experience-item');
                        cards.forEach((card, cardIndex) => {
                            // Only add animation if not already animated
                            if (!card.classList.contains('animated')) {
                                setTimeout(() => {
                                    card.classList.add('animated');
                                }, 100 + cardIndex * 100);
                            }
                        });
                        
                        entry.target.classList.add('section-visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        
        document.querySelectorAll('.section').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Smooth scrolling for navigation links
    function setupSmoothScrolling() {
        // Force smooth scrolling globally
        document.documentElement.style.setProperty('scroll-behavior', 'smooth', 'important');
        document.body.style.setProperty('scroll-behavior', 'smooth', 'important');
        
        // Override any CSS scroll-snap that might interfere
        document.documentElement.style.setProperty('scroll-snap-type', 'none', 'important');
        document.body.style.setProperty('scroll-snap-type', 'none', 'important');
        
        // Remove scroll snap from all sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.setProperty('scroll-snap-align', 'none', 'important');
            section.style.setProperty('scroll-snap-stop', 'normal', 'important');
        });
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Calculate position with a small offset for better visual alignment
                    const offset = 20; // Small offset from top
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    // Create a smooth custom scroll animation
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const absDistance = Math.abs(distance);
                    
                    // Calculate duration based on distance
                    // Minimum 400ms for short distances, maximum 1500ms for long distances
                    // Base speed: ~1000 pixels per second
                    const baseDuration = absDistance / 1.5; // pixels / (pixels per ms)
                    const duration = Math.min(1500, Math.max(400, baseDuration));
                    
                    let start = null;
                    
                    function smoothScroll(timestamp) {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const percentage = Math.min(progress / duration, 1);
                        
                        // Easing function for smoother animation
                        const easeInOutCubic = percentage < 0.5
                            ? 4 * percentage * percentage * percentage
                            : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
                        
                        window.scrollTo(0, startPosition + distance * easeInOutCubic);
                        
                        if (progress < duration) {
                            requestAnimationFrame(smoothScroll);
                        } else {
                            // Update URL after animation completes
                            if (history.pushState) {
                                history.pushState(null, null, targetId);
                            }
                        }
                    }
                    
                    requestAnimationFrame(smoothScroll);
                }
            });
        });
    }


    // Setup skill modals with improved accessibility
    function setupSkillModals() {
        const skillCards = document.querySelectorAll('.skill-card');
        const modal = document.getElementById('skillModal');
        const modalClose = document.querySelector('.skill-modal-close');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        if (!modal || !modalTitle || !modalContent) {
            console.warn('Modal elements not found');
            return;
        }
        
        let lastFocusedElement = null;
        
        skillCards.forEach(card => {
            // Add keyboard support
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View details about ${card.querySelector('h3').textContent}`);
            
            const openModal = () => {
                const skill = card.dataset.skill;
                const content = getSkillContent(skill);
                
                // Store last focused element for restoration
                lastFocusedElement = document.activeElement;
                
                // Add loading state
                modal.classList.add('loading');
                modalTitle.textContent = 'Loading...';
                modalContent.innerHTML = '<div class="modal-loader"></div>';
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Simulate content loading (in real app, this might be an API call)
                setTimeout(() => {
                    modal.classList.remove('loading');
                    modalTitle.textContent = content.title;
                    modalContent.innerHTML = content.body;
                    
                    // Focus management for accessibility
                    modalClose.focus();
                    
                    // Trap focus within modal
                    trapFocus(modal);
                }, 200);
            };
            
            card.addEventListener('click', openModal);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal();
                }
            });
        });
        
        modalClose?.addEventListener('click', closeModal);
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
        
        function closeModal() {
            modal.classList.remove('active');
            modal.classList.remove('loading');
            document.body.style.overflow = '';
            
            // Restore focus to last focused element
            if (lastFocusedElement) {
                lastFocusedElement.focus();
                lastFocusedElement = null;
            }
            
            // Remove focus trap
            removeFocusTrap();
        }
        
        // Focus trap for modal accessibility
        function trapFocus(element) {
            const focusableElements = element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            function handleTabKey(e) {
                if (e.key !== 'Tab') return;
                
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
            
            element.addEventListener('keydown', handleTabKey);
            element._handleTabKey = handleTabKey;
        }
        
        function removeFocusTrap() {
            if (modal._handleTabKey) {
                modal.removeEventListener('keydown', modal._handleTabKey);
                delete modal._handleTabKey;
            }
        }
    }
    
    // Get skill content based on skill name
    function getSkillContent(skill) {
        const skills = {
            'tech-support': {
                title: 'Technical Support',
                body: `
                    <p>Comprehensive technical support across all major platforms and technologies.</p>
                    <h4>Core Competencies:</h4>
                    <ul>
                        <li>Hardware diagnostics and troubleshooting</li>
                        <li>Software installation and configuration</li>
                        <li>Network connectivity issues</li>
                        <li>System optimization and maintenance</li>
                    </ul>
                    <h4>Support Approach:</h4>
                    <p>Patient, methodical problem-solving with clear communication. Experienced in both remote and on-site support scenarios.</p>
                `
            },
            'customer-service': {
                title: 'Customer Service',
                body: `
                    <p>Excellence in customer interaction with focus on satisfaction and problem resolution.</p>
                    <h4>Key Strengths:</h4>
                    <ul>
                        <li>Clear and patient communication</li>
                        <li>Conflict resolution</li>
                        <li>Technical translation for non-technical users</li>
                        <li>Follow-up and relationship building</li>
                    </ul>
                `
            },
            'windows': {
                title: 'Windows Systems',
                body: `
                    <p>Expert-level knowledge of Windows operating systems from Windows 7 through Windows 11.</p>
                    <h4>Specializations:</h4>
                    <ul>
                        <li>Registry editing and system optimization</li>
                        <li>PowerShell scripting</li>
                        <li>Active Directory basics</li>
                        <li>Security and antivirus management</li>
                    </ul>
                `
            },
            'macos': {
                title: 'macOS',
                body: `
                    <p>Proficient in macOS support and troubleshooting.</p>
                    <h4>Experience:</h4>
                    <ul>
                        <li>System preferences and configuration</li>
                        <li>Time Machine and backup solutions</li>
                        <li>Application management</li>
                        <li>Terminal usage and scripting</li>
                    </ul>
                `
            },
            'linux': {
                title: 'Linux',
                body: `
                    <p>Strong foundation in Linux systems and command-line operations.</p>
                    <h4>Distributions:</h4>
                    <ul>
                        <li>Ubuntu/Debian-based systems</li>
                        <li>CentOS/RHEL basics</li>
                        <li>Package management (apt, yum)</li>
                        <li>Shell scripting and automation</li>
                    </ul>
                `
            },
            'python': {
                title: 'Python Programming',
                body: `
                    <p>Python development for automation and problem-solving.</p>
                    <h4>Applications:</h4>
                    <ul>
                        <li>Automation scripts for repetitive tasks</li>
                        <li>Data processing and analysis</li>
                        <li>Web scraping and API integration</li>
                        <li>System administration tools</li>
                    </ul>
                `
            },
            'javascript': {
                title: 'JavaScript',
                body: `
                    <p>Modern JavaScript for web development and scripting.</p>
                    <h4>Experience:</h4>
                    <ul>
                        <li>DOM manipulation and interactivity</li>
                        <li>Async programming and APIs</li>
                        <li>Basic Node.js scripting</li>
                        <li>Browser automation</li>
                    </ul>
                `
            },
            'git': {
                title: 'Git Version Control',
                body: `
                    <p>Version control for code management and collaboration.</p>
                    <h4>Proficiencies:</h4>
                    <ul>
                        <li>Repository management</li>
                        <li>Branching and merging strategies</li>
                        <li>GitHub collaboration</li>
                        <li>Conflict resolution</li>
                    </ul>
                `
            },
            'problem-solving': {
                title: 'Problem Solving',
                body: `
                    <p>Systematic approach to identifying and resolving complex technical issues.</p>
                    <h4>Methodology:</h4>
                    <ul>
                        <li>Root cause analysis</li>
                        <li>Logical troubleshooting steps</li>
                        <li>Documentation and knowledge sharing</li>
                        <li>Creative solution development</li>
                    </ul>
                `
            },
            'remote': {
                title: 'Remote Collaboration',
                body: `
                    <p>Effective remote work and team collaboration skills.</p>
                    <h4>Tools & Practices:</h4>
                    <ul>
                        <li>Video conferencing platforms</li>
                        <li>Asynchronous communication</li>
                        <li>Time management and self-direction</li>
                        <li>Documentation and knowledge sharing</li>
                    </ul>
                `
            }
        };
        
        return skills[skill] || { title: 'Skill', body: '<p>Details coming soon.</p>' };
    }

})();
