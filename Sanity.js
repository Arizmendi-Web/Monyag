document.addEventListener("DOMContentLoaded", function() {
  const projectId = 'zjh62d7j';
  const dataset = 'production';
  const apiVersion = 'v2026-03-01';

  // Helper to build Sanity CDN Image URLs
  function getSanityImageUrl(source) {
    if (!source || !source.asset || !source.asset._ref) return '';
    const ref = source.asset._ref;
    const parts = ref.split('-');
    const id = parts[1];
    const dimensions = parts[2];
    const format = parts[3];
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  }


  function loadHeroCarousel(container, lang) {
    const heroQuery = encodeURIComponent(`*[_type == "heroSlide" && language == "${lang}"][0].slides`);
    const heroUrl = `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}?query=${heroQuery}`;

    fetch(heroUrl)
      .then(res => res.json())
      .then(({ result }) => {
        // If no document exists, or the slides array is empty/missing, exit cleanly
        if (!result || !Array.isArray(result) || result.length === 0) return;

        const existingSlides = Array.from(container.querySelectorAll('.u-carousel-item'));
        if (existingSlides.length === 0) return; // nothing to clone from, bail safely

        result.forEach((slide, index) => {
          const imageUrl = getSanityImageUrl(slide.image);
          let slideEl = existingSlides[index];

          if (!slideEl) {
            // More Sanity slides than template slides: clone the last real one
            // so it inherits nicepage's exact styling, then append it.
            const template = existingSlides[existingSlides.length - 1];
            slideEl = template.cloneNode(true);
            slideEl.classList.remove('u-active');
            container.appendChild(slideEl);
            existingSlides.push(slideEl);
          }

          const img = slideEl.querySelector('img.u-back-image');
          if (img) {
            img.src = imageUrl;
            img.dataset.src = imageUrl;
            img.alt = slide.overlayText || 'Hero Slide';
          }
          const heading = slideEl.querySelector('.u-gallery-text');
          if (heading) heading.textContent = slide.overlayText || '';
        });

        // Remove any leftover template slides beyond what Sanity returned
        const allSlides = Array.from(container.querySelectorAll('.u-carousel-item'));
        for (let i = result.length; i < allSlides.length; i++) {
          allSlides[i].remove();
        }

        // Keep the indicator dots in sync with the final slide count
        const carousel = container.closest('.u-carousel');
        const indicatorsList = carousel && carousel.querySelector('.u-carousel-indicators');
        if (indicatorsList) {
          indicatorsList.innerHTML = result.map((_, index) => {
            const active = index === 0 ? 'u-active' : '';
            return `<li data-u-target="#${carousel.id}" data-u-slide-to="${index}"
              class="${active} u-active-palette-1-light-2 u-border-2 u-border-active-palette-1-dark-1 u-border-grey-75 u-hover-palette-1-dark-1 u-palette-1-light-1 u-shape-rectangle"
              style="width: 3px; height: 3px;"></li>`;
          }).join('');
        }
      })
      .catch(err => console.error('Error fetching hero carousel:', err));
  }

  // Check for Spanish container
  const heroContainerEs = document.getElementById('hero-carousel-container-es');
  if (heroContainerEs) {
    loadHeroCarousel(heroContainerEs, 'es');
  }

  // Check for English container
  const heroContainerEn = document.getElementById('hero-carousel-container-en');
  if (heroContainerEn) {
    loadHeroCarousel(heroContainerEn, 'en');
  }

  // ----------------------------------------------------
  // 2. FETCH POSTS
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