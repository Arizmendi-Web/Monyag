import { BigImageArrayInput } from './components/BigImageArrayInput'

const carouselSection = (name, title, description) => ({
  name,
  title,
  description,
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    {
      name: 'heading',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Photos',
      type: 'array',
      components: { input: BigImageArrayInput },
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' },
      description: 'Drag in several photos at once. Drag photos to reorder them.',
      validation: (Rule) => Rule.required().min(1),
    },
  ],
})

export default {
  name: 'galleryPage',
  title: 'Gallery Page',
  type: 'document',
  preview: {
    select: {
      language: 'language',
      media: 'deco.images.0',
    },
    prepare({ language, media }) {
      const labels = { es: 'Español', en: 'English' }
      return {
        title: 'Gallery Page',
        subtitle: language ? labels[language] : 'No language selected',
        media,
      }
    },
  },
  fields: [
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'Español (/es/)', value: 'es' },
          { title: 'English (/en/)', value: 'en' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    // The first argument is the internal name Sanity.js uses. Do not rename it.
    carouselSection('deco', 'Section 1', 'First carousel on the Gallery page (top).'),
    carouselSection('tents', 'Section 2', 'Second carousel on the Gallery page.'),
    carouselSection('tables', 'Section 3', 'Third carousel on the Gallery page.'),
    carouselSection('backdrops', 'Section 4', 'Fourth carousel on the Gallery page (bottom).'),
  ],
}