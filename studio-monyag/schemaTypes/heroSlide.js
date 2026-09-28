import { DoneButtonInput } from './components/DoneButtonInput'
import { BigImageInput } from './components/BigImageInput'

export default {
  name: 'heroSlide',
  title: 'Main Page',
  type: 'document',
  // Controls the header title/subtitle at the top of the document editor
  preview: {
    select: {
      language: 'language',
      media: 'slides.0.image',
    },
    prepare({ language, media }) {
      const labels = { es: 'Español', en: 'English' }
      return {
        title: 'Main Page',
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
    {
      name: 'slides',
      title: 'Slides List',
      type: 'array',
      options: {
        layout: 'grid',
      },
      of: [
        {
          type: 'object',
          name: 'slideItem',
          title: 'Slide Item',
          components: { input: DoneButtonInput },
          preview: {
            select: {
              title: 'overlayText',
              media: 'image',
            },
            prepare({ title, media }) {
              return {
                title: title ? `Word: "${title}"` : 'No word entered',
                media,
              }
            },
          },
          fields: [
            {
              name: 'overlayText',
              title: 'Rotating Word',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'image',
              title: 'Banner Photo',
              type: 'image',
              components: { input: BigImageInput },
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    },
    {
      name: 'services',
      title: 'Service Items',
      type: 'array',
      options: {
        layout: 'grid',
      },
      of: [
        {
          type: 'object',
          name: 'serviceItem',
          title: 'Service Item',
          components: { input: DoneButtonInput },
          preview: {
            select: {
              title: 'label',
              media: 'image',
            },
            prepare({ title, media }) {
              return {
                title: title ? `Service: "${title}"` : 'No label entered',
                media,
              }
            },
          },
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'image',
              title: 'Photo',
              type: 'image',
              components: { input: BigImageInput },
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    },
  ],
}