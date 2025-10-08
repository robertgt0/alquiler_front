'use client';

import React from "react";
import { MagnifyingGlassIcon, BellIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">TrabajosBolivia</h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Ofertas</a>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Empresas</a>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Freelancers</a>
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <BellIcon className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <UserIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
