import React from 'react';
import FAQSection from '@/components/common/FAQSection';

const quizFAQs = [
  {
    question: 'How long does the Fund Matcher quiz take?',
    answer: 'The quiz takes about 2 minutes to complete. It consists of 5 simple questions about your investment preferences, including your budget, risk tolerance, nationality, timeline, and income needs.'
  },
  {
    question: 'Is the Fund Matcher quiz free?',
    answer: 'Yes, the Fund Matcher quiz is completely free. We provide personalized fund recommendations at no cost to help you navigate the Portugal Golden Visa investment landscape.'
  },
  {
    question: 'How accurate are the quiz recommendations?',
    answer: 'Our recommendations are based on your stated preferences and current fund data from our directory of CMVM-regulated funds. We match your budget, risk tolerance, nationality, timeline, and investment goals to eligible funds. All recommendations should be verified with professional financial advice.'
  },
  {
    question: 'Can I retake the quiz with different preferences?',
    answer: 'Absolutely! You can retake the quiz as many times as you like to explore different scenarios. Each time you take the quiz, your URL updates with your answers so you can easily share or bookmark specific results.'
  },
  {
    question: 'What happens after I get my results?',
    answer: "You'll see a list of matching funds with key details like minimum investment, target returns, lock-up periods, and fees. You can save funds to your shortlist, compare them side-by-side, or contact fund managers directly through our platform."
  },
  {
    question: 'Are the quiz results saved?',
    answer: 'Your quiz results are encoded in the URL, so you can share them with others or bookmark them for later. If you create an account, you can also save funds to your personal shortlist for comparison.'
  },
  {
    question: 'Why do you ask about my nationality?',
    answer: 'Nationality matters for Golden Visa fund selection, especially for US citizens. US investors need to consider PFIC (Passive Foreign Investment Company) rules that can result in significant tax penalties. We filter for US-compliant funds when you indicate US citizenship.'
  },
  {
    question: 'What if no funds match my criteria?',
    answer: "If no exact matches are found, we'll suggest adjusting your criteria or browsing our full fund directory. Sometimes relaxing the timeline or budget requirements reveals excellent options that still meet your core goals."
  }
];

const QuizPageFAQ: React.FC = () => {
  return (
    <FAQSection 
      faqs={quizFAQs}
      title="Frequently Asked Questions"
      schemaId="fund-matcher-faq"
      noWrapper={true}
    />
  );
};

export default QuizPageFAQ;
