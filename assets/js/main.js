document.addEventListener('DOMContentLoaded', function() {
  import('./interactions.js')
    .then(module => {
      module.initInteractions();
    })
    .catch(err => {
      console.error('Erro ao carregar módulo de interações:', err);
    });
  
  import('./pdf-generator.js')
    .catch(err => {
      console.error('Erro ao carregar módulo de geração de PDF:', err);
    });
  initPage();
});


function initPage() {

  const yearElement = document.querySelector('footer p:last-child');
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = `© ${currentYear} - Diogo de Assis - Todos os direitos reservados`;
  }
  
  const sections = document.querySelectorAll('.section');
  sections.forEach((section, index) => {
    setTimeout(() => {
      section.classList.add('fade-in');
    }, 100 * index);
  });

  addAnimationStyles();
}

function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in {
      animation: fadeIn 0.5s ease forwards;
    }
    
    .section {
      opacity: 0;
    }
  `;
  document.head.appendChild(style);
}