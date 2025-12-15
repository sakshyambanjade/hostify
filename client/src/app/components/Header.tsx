'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useStore from '../store/useStore';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { isLoggedIn, userEmail, logout } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="px-6 sm:px-8 md:px-12 lg:px-20 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold text-lg">
            H
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:inline">
            Hostify
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition text-sm">
            Home
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition text-sm">
            Stays
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition text-sm">
            Become a host
          </Link>

          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition text-sm"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
                {userEmail.split('@')[0]}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-6 py-4 space-y-3">
            <Link href="/" className="block text-gray-600 hover:text-gray-900 py-2 text-sm">
              Home
            </Link>
            <Link href="/" className="block text-gray-600 hover:text-gray-900 py-2 text-sm">
              Stays
            </Link>
            <Link href="/" className="block text-gray-600 hover:text-gray-900 py-2 text-sm">
              Become a host
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="block text-gray-600 hover:text-gray-900 py-2 text-sm"
                >
                  Dashboard
                </Link>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs text-gray-600 mb-3">{userEmail}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link href="/login" className="block text-gray-600 hover:text-gray-900 py-2 text-sm">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium text-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
