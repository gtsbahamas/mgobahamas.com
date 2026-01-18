'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/#about' },
  { label: 'Sign Up', href: '/inquiry', highlight: true },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="Mobile Go Bahamas"
                width={56}
                height={50}
                className="w-auto h-12 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#7cb342]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className={`hidden sm:block font-[family-name:var(--font-syne)] text-xl font-bold tracking-tight transition-colors duration-300 ${
              scrolled ? 'text-slate-800' : 'text-white drop-shadow-lg'
            }`}>
              Mobile GO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-full ${
                  item.highlight
                    ? 'bg-[#7cb342] text-white hover:bg-[#558b2f] shadow-lg shadow-[#7cb342]/25 hover:shadow-[#7cb342]/40 hover:scale-105'
                    : scrolled
                    ? 'text-slate-600 hover:text-[#7cb342] hover:bg-[#7cb342]/10'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
                {!item.highlight && (
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#7cb342] transition-all duration-300 -translate-x-1/2 group-hover:w-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Contact Email - Desktop */}
          <a
            href="mailto:info@mgobahamas.com"
            className={`hidden lg:flex items-center gap-2 text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full ${
              scrolled
                ? 'text-slate-500 hover:text-[#7cb342] hover:bg-[#7cb342]/10'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            info@mgobahamas.com
          </a>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 rounded-full transition-all duration-300 ${
                  scrolled ? 'bg-slate-600' : 'bg-white'
                } ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
              />
              <span
                className={`w-full h-0.5 rounded-full transition-all duration-300 ${
                  scrolled ? 'bg-slate-600' : 'bg-white'
                } ${mobileMenuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`w-full h-0.5 rounded-full transition-all duration-300 ${
                  scrolled ? 'bg-slate-600' : 'bg-white'
                } ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="glass-card mx-4 mb-4 rounded-2xl p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                item.highlight
                  ? 'bg-[#7cb342] text-white text-center'
                  : 'text-slate-700 hover:bg-[#7cb342]/10 hover:text-[#7cb342]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="mailto:info@mgobahamas.com"
            className="block py-3 px-4 text-sm text-slate-500 hover:text-[#7cb342] transition-colors"
          >
            info@mgobahamas.com
          </a>
        </nav>
      </div>
    </header>
  );
}
