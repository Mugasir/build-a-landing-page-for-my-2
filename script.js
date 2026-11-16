/**
 * Vanguard Studio — Modern Landing Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Accent Color Switcher
  const paletteDots = document.querySelectorAll('.palette-dot');
  const savedAccent = localStorage.getItem('vanguard_accent') || 'indigo';

  function applyAccent(accent) {
    document.documentElement.setAttribute('data-accent', accent);
    paletteDots.forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('data-accent') === accent);
    });
    localStorage.setItem('vanguard_accent', accent);
  }

  applyAccent(savedAccent);

  paletteDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const accent = dot.getAttribute('data-accent');
      if (accent) {
        applyAccent(accent);
      }
    });
  });

  // 2. Light / Dark Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('vanguard_theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vanguard_theme', theme);
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // 3. Header Sticky Shadow
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // 4. Mobile Navigation Menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenuBtn.classList.toggle('active', !isExpanded);
      mainNav.classList.toggle('nav-open', !isExpanded);
    });

    // Close menu when clicking nav links
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.classList.remove('active');
        mainNav.classList.remove('nav-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && mainNav.classList.contains('nav-open')) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.classList.remove('active');
        mainNav.classList.remove('nav-open');
      }
    });
  }

  // 5. Billing Period Toggle (One-Time Project vs Monthly Retainer)
  const billingSwitch = document.getElementById('billingSwitch');
  const labelProject = document.getElementById('labelProject');
  const labelRetainer = document.getElementById('labelRetainer');
  const priceAmounts = document.querySelectorAll('.price-amount');
  const pricePeriods = document.querySelectorAll('.price-period');

  let isRetainer = false;

  function updatePricing(retainerMode) {
    isRetainer = retainerMode;
    if (billingSwitch) {
      billingSwitch.setAttribute('aria-checked', isRetainer ? 'true' : 'false');
    }
    if (labelProject && labelRetainer) {
      labelProject.classList.toggle('active', !isRetainer);
      labelRetainer.classList.toggle('active', isRetainer);
    }

    priceAmounts.forEach(el => {
      const projectPrice = el.getAttribute('data-project');
      const retainerPrice = el.getAttribute('data-retainer');
      if (projectPrice && retainerPrice) {
        el.textContent = isRetainer ? retainerPrice : projectPrice;
      }
    });

    pricePeriods.forEach(el => {
      const projectPeriod = el.getAttribute('data-project');
      const retainerPeriod = el.getAttribute('data-retainer');
      if (projectPeriod && retainerPeriod) {
        el.textContent = isRetainer ? retainerPeriod : projectPeriod;
      }
    });
  }

  if (billingSwitch) {
    billingSwitch.addEventListener('click', () => {
      updatePricing(!isRetainer);
    });
  }

  if (labelProject) {
    labelProject.addEventListener('click', () => updatePricing(false));
  }

  if (labelRetainer) {
    labelRetainer.addEventListener('click', () => updatePricing(true));
  }

  // 6. Plan Selector Buttons (populate contact form)
  const planButtons = document.querySelectorAll('[data-plan]');
  const selectedPlanSelect = document.getElementById('selectedPlan');

  planButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan');
      if (selectedPlanSelect && planName) {
        // Find matching option
        for (let i = 0; i < selectedPlanSelect.options.length; i++) {
          if (selectedPlanSelect.options[i].value === planName) {
            selectedPlanSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // 7. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');
    const iconSpan = item.querySelector('.faq-icon');

    if (questionBtn && answerDiv) {
      questionBtn.addEventListener('click', () => {
        const isOpen = answerDiv.classList.contains('open');

        // Close other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherBtn = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherIcon = otherItem.querySelector('.faq-icon');
            if (otherAnswer && otherBtn) {
              otherAnswer.classList.remove('open');
              otherBtn.setAttribute('aria-expanded', 'false');
              if (otherIcon) otherIcon.textContent = '+';
            }
          }
        });

        // Toggle current item
        if (isOpen) {
          answerDiv.classList.remove('open');
          questionBtn.setAttribute('aria-expanded', 'false');
          if (iconSpan) iconSpan.textContent = '+';
        } else {
          answerDiv.classList.add('open');
          questionBtn.setAttribute('aria-expanded', 'true');
          if (iconSpan) iconSpan.textContent = '−';
        }
      });
    }
  });

  // 8. Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  const formError = document.getElementById('formError');
  const formSuccess = document.getElementById('formSuccess');
  const successSummary = document.getElementById('successSummary');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = (document.getElementById('fullName')?.value || '').trim();
      const workEmail = (document.getElementById('workEmail')?.value || '').trim();
      const companyName = (document.getElementById('companyName')?.value || '').trim();
      const selectedPlan = document.getElementById('selectedPlan')?.value || 'General Inquiry';
      const projectGoals = (document.getElementById('projectGoals')?.value || '').trim();

      // Basic Validation
      if (!fullName) {
        showError('Please enter your full name.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!workEmail || !emailRegex.test(workEmail)) {
        showError('Please enter a valid work email address.');
        return;
      }

      if (!projectGoals || projectGoals.length < 10) {
        showError('Please provide a brief description (at least 10 characters) of your goals.');
        return;
      }

      hideError();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }

        contactForm.hidden = true;
        if (formSuccess) {
          formSuccess.hidden = false;
          if (successSummary) {
            const companyText = companyName ? ` for ${companyName}` : '';
            successSummary.textContent = `Thanks, ${fullName}! We received your proposal request${companyText} regarding the ${selectedPlan} package. We'll follow up at ${workEmail} within 24 hours.`;
          }
        }
      }, 600);
    });
  }

  function showError(msg) {
    if (formError) {
      formError.textContent = msg;
      formError.hidden = false;
    }
  }

  function hideError() {
    if (formError) {
      formError.hidden = true;
      formError.textContent = '';
    }
  }

  if (resetFormBtn && contactForm && formSuccess) {
    resetFormBtn.addEventListener('click', () => {
      contactForm.reset();
      contactForm.hidden = false;
      formSuccess.hidden = true;
      hideError();
    });
  }

  // 9. Dynamic Current Year
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
