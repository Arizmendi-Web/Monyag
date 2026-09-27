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
  // Queries the single document for the matching language and gets its slides array
  const heroQuery = encodeURIComponent(`*[_type == "heroSlide" && language == "${lang}"][0].slides`);
  const heroUrl = `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}?query=${heroQuery}`;

  fetch(heroUrl)
    .then(res => res.json())
    .then(({ result }) => {
      // If no document exists, or the slides array is empty/missing, exit cleanly
      if (!result || !Array.isArray(result) || result.length === 0) return;

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
                alt="${slide.overlayText || 'Hero Slide'}"
              />
            </div>
            <!-- Dynamic Overlay Text per Slide -->
            <div class="u-over-slide u-over-slide-1">
              <h2 class="u-text u-text-default u-title">${slide.overlayText || ''}</h2>
            </div>
          </div>
        `;
      }).join('');
    })
    .catch(err => console.error('Error fetching hero carousel:', err));
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