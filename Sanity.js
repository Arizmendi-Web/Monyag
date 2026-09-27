document.addEventListener("DOMContentLoaded", function() {
  const projectId = 'zjh62d7j';
  const dataset = 'production';
  const apiVersion = 'v2026-03-01';

  function getSanityImageUrl(source) {
    if (!source || !source.asset || !source.asset._ref) return '';
    const ref = source.asset._ref;
    const parts = ref.split('-');
    const id = parts[1];
    const dimensions = parts[2];
    const format = parts[3];
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  }

  function fillCloneable(container, itemSelector, items, fillFn) {
    if (!container || !items || !Array.isArray(items) || items.length === 0) return;
    const existing = Array.from(container.querySelectorAll(itemSelector));
    if (existing.length === 0) return;

    items.forEach((item, index) => {
      let el = existing[index];
      if (!el) {
        const template = existing[existing.length - 1];
        el = template.cloneNode(true);
        el.classList.remove('u-active');
        container.appendChild(el);
        existing.push(el);
      }
      fillFn(el, item, index);
    });

    const all = Array.from(container.querySelectorAll(itemSelector));
    for (let i = items.length; i < all.length; i++) {
      all[i].remove();
    }
  }

  function loadPage(lang) {
    const query = encodeURIComponent(`*[_type == "heroSlide" && language == "${lang}"][0]{slides, services}`);
    const url = `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}?query=${query}`;

    fetch(url)
      .then(res => res.json())
      .then(({ result }) => {
        if (!result) {
          console.warn(`No heroSlide document found for language "${lang}"`);
          return;
        }

        // --- Hero carousel ---
        const heroContainer = document.getElementById(`hero-carousel-container-${lang}`);
        if (heroContainer && result.slides) {
          fillCloneable(heroContainer, '.u-carousel-item', result.slides, (el, slide) => {
            const imageUrl = getSanityImageUrl(slide.image);
            const img = el.querySelector('img.u-back-image');
            if (img) {
              img.src = imageUrl;
              img.dataset.src = imageUrl;
              img.alt = slide.overlayText || 'Hero Slide';
            }
            const heading = el.querySelector('.u-gallery-text');
            if (heading) heading.textContent = slide.overlayText || '';
          });

          const carousel = heroContainer.closest('.u-carousel');
          const indicatorsList = carousel && carousel.querySelector('.u-carousel-indicators');
          if (indicatorsList) {
            indicatorsList.innerHTML = result.slides.map((_, index) => {
              const active = index === 0 ? 'u-active' : '';
              return `<li data-u-target="#${carousel.id}" data-u-slide-to="${index}"
                class="${active} u-active-palette-1-light-2 u-border-2 u-border-active-palette-1-dark-1 u-border-grey-75 u-hover-palette-1-dark-1 u-palette-1-light-1 u-shape-rectangle"
                style="width: 3px; height: 3px;"></li>`;
            }).join('');
          }
        }

        // --- Services grid ---
        const servicesContainer = document.getElementById(`services-gallery-container-${lang}`);
        if (servicesContainer && result.services) {
          fillCloneable(servicesContainer, '.u-gallery-item', result.services, (el, item) => {
            const imageUrl = getSanityImageUrl(item.image);
            const img = el.querySelector('img.u-back-image');
            if (img) {
              img.src = imageUrl;
              img.dataset.src = imageUrl;
              img.alt = item.label || '';
            }
            const heading = el.querySelector('.u-gallery-heading');
            if (heading) heading.textContent = item.label || '';
            if (item.link) el.dataset.href = item.link;
          });
        }
      })
      .catch(err => console.error('Error fetching heroSlide document:', err));
  }

  if (document.getElementById('hero-carousel-container-es') || document.getElementById('services-gallery-container-es')) {
    loadPage('es');
  }
  if (document.getElementById('hero-carousel-container-en') || document.getElementById('services-gallery-container-en')) {
    loadPage('en');
  }

  // ----------------------------------------------------
  // FETCH POSTS
  // ----------------------------------------------------
  const postsContainer = document.getElementById('posts-container');
  if (postsContainer) {
    const postsQuery = encodeURIComponent('*[_type == "post"]');
    const postsUrl = `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}?query=${postsQuery}`;

    fetch(postsUrl)
      .then(res => res.json())
      .then(({ result }) => {
        postsContainer.innerHTML = '';
        if (!result || result.length === 0) return;

        result.forEach(post => {
          const item = document.createElement('div');
          item.className = 'post-item';
          const h2 = document.createElement('h2');
          h2.textContent = post.title || '';
          const p = document.createElement('p');
          p.textContent = post.content || '';
          item.appendChild(h2);
          item.appendChild(p);
          postsContainer.appendChild(item);
        });
      })
      .catch(err => console.error('Error loading Sanity content:', err));
  }
});