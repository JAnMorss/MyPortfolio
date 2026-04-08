"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import Logo from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        
        <div className="flex items-center gap-2 justify-center">
          <img src={Logo} alt="Logo" className="w-12 h-12 bg-white rounded-full shadow-md" />
          <span>© {new Date().getFullYear()} John Anthony Morales</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/JAnMorss"
            target="_blank"
            className="hover:text-black dark:hover:text-white transition"
          >
            <Github size={18} />
          </a>

          <a
            href="https://www.linkedin.com/in/john-anthony-morales-a401b4276/"
            target="_blank"
            className="hover:text-black dark:hover:text-white transition"
          >
            <Linkedin size={18} />
          </a>

          <a
            href="https://mail.google.com/mail/u/0/#inbox"
            className="hover:text-black dark:hover:text-white transition"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}