import { useState } from 'react';
import Link from 'next/link';
import MobileSidebar from './MobileSidebar';

export default function Header({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded flex items-center justify-center font-bold mr-3">DH</div>
                  <div className="hidden sm:block">
                    <div className="text-lg font-semibold text-gray-800">Delight Homes Limited</div>
                    <div className="text-xs text-gray-500">Real estate • Kampala</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Home
              </Link>
              <Link href="/listings" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Listings
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Contact
              </Link>
              <Link 
                href="/admin/login" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md"
              >
                Staff Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
