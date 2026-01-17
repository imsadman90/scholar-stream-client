import { useState } from "react";
import ContactPage from "../../pages/ContactPage";

const FAQ = () => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const faqs = [
    {
      question: "How do I search for scholarships?",
      answer:
        "Simply click on 'All Scholarships' in the navigation menu or use the search button on our homepage. You can filter scholarships by country, degree level, field of study, and application deadline to find the perfect match for you.",
    },
    {
      question: "Are all scholarships listed here legitimate?",
      answer:
        "Yes! We carefully verify each scholarship before listing it on our platform. All scholarships come from reputable universities, organizations, and government bodies. We regularly update our database to ensure accuracy and remove expired opportunities.",
    },
    {
      question: "Do I need to create an account to apply?",
      answer:
        "Creating an account is free and gives you access to save favorite scholarships, track your applications, and receive personalized scholarship recommendations. However, you can browse scholarships without an account.",
    },
    {
      question: "How often are new scholarships added?",
      answer:
        "We add new scholarship opportunities daily! Our team continuously monitors universities and organizations worldwide to bring you the latest funding opportunities. Enable notifications in your dashboard to get alerts about new scholarships matching your profile.",
    },
    {
      question: "Can I apply for multiple scholarships at once?",
      answer:
        "Absolutely! We encourage you to apply for as many scholarships as you qualify for to maximize your chances of securing funding. Our platform helps you organize and track all your applications in one place.",
    },
    {
      question: "What if I need help with my application?",
      answer:
        "We provide comprehensive guides, tips, and resources in our Help Center. You can also reach out to our support team through the contact form, and we'll assist you with any questions about scholarships or the application process.",
    },
    {
      question: "Are there scholarships for international students?",
      answer:
        "Yes! We have a vast collection of scholarships specifically designed for international students. Use our filter options to find scholarships available for students from your country or those offering to study in your desired destination.",
    },
    {
      question: "Is this service really free?",
      answer:
        "Yes, our platform is 100% free to use. We believe education should be accessible to everyone. You'll never be charged to search, save, or track scholarships on our website. Beware of any scholarship that asks for application fees.",
    },
  ];

  const toggleFAQ = (index) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <section id="faq" className="bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 dark:bg-base-100 pt-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 dark:text-gray-400">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-400">
            Got questions? We've got answers! Find everything you need to know
            about our scholarship platform.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:bg-base-200 dark:border-none"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors dark:hover:bg-black/50"
              >
                <span className="font-semibold text-gray-900 text-lg pr-8 dark:text-gray-400">
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 transform transition-transform duration-300 ${
                    openIndexes.includes(index) ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out ${
                  openIndexes.includes(index)
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 dark:text-gray-400">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="flex flex-col space-y-3 items-center justify-center mt-20 mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Still Have{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Question
            </span>
            ?
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            Please Contact Us
          </p>
        </div>

        <ContactPage />
      </div>
    </section>
  );
};

export default FAQ;
