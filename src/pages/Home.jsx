// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div
  className="h-[90vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
  style={{
    backgroundImage: 'url("/images/01000000-0aff-0242-0b7d-08dbae85de45_w1080_h608.avif")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundColor: 'rgba(15, 15, 15, 0.7)',
    backgroundBlendMode: 'overlay',
  }}
>
      <div className="max-w-4xl text-center z-10"> {/* z-10 ensures text is above overlay */}
        <h1 className="text-5xl font-extrabold text-primary mb-6 animate-fade-in-up">
          Track Your Expenses, Master Your Finances.
        </h1>
        <p className="text-xl text-text-secondary mb-8 animate-fade-in">
          Effortlessly manage your money with our intuitive expense tracker.
          Categorize, visualize, and gain control over your spending habits.
        </p>
        <div className="flex justify-center space-x-4 animate-scale-in">
          <Link
            to="/register"
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-dark-900 bg-primary hover:bg-opacity-90 transition duration-300 ease-in-out shadow-lg"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 border border-primary text-base font-medium rounded-md text-primary hover:bg-primary hover:text-dark-900 transition duration-300 ease-in-out shadow-lg"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}