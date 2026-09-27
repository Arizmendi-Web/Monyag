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

  function loadHeroCarousel(container, lang, indicatorsList) {
    const heroQuery = encodeURIComponent(`*[_type == "heroSlide" && language == "${lang}"][0].slides`);
    const heroUrl = `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}?query=${heroQuery}`;

    fetch(heroUrl)
      .then(res => res.json())
      .then(({ result }) => {
        if (!result || !Array.isArray(result) || result.length === 0) return;

        const carouselId = container.closest('.u-carousel')?.id || '';

        container.innerHTML = result.map((slide, index) => {
          const imageUrl = getSanityImageUrl(slide.image);
          const isActive = index === 0 ? 'u-active' : '';
          const n = index + 1;

          return `
            <div class="${isActive} u-carousel-item u-gallery-item u-carousel-item-${n}">
              <div class="u-back-slide" data-image-width="1200" data-image-height="1600">
                <img
                  class="u-back-image u-expanded lazyload u-back-image-${n}"
                  data-src="${imageUrl}"
                  src="${imageUrl}"
                  alt="${slide.overlayText || 'Hero Slide'}"
                  loading="lazy"
                />
              </div>
              <div class="u-align-center u-container-align-left u-over-slide u-shading u-valign-middle u-over-slide-${n}">
                <h4 class="u-align-left u-custom-font u-gallery-heading u-text-custom-color-2"></h4>
                <h2 class="u-align-left u-custom-font u-gallery-text u-text-palette-1-light-2">${slide.overlayText || ''}</h2>
              </div>
            </div>
          `;
        }).join('');

        // Rebuild indicator dots to match the actual slide count
        if (indicatorsList) {
          indicatorsList.innerHTML = result.map((_, index) => {
            const active = index === 0 ? 'u-active' : '';
            return `<li data-u-target="#${carouselId}" data-u-slide-to="${index}"
              class="${active} u-active-palette-1-light-2 u-border-2 u-border-active-palette-1-dark-1 u-border-grey-75 u-hover-palette-1-dark-1 u-palette-1-light-1 u-shape-rectangle"
              style="width: 3px; height: 3px;"></li>`;
          }).join('');
        }
      })
      .catch(err => console.error('Error fetching hero carousel:', err));
  }

  const heroContainerEs = document.getElementById('hero-carousel-container-es');
  if (heroContainerEs) {
    const indicators = heroContainerEs.closest('.u-carousel')?.querySelector('.u-carousel-indicators');
    loadHeroCarousel(heroContainerEs, 'es', indicators);
  }

  const heroContainerEn = document.getElementById('hero-carousel-container-en');
  if (heroContainerEn) {
    const indicators = heroContainerEn.closest('.u-carousel')?.querySelector('.u-carousel-indicators');
    loadHeroCarousel(heroContainerEn, 'en', indicators);
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