import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import MobileSidebar from './MobileSidebar';

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { theme, toggleTheme, isDemoMode } = useSettings();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Apply theme class to html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'tachometer-alt' },
    { name: 'Properties', href: '/admin/properties', icon: 'home' },
    { name: 'Messages', href: '/admin/messages', icon: 'envelope' },
    { name: 'Users', href: '/admin/users', icon: 'users' },
    { name: 'Settings', href: '/admin/settings', icon: 'cog', demo: isDemoMode },
  ];

  const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '/admin/settings' },
  ];

  const handleLogout = async () => {
    const res = await fetch('/api/logout', { method: 'POST' });
    if (res.ok) {
      router.push('/admin/login');
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Mobile sidebar */}
      <MobileSidebar 
        isOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
        isAdmin={true}
      />

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className={`flex flex-col flex-grow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} pt-5 pb-4 overflow-y-auto`}>
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-10 h-10 bg-white text-indigo-700 rounded flex items-center justify-center font-bold text-xl mr-3">
              DH
            </div>
            <span className={`text-white text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Admin Panel</span>
          </div>
          <nav className="mt-5 flex-1 flex flex-col divide-y divide-indigo-800 overflow-y-auto" aria-label="Sidebar">
            <div className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.demo ? 'cursor-not-allowed opacity-50' : ''
                  } ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg
                    className={`mr-3 h-6 w-6 ${
                      theme === 'dark'
                        ? 'text-gray-400 group-hover:text-white'
                        : 'text-gray-500 group-hover:text-gray-900'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className={`relative z-10 flex-shrink-0 flex h-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-b border-gray-200 lg:border-none`}>
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Search bar */}
          <div className="flex-1 px-4 flex justify-between lg:px-6 lg:max-w-6xl mx-auto">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <i className={`fas fa-search ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}></i>
                  </div>
                  <input
                    id="search"
                    name="search"
                    className={`block w-full h-full pl-8 pr-3 py-2 border-transparent ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                        : 'bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent'
                    } sm:text-sm`}
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            {/* User profile dropdown */}
            <div className="ml-4 flex items-center md:ml-6">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                      {user?.name || 'User'}
                      {isDemoMode && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Demo
                        </span>
                      )}
                    </div>
                    <div className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user?.email || 'user@example.com'}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  </button>
                </div>
                
                {/* Dropdown menu */}
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  >
                    {theme === 'dark' ? (
                      <i className="fas fa-sun h-5 w-5"></i>
                    ) : (
                      <i className="fas fa-moon h-5 w-5"></i>
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                    title="Sign out"
                  >
                    <i className="fas fa-sign-out-alt h-5 w-5"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 pb-8">
          {/* Page header */}
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                    {activeNav === 'dashboard' && 'Dashboard'}
                    {activeNav === 'properties' && 'Properties'}
                    {activeNav === 'messages' && 'Messages'}
                    {activeNav === 'settings' && 'Settings'}
                  </h1>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                  {activeNav === 'properties' && (
                    <Link
                      href="/admin/properties/new"
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Property
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="mt-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Add state for profile dropdown
AdminLayout.defaultProps = {
  profileOpen: false,
  setProfileOpen: () => {}
};

export function withAdminLayout(Component) {
  return function WrappedComponent(props) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
      // Fetch user data
      const fetchUser = async () => {
        const res = await fetch('/api/session');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          router.push('/admin/login');
        }
      };

      fetchUser();
    }, [router]);

    return (
      <AdminLayout 
        user={user}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      >
        <Component {...props} user={user} />
      </AdminLayout>
    );
  };
}
