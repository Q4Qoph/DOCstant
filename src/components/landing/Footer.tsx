"use client"

import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import Image from "next/image";

export const Footer = () => {
  const footerSections = [
    {
      title: "Services",
      links: [
        "Healthcare AI Solutions",
        "Practice Management",
        "Workflow Automation",
        "Analytics & Reporting",
        "Enterprise Support"
      ]
    },
    {
      title: "Company",
      links: [
        "About Us",
        "Our Technology",
        "Careers",
        "Press",
        "Partners"
      ]
    },
    {
      title: "Support",
      links: [
        "Help Center",
        "Contact Us",
        "Privacy Policy",
        "Terms of Service",
        "FAQ"
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#" },
    { icon: <Twitter className="h-5 w-5" />, href: "#" },
    { icon: <Instagram className="h-5 w-5" />, href: "#" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#" }
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900  text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Newsletter Section */}
        {/* <div className="py-16 border-b border-white/20">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated with Docstant News
            </h3>
            <p className="text-xl text-white/90 mb-8">
              Get the latest updates on healthcare technology innovations and exclusive insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
              <Button className="bg-white text-primary hover:bg-white/90 shadow-medium">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div> */}

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex">
                <Image src="/logo.png" alt="HIMS Logo" width={200} height={32} />
              </div>

              <p className="text-white/80 text-lg leading-relaxed">
                Revolutionizing healthcare through cutting-edge technology solutions.
                Making medical operations efficient, streamlined, and accessible for practitioners everywhere.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-accent-glow" />
                  <span>contact@intl-coltium.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-accent-glow" />
                  <span>+1 (758) 486-9802</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-accent-glow" />
                  <span>15164-00509, Langata Hardy, Nairobi</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index} className="space-y-6">
                <h4 className="text-xl font-semibold">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-white/80 hover:text-white transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/80">
              © 2024 Docstant. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};