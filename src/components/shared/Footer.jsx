import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";
import { motion } from "framer-motion";

const Footer = () => {
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

  const links = [
    { name: "Home", href: "/" },
    { name: "Scholarships", href: "/scholarships" },
    { name: "FAQ", href: "/#faq" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 py-16 border-t border-white/10">
      <div className="container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Top Section: Logo + Links + Social */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
              ScholarStream
            </h2>
            <p className="mt-3 text-slate-200/80 max-w-xs leading-relaxed">
              Empowering students worldwide by connecting them to scholarships
              and educational opportunities.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <h3 className="font-black text-lg text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {links.map((link, idx) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className="text-slate-200/70 hover:text-cyan-300 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <h3 className="font-black text-lg text-white mb-4">Follow Us</h3>
            <div className="flex space-x-3">
              {socialLinks.map(({ icon: Icon, href, label }, idx) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 border border-white/20 hover:border-cyan-300/50 hover:bg-white/15 p-3 rounded-full transition-all"
                >
                  <Icon className="text-cyan-300 text-lg" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:justify-between text-center md:text-left text-slate-200/60 text-sm gap-4 md:gap-0"
        >
          <p>
            &copy; {new Date().getFullYear()} ScholarStream. All rights
            reserved.
          </p>
          <p>
            Designed with <span className="text-cyan-300 italic">Love</span> by
            ScholarStream Team
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
