import { useState } from 'react';
import { withAdminLayout } from '../../components/AdminLayout';
import { useSettings } from '../../context/SettingsContext';

const colorOptions = [
  { name: 'Blue', value: 'blue' },
  { name: 'Indigo', value: 'indigo' },
  { name: 'Purple', value: 'purple' },
  { name: 'Pink', value: 'pink' },
  { name: 'Red', value: 'red' },
  { name: 'Orange', value: 'orange' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Green', value: 'green' },
  { name: 'Teal', value: 'teal' },
  { name: 'Cyan', value: 'cyan' },
];

function SettingsPage() {
  const { 
    theme, 
    accentColor, 
    isDemoMode, 
    demoCredentials,
    toggleTheme, 
    setAccentColor, 
    toggleDemoMode 
  } = useSettings();
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    // In a real app, you would save these settings to the server
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Customize your dashboard appearance and settings
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={saveSettings}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>

      {saved && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Settings saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Appearance</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Customize how Delight Homes looks on your device.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                Theme
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {theme === 'light' ? (
                    <>
                      <svg className="mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                      Light Mode
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                      Dark Mode
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="accent-color" className="block text-sm font-medium text-gray-700">
                Accent Color
              </label>
              <div className="mt-1 grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setAccentColor(color.value)}
                    className={`h-10 w-full rounded-md border-2 ${accentColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : 'border-transparent'}`}
                    style={{ backgroundColor: `var(--${color.value}-500)` }}
                    title={color.name}
                  >
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Demo Mode</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Toggle demo mode to test the application with sample data.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Enable Demo Mode</p>
              <p className="text-sm text-gray-500">
                {isDemoMode 
                  ? 'Demo mode is currently active.' 
                  : 'Demo mode is currently disabled.'}
              </p>
              {isDemoMode && showDemoCredentials && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-md">
                  <p className="text-sm text-yellow-700">
                    <span className="font-medium">Demo Credentials:</span>
                    <br />
                    Email: {demoCredentials.email}
                    <br />
                    Password: {demoCredentials.password}
                  </p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={toggleDemoMode}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isDemoMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
              role="switch"
              aria-checked={isDemoMode}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isDemoMode ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
          {isDemoMode && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                {showDemoCredentials ? 'Hide' : 'Show'} Demo Credentials
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Analytics</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            View and manage your analytics settings.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Google Analytics</h4>
              <p className="mt-1 text-sm text-gray-500">
                Enable Google Analytics to track visitor behavior.
              </p>
              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Google Analytics</span>
                </label>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Error Tracking</h4>
              <p className="mt-1 text-sm text-gray-500">
                Enable error tracking to monitor application issues.
              </p>
              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Error Tracking</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAdminLayout(SettingsPage);
