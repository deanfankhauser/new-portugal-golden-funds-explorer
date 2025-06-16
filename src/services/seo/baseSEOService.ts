
export class BaseSEOService {
  protected static baseUrl = 'https://movingto.com/funds';

  protected static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters like commas, periods
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim()
      .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
  }

  protected static createBaseStructuredData() {
    return {
      '@context': 'https://schema.org',
      'publisher': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://movingto.com',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/65bf8df2803e405540708b3c_movingto-logo-white.svg'
        }
      }
    };
  }
}
