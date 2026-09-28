export default {
  name: 'aboutPage',
  title: 'About Us',
  type: 'document',
  preview: {
    select: {
      language: 'language',
    },
    prepare({ language }) {
      const labels = { es: 'Español', en: 'English' }
      return {
        title: 'About Us',
        subtitle: language ? labels[language] : 'No language selected',
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
      name: 'intro',
      title: 'Main Description',
      type: 'text',
      rows: 10,
      description: 'The large paragraph at the top of the page. Press Enter to start a new line.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'mission',
      title: 'Mission Text',
      type: 'text',
      rows: 5,
      description: 'The paragraph under the "Mission" heading (left side).',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'vision',
      title: 'Vision Text',
      type: 'text',
      rows: 5,
      description: 'The paragraph under the "Vision" heading (right side).',
      validation: (Rule) => Rule.required(),
    },
  ],
}