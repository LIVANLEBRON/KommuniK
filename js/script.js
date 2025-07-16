// KommuniK Academy - Main JavaScript File

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        const slides = document.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const indicators = document.querySelectorAll('.indicator');
        let currentSlide = 0;
        
        // Function to show a specific slide
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            currentSlide = index;
        }
        
        // Event listeners for controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            });
        }
        
        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // Auto slide every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }
    
    // Scroll Animation
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('appear');
            }
        });
    }
    
    window.addEventListener('scroll', checkFade);
    checkFade(); // Check on initial load
    
    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            // Validate name
            if (name.value.trim() === '') {
                showError(name, 'Por favor ingrese su nombre');
                isValid = false;
            } else {
                removeError(name);
            }
            
            // Validate email
            if (email.value.trim() === '') {
                showError(email, 'Por favor ingrese su correo electrónico');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Por favor ingrese un correo electrónico válido');
                isValid = false;
            } else {
                removeError(email);
            }
            
            // Validate phone (optional)
            if (phone.value.trim() !== '' && !isValidPhone(phone.value)) {
                showError(phone, 'Por favor ingrese un número de teléfono válido');
                isValid = false;
            } else {
                removeError(phone);
            }
            
            // Validate message
            if (message.value.trim() === '') {
                showError(message, 'Por favor ingrese su mensaje');
                isValid = false;
            } else {
                removeError(message);
            }
            
            // If form is valid, submit it
            if (isValid) {
                // Here you would typically send the form data to a server
                // For now, we'll just show a success message
                const formGroups = contactForm.querySelectorAll('.form-group');
                formGroups.forEach(group => {
                    group.style.display = 'none';
                });
                
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.style.display = 'none';
                
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<h3>¡Gracias por contactarnos!</h3><p>Nos pondremos en contacto contigo pronto.</p>';
                contactForm.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
            }
        });
        
        // Helper functions for form validation
        function showError(input, message) {
            const formGroup = input.parentElement;
            const errorMessage = formGroup.querySelector('.error-message');
            
            input.classList.add('error');
            
            if (errorMessage) {
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
            }
        }
        
        function removeError(input) {
            const formGroup = input.parentElement;
            const errorMessage = formGroup.querySelector('.error-message');
            
            input.classList.remove('error');
            
            if (errorMessage) {
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';
            }
        }
        
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        
        function isValidPhone(phone) {
            const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
            return re.test(String(phone));
        }
    }
    
    // Initialize Google Maps if on contact page
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // This would typically be replaced with an actual Google Maps API implementation
        // For now, we'll just add a placeholder
        mapElement.innerHTML = '<div style="background-color: #eee; height: 100%; display: flex; align-items: center; justify-content: center;"><p>Google Maps would be displayed here</p></div>';
    }
});
