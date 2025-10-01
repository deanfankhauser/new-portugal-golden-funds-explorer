/**
 * Unified FAQ Schema Service
 * Prevents duplicate FAQ schemas and manages FAQ structured data injection
 */

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaOptions {
  schemaId: string;
  faqs: FAQItem[];
  pageContext?: string;
}

export class FAQSchemaService {
  private static readonly SCHEMA_ATTRIBUTE = 'data-faq-schema';
  private static activeSchemas: Map<string, FAQItem[]> = new Map();

  /**
   * Register FAQs for a page section and inject unified schema
   */
  static registerFAQs(options: FAQSchemaOptions): () => void {
    const { schemaId, faqs, pageContext } = options;

    try {
      // Store FAQs in the active schemas map
      this.activeSchemas.set(schemaId, faqs);

      // Inject or update the unified schema
      this.updateUnifiedSchema(pageContext);

      // Return cleanup function
      return () => this.unregisterFAQs(schemaId, pageContext);
    } catch (error) {
      console.error('[FAQSchemaService] Error registering FAQs:', error);
      return () => {}; // Return no-op cleanup on error
    }
  }

  /**
   * Unregister FAQs and update schema
   */
  private static unregisterFAQs(schemaId: string, pageContext?: string): void {
    try {
      this.activeSchemas.delete(schemaId);
      this.updateUnifiedSchema(pageContext);
    } catch (error) {
      console.error('[FAQSchemaService] Error unregistering FAQs:', error);
    }
  }

  /**
   * Update the unified FAQ schema in the DOM
   */
  private static updateUnifiedSchema(pageContext?: string): void {
    try {
      // Remove existing FAQ schemas
      this.removeExistingSchemas();

      // Consolidate all active FAQs
      const allFAQs = this.consolidateFAQs();

      // Only inject if we have FAQs
      if (allFAQs.length === 0) {
        return;
      }

      // Create unified FAQ schema
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': allFAQs.map((faq) => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        })),
        ...(pageContext && { 'about': pageContext })
      };

      // Inject the unified schema
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(this.SCHEMA_ATTRIBUTE, 'unified');
      script.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(script);
    } catch (error) {
      console.error('[FAQSchemaService] Error updating unified schema:', error);
    }
  }

  /**
   * Remove all existing FAQ schemas
   */
  private static removeExistingSchemas(): void {
    try {
      // Remove schemas with our attribute
      const ownSchemas = document.querySelectorAll(`script[${this.SCHEMA_ATTRIBUTE}]`);
      ownSchemas.forEach(schema => schema.remove());

      // Remove legacy FAQ schemas (backwards compatibility)
      const legacySchemas = document.querySelectorAll('script[data-schema="faq"], script[data-schema="comparison-faq"]');
      legacySchemas.forEach(schema => schema.remove());
    } catch (error) {
      console.error('[FAQSchemaService] Error removing existing schemas:', error);
    }
  }

  /**
   * Consolidate all active FAQs into a single array
   */
  private static consolidateFAQs(): FAQItem[] {
    const allFAQs: FAQItem[] = [];
    const seenQuestions = new Set<string>();

    // Iterate through all active schemas
    this.activeSchemas.forEach((faqs) => {
      faqs.forEach((faq) => {
        // Deduplicate by question text
        const normalizedQuestion = faq.question.toLowerCase().trim();
        if (!seenQuestions.has(normalizedQuestion)) {
          seenQuestions.add(normalizedQuestion);
          allFAQs.push(faq);
        }
      });
    });

    return allFAQs;
  }

  /**
   * Clear all FAQ schemas (useful for route changes)
   */
  static clearAll(): void {
    try {
      this.activeSchemas.clear();
      this.removeExistingSchemas();
    } catch (error) {
      console.error('[FAQSchemaService] Error clearing all schemas:', error);
    }
  }

  /**
   * Get current FAQ count
   */
  static getActiveFAQCount(): number {
    return this.consolidateFAQs().length;
  }
}
