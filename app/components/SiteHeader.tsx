"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/ulkeler", label: "Ülkeler" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-atlas-border bg-atlas-bg-alt/80 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Globe className="h-6 w-6 text-atlas-gold transition-transform duration-500 group-hover:rotate-12" />
              <span className="font-atlas-serif text-xl font-bold tracking-wide text-atlas-text group-hover:text-atlas-gold-light transition-colors">
                Dünya Ansiklopedisi
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-atlas-gold"
                      : "text-atlas-text-muted hover:text-atlas-gold-light"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* AI Q&A Link */}
            <Link
              href="/sor"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-300 ${
                pathname === "/sor"
                  ? "bg-atlas-gold text-atlas-bg border-atlas-gold shadow-atlas-glow"
                  : "bg-atlas-gold/10 text-atlas-gold border-atlas-gold/20 hover:bg-atlas-gold/20 hover:border-atlas-gold/40"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Yapay Zeka Sor
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-atlas-text-muted hover:bg-atlas-card hover:text-atlas-text focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Ana menüyü aç</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b border-atlas-border bg-atlas-bg-alt overflow-hidden"
          >
            <div className="space-y-1 px-4 pb-4 pt-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-atlas-card text-atlas-gold"
                        : "text-atlas-text-muted hover:bg-atlas-card/50 hover:text-atlas-text"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile AI Q&A Link */}
              <Link
                href="/sor"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium border mt-2 transition-all ${
                  pathname === "/sor"
                    ? "bg-atlas-gold text-atlas-bg border-atlas-gold"
                    : "bg-atlas-gold/10 text-atlas-gold border-atlas-gold/20 hover:bg-atlas-gold/20"
                }`}
              >
                <Sparkles className="h-5 w-5" />
                Yapay Zeka Sor
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}