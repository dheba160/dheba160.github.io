// Dennis Heba Portfolio - Enhanced Dynamic JavaScript
(function() {
    'use strict';

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        createParallaxBackground();
        setupScrollEffects();
        setupSmoothScrolling();
        setupSkillModals();
        setupIntersectionObservers();
        setupFloatingNav();
        setupScrollProgress();
    }

    // Create parallax background with geometric shapes and particles
    function createParallaxBackground() {
        const container = document.querySelector('.parallax-container');
        if (!container) return;

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
    }

    // Enhanced scroll effects with parallax and dynamic animations
    function setupScrollEffects() {
        let ticking = false;
        
        // Cache DOM elements
        const layers = document.querySelectorAll('.parallax-layer');
        const heroContent = document.querySelector('.hero-content');
        const geoShapes = document.querySelectorAll('.geo-shape');
        const orbs = document.querySelectorAll('.gradient-orb');
        
        function updateScrollEffects() {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
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
                // Remove transform to prevent bouncing
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
        }
        
        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
        window.addEventListener('resize', requestTick, { passive: true });
        
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
            
            // Update active state
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    const id = section.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateFloatingNav);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
        updateFloatingNav();
    }
    
    // Enhanced intersection observers for scroll animations
    function setupIntersectionObservers() {
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
                        
                        // Animate cards with stagger
                        const cards = entry.target.querySelectorAll('.about-card, .skill-card, .experience-item');
                        cards.forEach((card, cardIndex) => {
                            setTimeout(() => {
                                card.classList.add('fade-in');
                            }, 100 + cardIndex * 100);
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
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }


    // Setup skill modals
    function setupSkillModals() {
        const skillCards = document.querySelectorAll('.skill-card');
        const modal = document.getElementById('skillModal');
        const modalClose = document.querySelector('.skill-modal-close');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        if (!modal) return;
        
        skillCards.forEach(card => {
            card.addEventListener('click', () => {
                const skill = card.dataset.skill;
                const content = getSkillContent(skill);
                
                modalTitle.textContent = content.title;
                modalContent.innerHTML = content.body;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
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
            document.body.style.overflow = '';
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
