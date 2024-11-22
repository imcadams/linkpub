'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';

export default function Navbar() {
  const pathname = usePathname();
  const { profile } = useProfile();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo/Home */}
            <Link 
              href="/dashboard" 
              className="flex items-center px-2 py-2 text-gray-900 font-bold"
            >
              LinkPub
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/dashboard'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              My Links
            </Link>

            <Link
              href="/dashboard/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/dashboard/settings'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Settings
            </Link>

            {/* Profile Preview Link */}
            {profile && (
              <Link
                href={`/${profile.username}`}
                className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View Public Page
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
