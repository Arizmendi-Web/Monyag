document.addEventListener("DOMContentLoaded", function() {
  const projectId = 'zjh62d7j';
  const dataset = 'production';
  const apiVersion = 'v2026-03-01'; // Matches existing API version[cite: 3]

  // Helper to build Sanity CDN Image URLs[cite: 3]
  function getSanityImageUrl(source) {
    if (!source || !source.asset || !source.asset._ref) return '';
    const ref = source.asset._ref;
    const parts = ref.split('-');
    const id = parts[1];
    const dimensions = parts[2];
    const format = parts[3];
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  }

  // ----------------------------------------------------
  // 1. REUSABLE HERO CAROUSEL RENDERER
  // ----------------------------------------------------
  function loadHeroCarousel(container, lang) {
    // GROQ query filters by document type AND language field
    const heroQuery = encodeURIComponent(`*[_type == "heroSlide" && language == "${lang}"]`);
    const heroUrl = `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}?query=${heroQuery}`;

    fetch(heroUrl)
      .then(res => res.json())
      .then(({ result }) => {
        if (!result || result.length === 0) return;

        container.innerHTML = result.map((slide, index) => {
          const imageUrl = getSanityImageUrl(slide.image);
          const isActive = index === 0 ? 'u-active' : '';

          return `
            <div class="${isActive} u-carousel-item u-gallery-item u-carousel-item-${index + 1}">
              <div class="u-back-slide">
                <img 
                  class="u-back-image u-expanded lazyload u-back-image-${index + 1}" 
                  data-src="${imageUrl}" 
                  src="${imageUrl}" 
                  alt="${slide.title || 'Hero Slide'}" 
                  loading="lazy" 
                />
              </div>
              <div class="u-align-center u-container-align-left u-over-slide u-shading u-valign-middle u-over-slide-${index + 1}">
                <h4 class="u-align-left u-custom-font u-gallery-heading u-text-custom-color-2" style="margin-left: 0px; margin-right: auto; font-family: 'Bodoni Moda'; font-size: 1.25rem;"></h4>
                <h2 class="u-align-left u-custom-font u-gallery-text u-text-palette-1-light-2" style="margin-left: 0px; margin-right: auto; font-family: 'Bodoni Moda';">
                  ${slide.overlayText || ''}
                </h2>
              </div>
            </div>
          `;
        }).join('');

        // Trigger Nicepage carousel rebuild if active
        if (window.jQuery && $.fn.carousel) {
          $(container).parent().carousel();
        }
      })
      .catch(err => console.error(`Error loading ${lang} Hero Slides:`, err));
  }

  // Check for Spanish container[cite: 3]
  const heroContainerEs = document.getElementById('hero-carousel-container-es');
  if (heroContainerEs) {
    loadHeroCarousel(heroContainerEs, 'es');
  }

  // Check for English container[cite: 3]
  const heroContainerEn = document.getElementById('hero-carousel-container-en');
  if (heroContainerEn) {
    loadHeroCarousel(heroContainerEn, 'en');
  }

  // ----------------------------------------------------
  // 2. FETCH POSTS[cite: 3]
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
          item.innerHTML = `
            <h2>${post.title || ''}</h2>
            <p>${post.content || ''}</p>
          `;
          postsContainer.appendChild(item);
        });
      })
      .catch(err => console.error('Error loading Sanity content:', err));
  }
});