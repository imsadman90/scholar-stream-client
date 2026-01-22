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
  const socialLinks = [
    { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
    { icon: FaXTwitter, href: "https://x.com", label: "Twitter" },
    { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  ];

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        id="contact"
        className="relative text-white py-20 overflow-hidden rounded-3xl glass-panel"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/15 to-transparent" />
        <div className="absolute inset-0 grid-pattern" aria-hidden="true" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have questions, feedback, or
            partnership ideas, our team is here to help.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="glass-panel rounded-2xl shadow-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Send Us a Message
              </h2>

              {status === "success" && (
                <div className="mb-6 p-4 bg-emerald-500/20 text-emerald-100 rounded-lg">
                  Thank you! Your message has been sent successfully. We'll get
                  back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {["name", "email", "subject"].map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-slate-200 mb-2"
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
                      className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
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
                    className="block text-sm font-medium text-slate-200 mb-2"
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
                    className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-900 font-semibold py-4 rounded-lg hover:opacity-90 transition duration-300 shadow-lg disabled:opacity-70"
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Info & Social */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="glass-panel rounded-2xl shadow-2xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-6">
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
                      <div className="bg-white/10 p-3 rounded-full">
                        <Icon className="text-2xl text-cyan-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{title}</h3>
                        {info.map((line, i) => (
                          <p
                            key={i}
                            className={`text-slate-300 text-xs md:text-lg ${
                              i === info.length - 1 && title === "Phone"
                                ? "text-sm text-slate-400"
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
              <div className="glass-panel rounded-2xl shadow-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">
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
                      className="bg-white/5 p-4 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300"
                    >
                      <Icon className="text-2xl text-cyan-200" />
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
