// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
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
    
    // Add fade-in animation for service items
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
    
    // Observe service items and credential items
    const animatedElements = document.querySelectorAll('.service-item, .credential-item, .contact-method');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Basic form validation
            const requiredFields = ['firstName', 'lastName', 'email', 'message'];
            let isValid = true;
            let errorMessage = '';
            
            requiredFields.forEach(field => {
                const input = this.querySelector(`[name="${field}"]`);
                if (!formObject[field] || formObject[field].trim() === '') {
                    isValid = false;
                    input.style.borderColor = '#dc3545';
                    errorMessage += `${field.charAt(0).toUpperCase() + field.slice(1)} is required.\n`;
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
            
            // Simulate form submission (replace with actual form handler)
            setTimeout(() => {
                // Create mailto link with form data
                const subject = encodeURIComponent(`Contact Form: ${formObject.serviceType || 'General Inquiry'}`);
                const body = encodeURIComponent(`
Name: ${formObject.firstName} ${formObject.lastName}
Email: ${formObject.email}
Phone: ${formObject.phone || 'Not provided'}
Service Interest: ${formObject.serviceType || 'Not specified'}

Message:
${formObject.message}

---
This message was sent via the contact form on alizaschulman.com
                `.trim());
                
                const mailtoLink = `mailto:aliza@alizaschulman.com?subject=${subject}&body=${body}`;
                
                // Open email client
                window.location.href = mailtoLink;
                
                // Show success message
                alert('Thank you for your message! Your email client should open with the message pre-filled. If it doesn\'t open automatically, please email aliza@alizaschulman.com directly or call (516) 524-0464.');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
            }, 1000);
        });
        
        // Real-time validation feedback
        const inputs = contactForm.querySelectorAll('input, textarea, select');
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
});