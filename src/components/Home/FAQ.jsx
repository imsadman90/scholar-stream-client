import { useState } from "react";
import { motion } from "framer-motion";
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
    <section
      id="faq"
      className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur text-xs uppercase tracking-[0.25em] font-semibold text-cyan-200 mb-4">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-slate-200/80 max-w-2xl mx-auto">
            Got questions? We've got answers! Find everything you need to know
            about our scholarship platform.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl overflow-hidden hover:shadow-xl shadow-lg shadow-black/20 transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/10 transition-colors"
              >
                <span className="font-semibold text-white text-lg pr-8">
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 transform transition-transform duration-300 ${
                    openIndexes.includes(index) ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="w-6 h-6 text-cyan-300"
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

              <motion.div
                initial={false}
                animate={{
                  height: openIndexes.includes(index) ? "auto" : 0,
                  opacity: openIndexes.includes(index) ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-slate-200/80 leading-relaxed border-t border-white/10 pt-4">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Still Have{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Questions?
            </span>
          </h2>
          <p className="text-slate-200/80 text-lg mb-8">Please Contact Us</p>
        </motion.div>

        <ContactPage />
      </div>
    </section>
  );
};

export default FAQ;
