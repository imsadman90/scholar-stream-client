import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";

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
    <footer className="bg-slate-200 py-12">
      <div className="container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Top Section: Logo + Links + Social */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-0">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
              ScholarStream
            </h2>
            <p className="mt-2 text-gray-600 max-w-xs">
              Empowering students worldwide by connecting them to scholarships
              and educational opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-black transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-transform transform hover:scale-110"
                >
                  <Icon className="text-white text-xl" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:justify-between text-center md:text-left text-gray-500 text-sm gap-2 md:gap-0">
          <p>
            &copy; {new Date().getFullYear()} ScholarStream. All rights
            reserved.
          </p>
          <p>
            Designed with <span className="text-red-500">♥</span> by
            ScholarStream Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
