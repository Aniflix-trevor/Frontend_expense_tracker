// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark-800 text-text-secondary py-6 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <p className="text-center md:text-left">&copy; {new Date().getFullYear()} ExpenseWise. All rights reserved.</p>
        <div className="flex flex-wrap justify-center space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}