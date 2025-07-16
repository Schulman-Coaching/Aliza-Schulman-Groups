// Group Therapy Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add active class to navigation based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe animated elements
    const animatedElements = document.querySelectorAll('.group-card, .benefit-card, .info-section, .testimonial-card, .step-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Group inquiry form handling
    const groupInquiryForm = document.querySelector('.group-inquiry-form');
    if (groupInquiryForm) {
        groupInquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                if (formObject[key]) {
                    // Handle multiple values (like checkboxes)
                    if (Array.isArray(formObject[key])) {
                        formObject[key].push(value);
                    } else {
                        formObject[key] = [formObject[key], value];
                    }
                } else {
                    formObject[key] = value;
                }
            }
            
            // Basic form validation
            const requiredFields = ['firstName', 'lastName', 'email', 'groupInterest', 'message'];
            let isValid = true;
            let errorMessage = '';
            
            requiredFields.forEach(field => {
                const input = this.querySelector(`[name="${field}"]`);
                if (!formObject[field] || formObject[field].toString().trim() === '') {
                    isValid = false;
                    input.style.borderColor = '#dc3545';
                    errorMessage += `${getFieldLabel(field)} is required.\n`;
                } else {
                    input.style.borderColor = '#e9ecef';
                }
            });
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (formObject.email && !emailRegex.test(formObject.email)) {
                isValid = false;
                this.querySelector('[name="email"]').style.borderColor = '#dc3545';
                errorMessage += 'Please enter a valid email address.\n';
            }
            
            // Privacy checkbox validation
            if (!formObject.privacy) {
                isValid = false;
                errorMessage += 'Please acknowledge the privacy notice.\n';
            }
            
            if (!isValid) {
                alert('Please correct the following errors:\n\n' + errorMessage);
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Process availability array
            let availabilityText = 'Not specified';
            if (formObject.availability) {
                if (Array.isArray(formObject.availability)) {
                    availabilityText = formObject.availability.join(', ');
                } else {
                    availabilityText = formObject.availability;
                }
            }
            
            // Create email content
            setTimeout(() => {
                const subject = encodeURIComponent(`Group Therapy Inquiry: ${getGroupName(formObject.groupInterest)}`);
                const body = encodeURIComponent(`
Group Therapy Inquiry

Name: ${formObject.firstName} ${formObject.lastName}
Email: ${formObject.email}
Phone: ${formObject.phone || 'Not provided'}
Group of Interest: ${getGroupName(formObject.groupInterest)}
Previous Experience: ${formObject.experience || 'Not specified'}
Preferred Meeting Times: ${availabilityText}

Message:
${formObject.message}

---
This inquiry was sent via the Group Therapy website contact form.
                `.trim());
                
                const mailtoLink = `mailto:aliza@alizaschulman.com?subject=${subject}&body=${body}`;
                
                // Open email client
                window.location.href = mailtoLink;
                
                // Show success message
                alert('Thank you for your group therapy inquiry! Your email client should open with the message pre-filled. If it doesn\'t open automatically, please email aliza@alizaschulman.com directly or call (516) 524-0464.');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
            }, 1000);
        });
        
        // Real-time validation feedback
        const inputs = groupInquiryForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#dc3545';
                } else if (this.type === 'email' && this.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    this.style.borderColor = emailRegex.test(this.value) ? '#28a745' : '#dc3545';
                } else if (this.value.trim()) {
                    this.style.borderColor = '#28a745';
                } else {
                    this.style.borderColor = '#e9ecef';
                }
            });
            
            input.addEventListener('focus', function() {
                this.style.borderColor = '#007bff';
            });
        });
    }
    
    // Group card interactions
    const groupCards = document.querySelectorAll('.group-card');
    groupCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
        });
    });
    
    // Pricing card interactions
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-8px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-5px)';
            }
        });
    });
    
    // Testimonial card hover effects
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#ffffff';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Mobile menu toggle (if needed for smaller screens)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const siteNav = document.querySelector('.site-nav');
    
    if (mobileMenuToggle && siteNav) {
        mobileMenuToggle.addEventListener('click', function() {
            siteNav.classList.toggle('mobile-nav-open');
        });
    }
    
    // Utility functions
    function getFieldLabel(fieldName) {
        const labels = {
            'firstName': 'First Name',
            'lastName': 'Last Name',
            'email': 'Email',
            'groupInterest': 'Group of Interest',
            'message': 'Message'
        };
        return labels[fieldName] || fieldName;
    }
    
    function getGroupName(groupValue) {
        const groups = {
            'anxiety-depression': 'Anxiety & Depression Support Group',
            'relationship-communication': 'Relationship & Communication Skills Group',
            'life-transitions': 'Life Transitions Support Group',
            'grief-loss': 'Grief & Loss Processing Group',
            'not-sure': 'Not sure - need guidance'
        };
        return groups[groupValue] || groupValue;
    }
    
    // Initialize tooltips for group status indicators
    const groupStatuses = document.querySelectorAll('.group-status');
    groupStatuses.forEach(status => {
        status.addEventListener('mouseenter', function() {
            const tooltipText = getStatusTooltip(this.classList);
            if (tooltipText) {
                showTooltip(this, tooltipText);
            }
        });
        
        status.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
    
    function getStatusTooltip(classList) {
        if (classList.contains('available')) {
            return 'This group is currently accepting new members';
        } else if (classList.contains('limited')) {
            return 'Limited spots available - contact soon to secure your place';
        } else if (classList.contains('waitlist')) {
            return 'This group is full but you can join the waitlist';
        }
        return null;
    }
    
    function showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'status-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.8em;
            white-space: nowrap;
            z-index: 1000;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(tooltip);
    }
    
    function hideTooltip() {
        const tooltips = document.querySelectorAll('.status-tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    }
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for loading effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    // Lazy loading for images (if supported)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Console log for debugging
    console.log('Group Therapy Website JavaScript loaded successfully');
    console.log('Available groups:', document.querySelectorAll('.group-card').length);
    console.log('Form elements:', document.querySelectorAll('form').length);
});