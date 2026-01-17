import { useState } from "react";
import { FaMarker, FaPhone } from "react-icons/fa";
import {
  FaEnvelope,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://facebook.com/scholarstream",
      label: "Facebook",
    },
    {
      icon: FaXTwitter,
      href: "https://x.com/scholarstream",
      label: "X (Twitter)",
    },
    {
      icon: FaLinkedinIn,
      href: "https://linkedin.com/company/scholarstream",
      label: "LinkedIn",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com/scholarstream",
      label: "Instagram",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        id="contact"
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
      >
        <div className="container mx-auto px-6 text-center dark:opacity-60">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg sm:text-xl text-blue-200 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have questions, feedback, or
            partnership ideas, our team is here to help.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="">
        <div className="container mx-auto px-6 dark:bg-base-100 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto dark:bg-base-100">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 dark:bg-base-100 dark:border dark:border-gray-500">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 dark:text-gray-300">
                Send Us a Message
              </h2>

              {status === "success" && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg dark:text-gray-300">
                  Thank you! Your message has been sent successfully. We'll get
                  back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {["name", "email", "subject"].map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:text-gray-300"
                      placeholder={
                        field === "name"
                          ? "John Doe"
                          : field === "email"
                            ? "john@example.com"
                            : "How can we help?"
                      }
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg disabled:opacity-70"
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Info & Social */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-white rounded-2xl shadow-xl p-8 dark:bg-base-100 dark:border dark:border-gray-500">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 dark:text-gray-400">
                  Contact Information
                </h2>
                <div className="space-y-6 ">
                  {[
                    {
                      icon: FaEnvelope,
                      title: "Email",
                      info: [
                        "support@scholarstream.com",
                        "partnerships@scholarstream.com",
                      ],
                    },
                    {
                      icon: FaPhone,
                      title: "Phone",
                      info: ["+1 (555) 123-4567", "Mon-Fri 9AM-6PM EST"],
                    },
                    {
                      icon: FaMarker,
                      title: "Address",
                      info: [
                        "123 Education Lane",
                        "Knowledge City, KC 90210",
                        "United States",
                      ],
                    },
                  ].map(({ icon: Icon, title, info }) => (
                    <div key={title} className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Icon className="text-2xl text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-400">
                          {title}
                        </h3>
                        {info.map((line, i) => (
                          <p
                            key={i}
                            className={`text-gray-600 text-xs md:text-lg dark:text-gray-400 ${
                              i === info.length - 1 && title === "Phone"
                                ? "text-sm  text-gray-500"
                                : ""
                            }`}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-xl p-8 dark:bg-base-100 dark:border dark:border-gray-500">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 dark:text-blue-500">
                  Follow Us
                </h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${label}`}
                      className="bg-gray-100 dark:bg-base-300 p-4 rounded-full hover:bg-blue-100 hover:scale-110 transition-all duration-300"
                    >
                      <Icon className="text-2xl text-gray-700" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
