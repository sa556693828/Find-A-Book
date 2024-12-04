import React from "react";
import Link from "next/link";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { FaBrain } from "react-icons/fa";
import { GoCpu } from "react-icons/go";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-600 to-gray-700 text-[#FFFFFF] py-6 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#E3007F] to-[#ffffff]">
              TAAZE
            </h3>
            <p className="text-sm leading-relaxed">
              Pioneering the future with cutting-edge AI solutions.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <GoCpu className="mr-2 h-5 w-5 text-[#E3007F]" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Home", "About", "Services", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="hover:text-[#E3007F] transition duration-300 relative group"
                  >
                    {item}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#E3007F] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <FaBrain className="mr-2 h-5 w-5 text-[#E3007F]" />
              Connect
            </h4>
            <div className="flex space-x-4">
              {[
                { icon: FaTwitter, href: "https://twitter.com" },
                { icon: FaLinkedin, href: "https://linkedin.com" },
                { icon: FaGithub, href: "https://github.com" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="text-[#FFFFFF] hover:text-[#E3007F] transition-colors duration-300 transform hover:scale-110"
                >
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full h-[2px] my-4 bg-gradient-to-r from-[#E3007F] to-[#FFFFFF]"></div>

        <div className="text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Tazze. All rights reserved.
          </p>
          <p className="text-xs mt-2 text-[#FFFFFF] opacity-70">
            Powered by advanced machine learning and human creativity
          </p>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E3007F] to-[#FFFFFF] opacity-10"></div>
      </div>
    </footer>
  );
};

export default Footer;
