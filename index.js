/*
 * PORTFOLIO - MAIN JAVASCRIPT
 * All animations, interactions, and dynamic behaviors
 */

document.addEventListener('DOMContentLoaded', () => {

  // PARTICLES
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('span');
      p.classList.add('particle');
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 6 + 's';
      p.style.animationDuration = (4 + Math.random() * 4) + 's';
      p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
      particlesContainer.appendChild(p);
    }
  }

  // TYPING EFFECT
  const designations = [
    'Full-Stack Developer',
    'Django Developer',
    'Backend Engineer'
  ];
  const typingEl = document.getElementById('typingText');
  let desIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    const current = designations[desIdx];
    if (!deleting) {
      typingEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; typeLoop(); }, 2000);
        return;
      }
      setTimeout(typeLoop, 70);
    } else {
      typingEl.textContent = current.slice(0, charIdx);
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        charIdx = 0;
        desIdx = (desIdx + 1) % designations.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 40);
    }
  }
  if (typingEl) typeLoop();

  // NAVBAR SCROLL
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Shrink navbar on scroll
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let currentSection = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        currentSection = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  });

  // MOBILE NAV TOGGLE
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinksContainer.classList.remove('open');
    });
  });

  // INTERSECTION OBSERVER - SCROLL ANIMATIONS
  const animatedEls = document.querySelectorAll('[data-anim]');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.style.animationDelay || '0s';
        el.style.transitionDelay = delay;
        el.classList.add('in-view');
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  animatedEls.forEach(el => observer.observe(el));

  // STAGGER ANIMATIONS
  // Add stagger delays to list items within in-view parents
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target;
        const staggerItems = parent.querySelectorAll('[data-anim="stagger"]');
        staggerItems.forEach((item, i) => {
          item.style.transitionDelay = (i * 0.15) + 's';
          item.classList.add('in-view');
        });

        // Pop-in items
        const popItems = parent.querySelectorAll('[data-anim="pop-in"]');
        popItems.forEach((item, i) => {
          const baseDelay = parseFloat(item.style.animationDelay) || 0;
          item.style.transitionDelay = (baseDelay + i * 0.1) + 's';
          item.classList.add('in-view');
        });

        // Elastic items (tech tags)
        const elasticItems = parent.querySelectorAll('[data-anim="elastic"]');
        elasticItems.forEach((item, i) => {
          item.style.transitionDelay = (0.3 + i * 0.08) + 's';
          item.classList.add('in-view');
        });

        staggerObserver.unobserve(parent);
      }
    });
  }, { threshold: 0.1 });

  // Observe parents of stagger/pop-in/elastic items
  document.querySelectorAll('.exp-right, .project-right, .project-tech').forEach(el => {
    staggerObserver.observe(el);
  });

  // SKILL BARS ANIMATION
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-fill');
        const pcts = entry.target.querySelectorAll('.skill-pct');

        fills.forEach((fill, i) => {
          const width = fill.getAttribute('data-width');
          setTimeout(() => {
            fill.style.width = width + '%';
          }, i * 100);
        });

        pcts.forEach((pct, i) => {
          const target = parseInt(pct.getAttribute('data-target'));
          setTimeout(() => {
            animateCounter(pct, 0, target, 1200);
          }, i * 100);
        });

        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(cat => {
    skillObserver.observe(cat);
  });

  function animateCounter(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + range * eased);
      el.textContent = current + '%';
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // STAT COUNTERS
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.stat-number');
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-count'));
          animateStatCounter(counter, 0, target, 1500);
        });
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statSection = document.querySelector('.stat-counters');
  if (statSection) statObserver.observe(statSection);

  function animateStatCounter(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // CERTIFICATION CARD TILT (MOUSE-FOLLOW)
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transitionDelay = '0s';
      card.style.transition = 'none';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform var(--transition-med), box-shadow var(--transition-med)';
      card.style.transitionDelay = '0s';
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // CONTACT FORM
  const contactForm = document.getElementById('contactForm');
  const sendBtn = document.getElementById('sendBtn');

  if (contactForm) {
    // Pulse button after form renders
    const formObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            sendBtn.classList.add('pulse');
            setTimeout(() => sendBtn.classList.remove('pulse'), 1500);
          }, 1200);
          formObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    formObserver.observe(contactForm);

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Disable button and show sending spinner
      sendBtn.disabled = true;
      sendBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      fetch('https://formsubmit.co/ajax/arauf0801@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          sendBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
          sendBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
          contactForm.reset();
        } else {
          throw new Error('Submission response not ok');
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        sendBtn.innerHTML = '<span>Error! Try Again</span><i class="fas fa-exclamation-triangle"></i>';
        sendBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      })
      .finally(() => {
        setTimeout(() => {
          sendBtn.disabled = false;
          sendBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
          sendBtn.style.background = '';
        }, 3500);
      });
    });
  }

  // SEQUENTIAL FORM LINE ANIMATION
  const formObserver2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lines = entry.target.querySelectorAll('.form-line');
        lines.forEach((line, i) => {
          setTimeout(() => {
            line.style.width = '100%';
            setTimeout(() => {
              line.style.width = '0';
            }, 600);
          }, i * 300);
        });
        formObserver2.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const formWrapper = document.querySelector('.contact-form-wrapper');
  if (formWrapper) formObserver2.observe(formWrapper);

  // SMOOTH SCROLL FOR ANCHOR LINKS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 70;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 900; // Duration in milliseconds
        let start = null;

        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const time = Math.min(progress / duration, 1);
          
          // Easing function: easeInOutCubic
          const ease = time < 0.5 
            ? 4 * time * time * time 
            : 1 - Math.pow(-2 * time + 2, 3) / 2;

          window.scrollTo(0, startPosition + distance * ease);

          if (progress < duration) {
            window.requestAnimationFrame(step);
          }
        }
        window.requestAnimationFrame(step);
      }
    });
  });

  // THEME TOGGLE (Light / Dark)
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
  };

  // Initialize theme
  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
  }

  // THEME STYLE SWITCHER (Default / Doodle)
  const themeStyleSwitcher = document.getElementById('themeStyleSwitcher');
  const themeStyleBtn = document.getElementById('themeStyleBtn');
  const themeStyleDropdown = document.getElementById('themeStyleDropdown');
  const themeStyleLabel = themeStyleBtn ? themeStyleBtn.querySelector('.theme-style-label') : null;
  const themeStyleBtnIcon = themeStyleBtn ? themeStyleBtn.querySelector('i:first-child') : null;
  const styleOptions = document.querySelectorAll('.theme-style-option');

  const getPreferredStyle = () => {
    return localStorage.getItem('themeStyle') || 'default';
  };

  // THEME-BASED CREATIVE NAME ANIMATION
  const landingName = document.getElementById('landingName');
  
  // NEOBRUTALISM ANIMATION HELPERS
  function spawnBrutalCrumbs(container, element) {
    const wrapper = element.parentElement;
    const rect = wrapper.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();
    const startX = rect.left - parentRect.left + rect.width / 2;
    const startY = rect.top - parentRect.top + rect.height / 2;
    
    for (let i = 0; i < 15; i++) {
      const crumb = document.createElement('span');
      crumb.className = 'brutal-crumb';
      
      const size = 5 + Math.random() * 8;
      crumb.style.width = `${size}px`;
      crumb.style.height = `${size}px`;
      crumb.style.left = `${startX}px`;
      crumb.style.top = `${startY}px`;
      
      crumb.style.backgroundColor = "var(--neo-yellow)";
      crumb.style.border = "2px solid #000000";
      
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 140;
      const lx = Math.cos(angle) * dist;
      const ly = Math.sin(angle) * dist + 40;
      const rot = Math.random() * 360;
      const jumpHeight = 30 + Math.random() * 60;
      
      crumb.style.setProperty('--lx', `${lx}px`);
      crumb.style.setProperty('--ly', `${ly}px`);
      crumb.style.setProperty('--rot', `${rot}deg`);
      crumb.style.setProperty('--jump-height', `${jumpHeight}px`);
      
      container.appendChild(crumb);
      setTimeout(() => {
        crumb.remove();
      }, 850);
    }
  }

  // DOODLE ANIMATION HELPERS
  function spawnDoodleSparkle(element) {
    const rect = element.getBoundingClientRect();
    const parent = element.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    
    const x = rect.left - parentRect.left + rect.width / 2;
    const y = rect.top - parentRect.top - 10;
    
    const sparkle = document.createElement('span');
    sparkle.className = 'doodle-sparkle';
    sparkle.textContent = Math.random() > 0.5 ? '✨' : '⭐';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.fontSize = `${10 + Math.random() * 10}px`;
    
    const rot = (Math.random() - 0.5) * 40;
    const tx = (Math.random() - 0.5) * 30;
    const ty = -20 - Math.random() * 20;
    sparkle.style.setProperty('--rot', `${rot}deg`);
    sparkle.style.setProperty('--tx', `${tx}px`);
    sparkle.style.setProperty('--ty', `${ty}px`);
    
    parent.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }

  function initNameAnimation(style) {
    if (!landingName) return;
    
    if (landingName._animCleanup) {
      landingName._animCleanup();
    }
    
    landingName.innerHTML = '';
    
    const timeouts = [];
    const elementsToCleanup = [];
    
    const registerTimeout = (fn, delay) => {
      const t = setTimeout(fn, delay);
      timeouts.push(t);
      return t;
    };
    
    if (style === 'neobrutalism') {
      const lines = [
        ["Shaikh", "Abdulrauf"],
        ["Asifparvez"]
      ];
      
      const crumbsContainer = document.createElement('div');
      crumbsContainer.className = 'brutal-crumbs-container';
      landingName.appendChild(crumbsContainer);
      elementsToCleanup.push(crumbsContainer);
      
      let wordIndex = 0;
      lines.forEach((lineWords, lineIdx) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'brutal-line';
        
        lineWords.forEach((word) => {
          const wordWrap = document.createElement('span');
          wordWrap.className = 'brutal-word-wrap';
          
          const wordSpan = document.createElement('span');
          wordSpan.className = 'brutal-word';
          wordSpan.textContent = word;
          
          wordWrap.appendChild(wordSpan);
          lineDiv.appendChild(wordWrap);
          
          const currentWordIdx = wordIndex;
          const slamDelay = 300 + currentWordIdx * 500;
          
          registerTimeout(() => {
            wordSpan.classList.add('slammed');
            
            const landingSection = document.querySelector('.landing-section');
            if (landingSection) {
              landingSection.classList.add('brutal-shake');
              setTimeout(() => landingSection.classList.remove('brutal-shake'), 200);
            }
            
            spawnBrutalCrumbs(crumbsContainer, wordSpan);
          }, slamDelay);
          
          wordIndex++;
        });
        
        landingName.appendChild(lineDiv);
      });
      
    } else if (style === 'doodle') {
      const lines = [
        "Shaikh Abdulrauf",
        "Asifparvez"
      ];
      
      lines.forEach((lineText, lineIdx) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'doodle-line';
        
        Array.from(lineText).forEach((char, charIdx) => {
          const letterSpan = document.createElement('span');
          letterSpan.className = char === ' ' ? 'doodle-space' : 'doodle-letter';
          letterSpan.textContent = char;
          
          const randomRot = (Math.random() - 0.5) * 8;
          letterSpan.style.setProperty('--doodle-rot', `${randomRot}deg`);
          
          const revealDelay = 100 + (lineIdx * 16 + charIdx) * 50;
          letterSpan.style.animationDelay = `${revealDelay}ms`;
          
          lineDiv.appendChild(letterSpan);
          
          if (char !== ' ') {
            registerTimeout(() => {
              if (Math.random() > 0.6) {
                spawnDoodleSparkle(letterSpan);
              }
            }, revealDelay + 300);
          }
        });
        
        landingName.appendChild(lineDiv);
      });
      
      const totalLetters = lines[0].length + lines[1].length;
      const underlineDelay = 100 + totalLetters * 50 + 200;
      
      registerTimeout(() => {
        const doodleUnderline = document.createElement('div');
        doodleUnderline.className = 'doodle-underline';
        landingName.appendChild(doodleUnderline);
        elementsToCleanup.push(doodleUnderline);
      }, underlineDelay);
      
      landingName._animCleanup = () => {
        timeouts.forEach(clearTimeout);
      };
      return;
      
    } else {
      const lines = [
        "Shaikh Abdulrauf",
        "Asifparvez"
      ];
      
      lines.forEach((lineText, lineIdx) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'modern-line';
        
        Array.from(lineText).forEach((char, charIdx) => {
          const letterSpan = document.createElement('span');
          letterSpan.className = char === ' ' ? 'modern-space' : 'modern-letter';
          letterSpan.textContent = char;
          
          const revealDelay = 100 + (lineIdx * 16 + charIdx) * 35;
          letterSpan.style.animationDelay = `${revealDelay}ms`;
          
          lineDiv.appendChild(letterSpan);
        });
        
        landingName.appendChild(lineDiv);
      });
      
      const particleContainer = document.createElement('div');
      particleContainer.className = 'modern-particles-container';
      landingName.appendChild(particleContainer);
      elementsToCleanup.push(particleContainer);
      
      const spawnParticle = () => {
        if (!particleContainer.isConnected) return;
        const p = document.createElement('span');
        p.className = 'modern-glow-dot';
        p.style.left = Math.random() * 100 + '%';
        p.style.bottom = '-10px';
        const size = 3 + Math.random() * 6;
        p.style.width = p.style.height = `${size}px`;
        p.style.animationDuration = (3 + Math.random() * 4) + 's';
        p.style.setProperty('--x-drift', `${(Math.random() - 0.5) * 80}px`);
        
        particleContainer.appendChild(p);
        setTimeout(() => p.remove(), 7000);
      };
      
      for (let i = 0; i < 8; i++) {
        registerTimeout(spawnParticle, Math.random() * 1500);
      }
      
      const intervalId = setInterval(spawnParticle, 600);
      
      landingName._animCleanup = () => {
        clearInterval(intervalId);
        timeouts.forEach(clearTimeout);
      };
      return;
    }
    
    landingName._animCleanup = () => {
      timeouts.forEach(clearTimeout);
    };
  }

  const setThemeStyle = (style) => {
    document.documentElement.setAttribute('data-theme-style', style);
    localStorage.setItem('themeStyle', style);

    // Update button label and icon
    const styleLabels = { default: 'Modern', doodle: 'Doodle', neobrutalism: 'Brutal' };
    const styleIcons = { default: 'fas fa-palette', doodle: 'fas fa-pencil-alt', neobrutalism: 'fas fa-bolt' };
    if (themeStyleLabel) {
      themeStyleLabel.textContent = styleLabels[style] || 'Modern';
    }
    if (themeStyleBtnIcon) {
      themeStyleBtnIcon.className = styleIcons[style] || 'fas fa-palette';
    }

    // Update active state on dropdown options
    styleOptions.forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-style') === style);
    });

    // Trigger theme-specific name animation
    initNameAnimation(style);

    // Recalculate the violet stripe height after name animation settles
    setTimeout(updateStripeHeight, 100);
    setTimeout(updateStripeHeight, 600);
  };

  // NEOBRUTALISM STRIPE HEIGHT — dynamically match the name bottom edge
  function updateStripeHeight() {
    const section = document.querySelector('.landing-section');
    const nameEl = document.getElementById('landingName');
    if (!section || !nameEl) return;

    const isNeo = document.documentElement.getAttribute('data-theme-style') === 'neobrutalism';
    if (!isNeo) {
      section.style.removeProperty('--stripe-height');
      return;
    }

    const sectionRect = section.getBoundingClientRect();
    const nameRect = nameEl.getBoundingClientRect();
    // Add a small buffer (12px) so the stripe extends slightly past the name
    const stripeHeight = nameRect.bottom - sectionRect.top + 12;
    section.style.setProperty('--stripe-height', stripeHeight + 'px');
  }

  // Run on resize
  window.addEventListener('resize', updateStripeHeight);

  // Run after fonts finish loading (font swap can change text height)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      updateStripeHeight();
    });
  }

  // Use ResizeObserver on the name element for live tracking
  const nameObserverTarget = document.getElementById('landingName');
  if (nameObserverTarget && typeof ResizeObserver !== 'undefined') {
    const stripeObserver = new ResizeObserver(() => {
      updateStripeHeight();
    });
    stripeObserver.observe(nameObserverTarget);
  }

  // Initialize theme style
  setThemeStyle(getPreferredStyle());

  // Toggle dropdown open/close
  if (themeStyleBtn) {
    themeStyleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeStyleSwitcher.classList.toggle('open');
    });
  }

  // Handle option selection
  styleOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const style = option.getAttribute('data-style');
      setThemeStyle(style);
      themeStyleSwitcher.classList.remove('open');
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (themeStyleSwitcher && !themeStyleSwitcher.contains(e.target)) {
      themeStyleSwitcher.classList.remove('open');
    }
  });

  // Close dropdown on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && themeStyleSwitcher) {
      themeStyleSwitcher.classList.remove('open');
    }
  });

  // VISITOR COUNTER
  const visitorCounter = document.getElementById('visitorCounter');
  const visitorCountEl = document.getElementById('visitorCount');

  if (visitorCounter && visitorCountEl) {
    const key = 'shaikh_abdulrauf_portfolio_visits';
    const isNewSession = !sessionStorage.getItem('portfolio_visited');
    const endpoint = isNewSession 
      ? `https://countapi.mileshilliard.com/api/v1/hit/${key}`
      : `https://countapi.mileshilliard.com/api/v1/get/${key}`;

    fetch(endpoint)
      .then(res => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then(data => {
        if (data && typeof data.value === 'number') {
          if (isNewSession) {
            sessionStorage.setItem('portfolio_visited', 'true');
          }
          // Reveal the counter container
          visitorCounter.style.display = 'inline-flex';
          
          // Animate the counter loading
          animateVisitorCounter(visitorCountEl, 0, data.value, 1500);
        }
      })
      .catch(err => {
        console.warn('Visitor counter API unavailable, falling back to local simulation:', err);
        handleLocalCounterFallback();
      });
  }

  function animateVisitorCounter(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(start + range * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function handleLocalCounterFallback() {
    let localCount = parseInt(localStorage.getItem('local_portfolio_visits') || '0');
    const isNewSession = !sessionStorage.getItem('local_portfolio_visited');
    
    if (isNewSession) {
      localCount += 1;
      localStorage.setItem('local_portfolio_visits', localCount.toString());
      sessionStorage.setItem('local_portfolio_visited', 'true');
    }
    
    visitorCounter.style.display = 'inline-flex';
    animateVisitorCounter(visitorCountEl, 0, localCount, 1000);
  }

  // INTERACTIVE SKILLS MATRIX
  const skillsData = [
    // Languages
    { name: 'Python', icon: 'devicon-python-plain', color: '#3776AB', category: 'languages', desc: 'Primary language for backend systems, scripting, and Django applications.' },
    { name: 'JavaScript', icon: 'devicon-javascript-plain', color: '#F7DF1E', category: 'languages', desc: 'Powers portfolio interactivity, DOM manipulation, and dynamic theme handling.' },
    { name: 'C', icon: 'devicon-c-plain', color: '#A8B9CC', category: 'languages', desc: 'Academic language for understanding systems-level concepts and memory.' },
    { name: 'Java', icon: 'devicon-java-plain', color: '#007396', category: 'languages', desc: 'Object-oriented programming foundation, learned during academic coursework.' },
    
    // Frameworks
    { name: 'Django', icon: 'devicon-django-plain', color: '#092E20', category: 'frameworks', desc: 'Main Python web framework used to design database models and route APIs.' },
    { name: 'Bootstrap', icon: 'devicon-bootstrap-plain', color: '#7952B3', category: 'frameworks', desc: 'CSS library for rapid design layout prototyping and mobile responsiveness.' },
    { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-original', color: '#06B6D4', category: 'frameworks', desc: 'Utility-first framework for building custom-tailored front-end interfaces.' },
    
    // Cloud/Databases
    { name: 'SQLite', icon: 'devicon-sqlite-plain', color: '#003B57', category: 'databases', desc: 'Lightweight database used during development and early prototyping phase.' },
    { name: 'MySQL', icon: 'devicon-mysql-plain', color: '#4479A1', category: 'databases', desc: 'Relational database management system studied during coursework.' },
    { name: 'PostgreSQL', icon: 'devicon-postgresql-plain', color: '#4169E1', category: 'databases', desc: 'Robust relational database deployed in production projects.' },
    { name: 'Cloudinary', icon: 'fas fa-cloud-arrow-up', color: '#3448C5', category: 'databases', desc: 'Cloud asset storage for hosting images, videos, and media dynamically.' },
    { name: 'Render', icon: 'fas fa-server', color: '#46E3B7', category: 'databases', desc: 'Hosting service used to deploy Django backends and host live portfolio projects.' },
    { name: 'Supabase', icon: 'devicon-supabase-plain', color: '#3ECF8E', category: 'databases', desc: 'Managed database platform used to deploy production PostgreSQL instances.' },
    
    // Tools
    { name: 'VS Code', icon: 'devicon-vscode-plain', color: '#007ACC', category: 'tools', desc: 'Primary development environment for writing clean, optimized code.' },
    { name: 'Git', icon: 'devicon-git-plain', color: '#F05032', category: 'tools', desc: 'Version control system for source code tracking and repository management.' },
    { name: 'GitHub', icon: 'devicon-github-original', color: '#888888', category: 'tools', desc: 'Cloud repository hosting service used for CI/CD pipelines and team collaboration.' },
    { name: 'DevTools', icon: 'devicon-chrome-plain', color: '#4285F4', category: 'tools', desc: 'Essential browser tool for UI tweaking, DOM debugging, and loading diagnostics.' },
    { name: 'Postman', icon: 'devicon-postman-plain', color: '#FF6C37', category: 'tools', desc: 'API testing platform utilized for verifying Django REST endpoints.' },
    { name: 'Figma', icon: 'devicon-figma-plain', color: '#F24E1E', category: 'tools', desc: 'Prototyping design tool used to draft, iterate, and mock up interfaces.' },
    { name: 'Linux', icon: 'devicon-linux-plain', color: '#FCC624', category: 'tools', desc: 'OS knowledge for managing production servers, terminal scripting, and processes.' }
  ];

  const matrixGrid = document.getElementById('skillsMatrixGrid');
  const matrixTabs = document.querySelectorAll('.matrix-tab');

  if (matrixGrid && matrixTabs.length > 0) {
    const renderSkills = (category) => {
      // Clear existing grid
      matrixGrid.innerHTML = '';
      
      const filtered = category === 'all' 
        ? skillsData 
        : skillsData.filter(skill => skill.category === category);

      filtered.forEach((skill, index) => {
        const card = document.createElement('div');
        card.className = 'matrix-card';
        card.style.setProperty('--brand-color', skill.color);
        card.style.setProperty('--delay-offset', `${index * 0.05}s`);

        const isFontAwesome = skill.icon.startsWith('fas');
        const iconMarkup = isFontAwesome 
          ? `<i class="card-icon ${skill.icon}"></i>`
          : `<i class="card-icon ${skill.icon} colored"></i>`;

        card.innerHTML = `
          <div class="card-spotlight"></div>
          <div class="card-front-content">
            ${iconMarkup}
            <h4 class="card-title">${skill.name}</h4>
          </div>
          <div class="card-hover-details">
            <h5 class="detail-title">${skill.name}</h5>
            <p class="detail-desc">${skill.desc}</p>
          </div>
        `;

        matrixGrid.appendChild(card);

        // 3D Parallax Tilt Effect
        card.addEventListener('mousemove', (e) => {
          const styleTheme = document.documentElement.getAttribute('data-theme-style') || 'default';
          
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // Set variables for spotlight follow
          card.style.setProperty('--mx', `${x}px`);
          card.style.setProperty('--my', `${y}px`);

          if (styleTheme === 'doodle') {
            // Doodle has a wobbly, offset scale response
            const rotate = (Math.random() - 0.5) * 6;
            card.style.transform = `scale(1.05) rotate(${rotate}deg)`;
          } else {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Modern & Neobrutalism 3D Tilt calculation
            const maxTilt = styleTheme === 'neobrutalism' ? 6 : 12;
            const rotateX = ((y - centerY) / centerY) * -maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            
            if (styleTheme === 'neobrutalism') {
              card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(-4px, -4px)`;
            } else {
              card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
            }
          }
        });

        // Reset Card position
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.setProperty('--mx', `-50%`);
          card.style.setProperty('--my', `-50%`);
        });
      });

      // Trigger animation entry
      setTimeout(() => {
        const cards = matrixGrid.querySelectorAll('.matrix-card');
        cards.forEach(card => card.classList.add('visible'));
      }, 50);
    };

    // Tab switcher events
    matrixTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        matrixTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const cat = tab.getAttribute('data-category');
        renderSkills(cat);
      });
    });

    // Initial load
    renderSkills('all');
  }

});


