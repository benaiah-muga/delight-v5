import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MobileSidebar({ isOpen, onClose }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is on an admin route
    setIsAdmin(router.pathname.startsWith('/admin'));
  }, [router.pathname]);

  const navItems = isAdmin 
    ? [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/properties', label: 'Properties' },
        { href: '/admin/messages', label: 'Messages' },
        { href: '/admin/settings', label: 'Settings' },
        { href: '/', label: 'Back to Site' },
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/listings', label: 'Listings' },
        { href: '/contact', label: 'Contact' },
        { href: '/admin/login', label: 'Staff Login' },
      ];

  return (
    <div 
      className={`fixed inset-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      transition-transform duration-300 ease-in-out lg:hidden`}
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="relative flex flex-col w-64 h-full bg-gray-800 text-white">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
              DH
            </div>
            <span className="font-semibold">
              {isAdmin ? 'Admin Panel' : 'Delight Homes'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                router.pathname === item.href
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {isAdmin ? 'Admin User' : 'Guest User'}
              </p>
              <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">
                {isAdmin ? 'Administrator' : 'Viewing as guest'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
