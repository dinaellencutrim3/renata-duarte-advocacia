document.addEventListener('DOMContentLoaded', () => {

  /* ===== PRELOADER ===== */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 300);
  });
  setTimeout(() => preloader.classList.add('hidden'), 2500);

  /* ===== HEADER SCROLL STATE ===== */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ===== MOBILE MENU ===== */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(sec => navObserver.observe(sec));

  /* ===== SCROLL REVEAL ===== */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), (i % 6) * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ===== ANIMATED COUNTERS ===== */
  const counters = document.querySelectorAll('.numero-value');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ===== TESTIMONIALS CAROUSEL ===== */
  const testiTrack = document.getElementById('testiTrack');
  const testiCards = document.querySelectorAll('.testi-card');
  const testiDotsContainer = document.getElementById('testiDots');
  let currentTesti = 0;
  let testiInterval;

  testiCards.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTesti(i));
    testiDotsContainer.appendChild(dot);
  });
  const testiDots = testiDotsContainer.querySelectorAll('span');

  function goToTesti(index) {
    currentTesti = index;
    testiTrack.scrollTo({ left: testiTrack.clientWidth * index, behavior: 'smooth' });
    testiDots.forEach((d, i) => d.classList.toggle('active', i === index));
  }
  function startTestiAutoplay() {
    testiInterval = setInterval(() => {
      currentTesti = (currentTesti + 1) % testiCards.length;
      goToTesti(currentTesti);
    }, 5000);
  }
  startTestiAutoplay();
  testiTrack.addEventListener('mouseenter', () => clearInterval(testiInterval));
  testiTrack.addEventListener('mouseleave', startTestiAutoplay);

  /* ===== CONTACT FORM -> WHATSAPP ===== */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const WHATSAPP_NUMBER = '5511988887777'; // TODO: trocar pelo número real

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !phone || !email || !message) {
      formNote.textContent = 'Por favor, preencha todos os campos.';
      formNote.style.color = '#6fc7a1';
      return;
    }

    const serviceLabels = {
      empresarial: 'Direito Empresarial', contratos: 'Contratos & Consultivo',
      civil: 'Direito Civil', familia: 'Família & Sucessões'
    };

    const text = `Olá! Meu nome é ${name}.%0A` +
      `Telefone: ${phone}%0A` +
      `E-mail: ${email}%0A` +
      `Assunto: ${serviceLabels[service] || service}%0A` +
      `Mensagem: ${message}`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    formNote.style.color = '#6fc7a1';
    formNote.textContent = 'Redirecionando para o WhatsApp...';
    window.open(waUrl, '_blank');
    contactForm.reset();
    setTimeout(() => { formNote.textContent = ''; }, 4000);
  });

  /* ===== FOOTER YEAR ===== */
  document.getElementById('year').textContent = new Date().getFullYear();

});
