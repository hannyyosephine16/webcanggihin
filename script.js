/* ===================================
   Canggihin Aja — JavaScript
   Interactivity & Animations
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== Navbar Scroll Effect =====
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ===== Mobile Hamburger Menu =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== Scroll Animations (Intersection Observer) =====
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => scrollObserver.observe(el));

  // ===== Counter Animation =====
  const counters = document.querySelectorAll('[data-target]');
  let countersAnimated = new Set();

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const update = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated.has(entry.target)) {
        countersAnimated.add(entry.target);
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ===== Testimonial Carousel =====
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('testimPrev');
  const nextBtn = document.getElementById('testimNext');
  let currentSlide = 0;
  const totalSlides = dots.length;
  let autoSlideTimer;

  const goToSlide = (index) => {
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  };

  const startAutoSlide = () => {
    autoSlideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  };

  prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });
  nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.index)); resetAutoSlide(); });
  });

  // Touch swipe for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      resetAutoSlide();
    }
  });

  startAutoSlide();

  // ===== Contact Form Validation =====
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showError = (inputId, errorId) => {
    document.getElementById(inputId).classList.add('error');
    document.getElementById(errorId).classList.add('show');
  };

  const clearErrors = () => {
    form.querySelectorAll('.form-input, .form-textarea').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    let valid = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name) { showError('name', 'nameError'); valid = false; }
    if (!email || !validateEmail(email)) { showError('email', 'emailError'); valid = false; }
    if (!message) { showError('message', 'messageError'); valid = false; }

    if (valid) {
      form.style.display = 'none';
      successMsg.classList.add('show');
      // Reset after a delay
      setTimeout(() => {
        form.reset();
        form.style.display = '';
        successMsg.classList.remove('show');
      }, 5000);
    }
  });

  // Clear error on input
  form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errorEl = input.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.classList.remove('show');
    });
  });

  // ===== Hero Particle Canvas =====
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  const resizeCanvas = () => {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  };

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.7 ? '239, 68, 68' : '96, 165, 250';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  const initParticles = () => {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
    particles = Array.from({ length: count }, () => new Particle());
  };

  const drawConnections = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(96, 165, 250, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
  };

  resizeCanvas();
  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationId);
    resizeCanvas();
    initParticles();
    animateParticles();
  });

});
