// Navegación móvil
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú móvil al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Cambiar estilo del header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animaciones a elementos
document.querySelectorAll('.course-card, .testimonial-card, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Formulario de contacto
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            course: formData.get('course'),
            message: formData.get('message')
        };
        
        // Validación básica
        if (!data.name || !data.email || !data.message) {
            showNotification('Por favor, completa todos los campos requeridos.', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Por favor, ingresa un email válido.', 'error');
            return;
        }
        
        // Simular envío del formulario
        showNotification('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
        this.reset();
        
        // Aquí se integraría con el backend real
        console.log('Datos del formulario:', data);
    });
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Función para cerrar notificación
    const closeNotification = () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    };
    
    // Event listeners
    notification.querySelector('.notification-close').addEventListener('click', closeNotification);
    
    // Auto cerrar después de 5 segundos
    setTimeout(closeNotification, 5000);
}

// Botón de acceso a la plataforma
const accessPlatformBtn = document.getElementById('access-platform');
if (accessPlatformBtn) {
    accessPlatformBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Mostrar modal o redirigir a la plataforma
        showPlatformModal();
    });
}

// Modal para acceso a la plataforma
function showPlatformModal() {
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'platform-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Acceso a la Plataforma Educativa</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>La plataforma educativa estará disponible próximamente. Mientras tanto, puedes:</p>
                    <ul>
                        <li>Contactarnos para más información sobre nuestros cursos</li>
                        <li>Registrarte para recibir notificaciones cuando esté lista</li>
                        <li>Explorar nuestros cursos disponibles</li>
                    </ul>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="document.querySelector('#contacto').scrollIntoView({behavior: 'smooth'}); closePlatformModal()">Contactar</button>
                        <button class="btn btn-secondary" onclick="closePlatformModal()">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Estilos del modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const overlay = modal.querySelector('.modal-overlay');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 100%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    const header = modal.querySelector('.modal-header');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 25px;
        border-bottom: 1px solid #eee;
    `;
    
    const body = modal.querySelector('.modal-body');
    body.style.cssText = `
        padding: 25px;
    `;
    
    const actions = modal.querySelector('.modal-actions');
    actions.style.cssText = `
        display: flex;
        gap: 10px;
        margin-top: 20px;
    `;
    
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
        padding: 0;
        line-height: 1;
    `;
    
    // Agregar al DOM
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Mostrar modal con animación
    setTimeout(() => {
        content.style.transform = 'scale(1)';
    }, 100);
    
    // Event listeners
    closeBtn.addEventListener('click', closePlatformModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePlatformModal();
        }
    });
    
    // Cerrar con ESC
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closePlatformModal();
        }
    };
    document.addEventListener('keydown', handleEsc);
    
    // Función para cerrar modal
    window.closePlatformModal = () => {
        content.style.transform = 'scale(0.9)';
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEsc);
            delete window.closePlatformModal;
        }, 300);
    };
}

// Contador animado para estadísticas
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (counter.textContent.includes('+')) {
                    counter.textContent = Math.ceil(current) + '+';
                } else if (counter.textContent.includes('%')) {
                    counter.textContent = Math.ceil(current) + '%';
                } else {
                    counter.textContent = Math.ceil(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.textContent.replace(/[0-9]+/, target);
            }
        };
        
        // Observar cuando el elemento entra en vista
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(counter);
    });
}

// Inicializar contadores cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateCounters);
} else {
    animateCounters();
}

// Efecto parallax suave para el hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Lazy loading para imágenes
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Función para mostrar/ocultar elementos basado en el scroll
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', handleScrollAnimations);

// Inicialización cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Agregar clases para animaciones
    document.querySelectorAll('.course-card, .testimonial-card').forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    // Ejecutar animaciones iniciales
    handleScrollAnimations();
    
    console.log('KommuniK Academy - Página web cargada exitosamente');
});