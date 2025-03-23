export function initInteractions() {
  setupSectionHighlight();
  setupSmoothScroll();
  setupSkillBarsAnimation();
}

function setupSectionHighlight() {
  const sections = document.querySelectorAll('.section');
  
  sections.forEach(section => {
    section.addEventListener('click', function() {
      sections.forEach(s => s.classList.remove('highlight'));
      
      this.classList.add('highlight');
      
      setTimeout(() => {
        this.classList.remove('highlight');
      }, 2000);
    });
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
}

function setupSkillBarsAnimation() {
  const skillSection = document.getElementById('habilidades');
  const skillLevels = document.querySelectorAll('.skill-level');

  checkIfVisible();
  
  window.addEventListener('scroll', checkIfVisible);
  
  function checkIfVisible() {
    const sectionPosition = skillSection.getBoundingClientRect();
    
    if (sectionPosition.top < window.innerHeight && sectionPosition.bottom >= 0) {
      animateSkillBars();
      
      window.removeEventListener('scroll', checkIfVisible);
    }
  }
  
  function animateSkillBars() {
    skillLevels.forEach((skillLevel, index) => {
      skillLevel.style.cssText = 'width: 0';
      
      setTimeout(() => {
        skillLevel.style.cssText = '';
        skillLevel.style.transition = 'all 1s ease-out';
      }, 100 * index);
    });
  }
}