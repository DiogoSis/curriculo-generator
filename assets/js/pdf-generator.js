document.addEventListener('DOMContentLoaded', function() {
  console.log("PDF Generator script loaded");
    const generatePdfButton = document.getElementById('generate-ats-pdf');
  
  if (generatePdfButton) {
    console.log("PDF button found, adding event listener");
    generatePdfButton.addEventListener('click', generateAtsPdf);
  } else {
    console.error("PDF button not found");
  }
});

function generateAtsPdf() {
  console.log("generateAtsPdf function called");
  
  const loadingMessage = document.createElement('div');
  loadingMessage.className = 'loading-message';
  loadingMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando PDF...';
  document.body.appendChild(loadingMessage);
  
  setTimeout(() => {
    try {
      console.log("jsPDF object:", window.jspdf);

      if (!window.jspdf) {
        console.error("jsPDF não foi carregado. Objeto window.jspdf:", window.jspdf);
        throw new Error("jsPDF não está disponível. Verifique a conexão com o CDN.");
      }
      
      // Importar jsPDF da biblioteca carregada
      const { jsPDF } = window.jspdf;
      console.log("jsPDF loaded successfully");
      
      // Criar novo documento PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Extrair conteúdo para o PDF ATS
      const content = extractAtsContent();
      console.log("Content extracted:", content);
      
      // Configurações de texto
      doc.setFont('helvetica');
      doc.setFontSize(11);
      
      // Margens
      const margin = 20;
      let yPos = margin;
      
      // Título
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('DIOGO DE ASSIS', margin, yPos);
      yPos += 10;
      
      // Subtítulo
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Desenvolvedor Full-Stack', margin, yPos);
      yPos += 10;
      
      // Contato
      doc.setFontSize(10);
      const contactInfo = [
        'Email: diogodeassis777@gmail.com',
        'Telefone: (21) 97066-9909',
        'Endereço: Rua Santo André LT20 QD20, Nova Iguaçu / 26298-662 - RJ',
        'LinkedIn: linkedin.com/in/diogosis',
        'GitHub: github.com/DiogoSis',
        'Site: www.diogoluna.cloud'
      ];
      
      contactInfo.forEach(info => {
        doc.text(info, margin, yPos);
        yPos += 5;
      });
      
      yPos += 5;
      
      // Seções principais
      for (const section of content) {
        // Título da seção
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title.toUpperCase(), margin, yPos);
        yPos += 8;
        
        // Conteúdo da seção
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        if (section.type === 'paragraph') {
          // Texto para parágrafos
          const lines = doc.splitTextToSize(section.content, 170);
          lines.forEach(line => {
            // Verificar se precisamos de uma nova página
            if (yPos > 270) {
              doc.addPage();
              yPos = margin;
            }
            
            doc.text(line, margin, yPos);
            yPos += 5;
          });
          
        } else if (section.type === 'list') {
          // Texto para listas
          section.items.forEach(item => {
            // Verificar se precisamos de uma nova página
            if (yPos > 270) {
              doc.addPage();
              yPos = margin;
            }
            
            const lines = doc.splitTextToSize(`• ${item}`, 165);
            lines.forEach((line, index) => {
              const xPos = index === 0 ? margin : margin + 5;
              doc.text(line, xPos, yPos);
              yPos += 5;
            });
            
            yPos += 2;
          });
          
        } else if (section.type === 'experience') {
          // Texto para experiências
          section.items.forEach(exp => {
            // Verificar se precisamos de uma nova página
            if (yPos > 260) {
              doc.addPage();
              yPos = margin;
            }
            
            doc.setFont('helvetica', 'bold');
            doc.text(`${exp.title} - ${exp.company} (${exp.period})`, margin, yPos);
            yPos += 5;
            
            doc.setFont('helvetica', 'normal');
            exp.responsibilities.forEach(resp => {
              const lines = doc.splitTextToSize(`• ${resp}`, 165);
              lines.forEach((line, index) => {
                const xPos = index === 0 ? margin : margin + 5;
                
                // Nova página se necessário
                if (yPos > 270) {
                  doc.addPage();
                  yPos = margin;
                }
                
                doc.text(line, xPos, yPos);
                yPos += 5;
              });
            });
            
            yPos += 5;
          });
        } else if (section.type === 'skills') {
          // Habilidades em formato de texto (melhor para ATS)
          const skillGroups = section.groups;
          
          for (const group of skillGroups) {
            // Verificar se precisamos de uma nova página
            if (yPos > 270) {
              doc.addPage();
              yPos = margin;
            }
            
            doc.setFont('helvetica', 'bold');
            doc.text(group.name, margin, yPos);
            yPos += 5;
            
            doc.setFont('helvetica', 'normal');
            const skillsText = group.skills.join(', ');
            const lines = doc.splitTextToSize(skillsText, 165);
            
            lines.forEach(line => {
              // Nova página se necessário
              if (yPos > 270) {
                doc.addPage();
                yPos = margin;
              }
              
              doc.text(line, margin, yPos);
              yPos += 5;
            });
            
            yPos += 5;
          }
        }
        
        yPos += 10; // Espaço entre seções
      }
      
      // Adicionar rodapé
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Currículo ATS - Diogo de Assis - Página ${i} de ${pageCount}`, margin, 290);
      }
      
      // Salvar o PDF
      console.log("Saving PDF...");
      doc.save('Curriculo_ATS_Diogo_de_Assis.pdf');
      console.log("PDF saved!");
      
      // Remover mensagem de carregamento
      document.body.removeChild(loadingMessage);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF: ' + error.message);
      
      // Remover mensagem de carregamento em caso de erro
      document.body.removeChild(loadingMessage);
    }
  }, 100);
}

/**
 * Extrai o conteúdo da página em formato otimizado para ATS
 */
function extractAtsContent() {
  const content = [];
  
  // Sobre Mim
  const aboutSection = document.getElementById('sobre');
  if (aboutSection) {
    const paragraphs = aboutSection.querySelectorAll('p');
    let aboutText = '';
    paragraphs.forEach(p => {
      aboutText += p.textContent + ' ';
    });
    
    content.push({
      title: 'Resumo Profissional',
      type: 'paragraph',
      content: aboutText.trim()
    });
  }
  
  // Experiência Profissional
  const experienceSection = document.getElementById('experiencia');
  if (experienceSection) {
    const experienceItems = [];
    const timelineItems = experienceSection.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
      const period = item.querySelector('.year').textContent;
      const title = item.querySelector('h3').textContent;
      const company = item.querySelector('.details p').textContent;
      
      const responsibilities = [];
      const respItems = item.querySelectorAll('li');
      respItems.forEach(li => {
        responsibilities.push(li.textContent);
      });
      
      experienceItems.push({
        period,
        title,
        company,
        responsibilities
      });
    });
    
    content.push({
      title: 'Experiência Profissional',
      type: 'experience',
      items: experienceItems
    });
  }
  
  // Formação Acadêmica
  const educationSection = document.getElementById('formacao');
  if (educationSection) {
    const educationItems = [];
    const timelineItems = educationSection.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
      const period = item.querySelector('.year').textContent;
      const degree = item.querySelector('h3').textContent;
      const institution = item.querySelector('.details p').textContent;
      
      educationItems.push(`${degree} - ${institution} (${period})`);
    });
    
    content.push({
      title: 'Formação Acadêmica',
      type: 'list',
      items: educationItems
    });
  }
  
  // Conhecimentos
  const knowledgeSection = document.getElementById('conhecimentos');
  if (knowledgeSection) {
    const knowledgeItems = [];
    const listItems = knowledgeSection.querySelectorAll('li');
    
    listItems.forEach(item => {
      knowledgeItems.push(item.textContent);
    });
    
    content.push({
      title: 'Conhecimentos',
      type: 'list',
      items: knowledgeItems
    });
  }
  
  // Realizações
  const achievementsSection = document.getElementById('realizacoes');
  if (achievementsSection) {
    const achievementItems = [];
    const listItems = achievementsSection.querySelectorAll('li');
    
    listItems.forEach(item => {
      achievementItems.push(item.textContent);
    });
    
    content.push({
      title: 'Realizações',
      type: 'list',
      items: achievementItems
    });
  }
  
  // Habilidades
  const skillsSection = document.getElementById('habilidades');
  if (skillsSection) {
    const skillGroups = [];
    const groups = skillsSection.querySelectorAll('.skills-group');
    
    groups.forEach(group => {
      const groupName = group.querySelector('h3').textContent;
      const skills = [];
      
      const skillItems = group.querySelectorAll('.skill-item');
      skillItems.forEach(item => {
        // Extrair apenas o nome da habilidade (sem o nível)
        const skillName = item.textContent.trim().split(' ')[0];
        skills.push(skillName);
      });
      
      skillGroups.push({
        name: groupName,
        skills
      });
    });
    
    content.push({
      title: 'Habilidades Técnicas',
      type: 'skills',
      groups: skillGroups
    });
  }
  
  // Soft Skills
  const softSkillsSection = document.getElementById('soft-skills');
  if (softSkillsSection) {
    const softSkillItems = [];
    const items = softSkillsSection.querySelectorAll('.soft-skill');
    
    items.forEach(item => {
      softSkillItems.push(item.textContent);
    });
    
    content.push({
      title: 'Habilidades Comportamentais',
      type: 'list',
      items: softSkillItems
    });
  }
  
  return content;
}