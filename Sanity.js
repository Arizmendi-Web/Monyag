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

  function loadHeroCarousel(container, lang) {
    // ...unchanged, same as before...
  }

  // NEW: fills in the "Our Services" grid (Decoration, Tents, Tables and Chairs, Backdrops and Centerpieces)
  function loadServicesSection(container, lang) {
    const servicesQuery = encodeURIComponent(`*[_type == "servicesSection" && language == "${lang}"][0].services`);
    const servicesUrl = `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}?query=${servicesQuery}`;

    fetch(servicesUrl)
      .then(res => res.json())
      .then(({ result }) => {
        if (!result || !Array.isArray(result) || result.length === 0) return;

        const existingItems = Array.from(container.querySelectorAll('.u-gallery-item'));
        if (existingItems.length === 0) return;

        result.forEach((item, index) => {
          const imageUrl = getSanityImageUrl(item.image);
          let itemEl = existingItems[index];

          if (!itemEl) {
            // More Sanity items than template cards: clone the last real one
            const template = existingItems[existingItems.length - 1];
            itemEl = template.cloneNode(true);
            container.appendChild(itemEl);
            existingItems.push(itemEl);
          }

          const img = itemEl.querySelector('img.u-back-image');
          if (img) {
            img.src = imageUrl;
            img.dataset.src = imageUrl;
            img.alt = item.label || '';
          }
          const heading = itemEl.querySelector('.u-gallery-heading');
          if (heading) heading.textContent = item.label || '';

          // Optional: only overwrite the link if you added one in Sanity for this item
          if (item.link) {
            itemEl.dataset.href = item.link;
          }
        });

        // Remove any leftover template cards beyond what Sanity returned
        const allItems = Array.from(container.querySelectorAll('.u-gallery-item'));
        for (let i = result.length; i < allItems.length; i++) {
          allItems[i].remove();
        }
      })
      .catch(err => console.error('Error fetching services section:', err));
  }

  // Hero carousel (existing)
  const heroContainerEs = document.getElementById('hero-carousel-container-es');
  if (heroContainerEs) loadHeroCarousel(heroContainerEs, 'es');

  const heroContainerEn = document.getElementById('hero-carousel-container-en');
  if (heroContainerEn) loadHeroCarousel(heroContainerEn, 'en');

  // Services section (new)
  const servicesContainerEs = document.getElementById('services-gallery-container-es');
  if (servicesContainerEs) loadServicesSection(servicesContainerEs, 'es');

  const servicesContainerEn = document.getElementById('services-gallery-container-en');
  if (servicesContainerEn) loadServicesSection(servicesContainerEn, 'en');

  // ----------------------------------------------------
  // 2. FETCH POSTS (unchanged)
  // ----------------------------------------------------
  const postsContainer = document.getElementById('posts-container');
  if (postsContainer) {
    // ...unchanged...
  }
});