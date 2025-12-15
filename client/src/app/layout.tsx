'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import Header from './components/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Oops!</h1>
            <p className="text-gray-600 mb-4">Something went wrong. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Help Centre</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Safety</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Community</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Forum</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Events</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Hosting</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Become a host</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Host resources</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Community</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Hostify</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">News</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-600">© 2024 Hostify, Inc. All rights reserved</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Terms</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition text-sm">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} bg-white min-h-screen flex flex-col`}>
        <ErrorBoundary>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
