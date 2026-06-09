'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Brand Info */}
          <div>
            <h3 className="text-lg font-bold font-display text-brand-green mb-2">Beyond Rare</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto md:mx-0">
              Empowering people through connection, advocacy, and meaning. Built by one rare disease patient for another.
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Contact Us</h4>
            <Link
              href="/contact"
              className="text-sm text-gray-400 hover:text-brand-green transition duration-150 font-bold"
            >
              ✉️ Send us a message
            </Link>
            <a
              href="mailto:beyondrare25@gmail.com"
              className="text-sm text-gray-400 hover:text-brand-green transition duration-150"
            >
              beyondrare25@gmail.com
            </a>
            <a
              href="tel:7375007086"
              className="text-sm text-gray-400 hover:text-brand-green transition duration-150"
            >
              (737)-500-7086
            </a>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Follow Our Journey</h4>
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/beyondrare.2025/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-brand-purple text-gray-400 hover:text-white transition duration-200"
                aria-label="Instagram Link"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@beyondrare.2025?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-brand-green text-gray-400 hover:text-white transition duration-200"
                aria-label="TikTok Link"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.03 2.61-.01 3.91-.02.08 1.53.63 3.02 1.62 4.17.94.94 2.22 1.5 3.56 1.66V9.82c-.93-.17-1.85-.54-2.61-1.12-.62-.48-1.11-1.12-1.39-1.86-.06-.01-.1-.01-.15-.02V15.5c-.06 2.37-1.12 4.65-2.99 6.07-2.12 1.64-5.04 2.06-7.53 1.1-2.48-.96-4.38-3.25-4.89-5.88-.63-3.13.78-6.42 3.49-8.03 1.6-.96 3.52-1.2 5.31-.69v4.25c-.75-.38-1.6-.44-2.39-.17-.99.31-1.78 1.15-2.07 2.14-.38 1.25.1 2.69 1.14 3.48.97.77 2.33.87 3.4.24 1.05-.62 1.62-1.84 1.6-3.06V.02z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-gray-500">
          <p>© Beyond Rare 2025. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
