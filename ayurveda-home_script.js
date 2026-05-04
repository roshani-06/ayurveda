function handleSearch() {
    const q = document.getElementById('hero-search').value.trim();
    if (!q) {
      const inp = document.getElementById('hero-search');
      inp.style.outline = '2px solid #c84b2a';
      inp.focus();
      setTimeout(() => inp.style.outline = '', 1200);
      return;
    }
    window.location.href = '/remedies?q=' + encodeURIComponent(q);
  }
  document.getElementById('hero-search').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSearch();
  });
  document.getElementById('hero-search').addEventListener('input', function() {
    this.style.outline = '';
  });

  function setDosha(el, type) {
    document.querySelectorAll('.dosha-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    console.log('Filter by dosha:', type);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  document.querySelectorAll('.disease-card, .herb-card').forEach(card => {
    card.addEventListener('click', function() {
      if (this.tagName === 'A') return; // Skip if it's a link
      const name = this.querySelector('.disease-name, .herb-name');
      if (name) alert('Opening: ' + name.textContent + '\n(Link this to the detail page)');
    });
  });