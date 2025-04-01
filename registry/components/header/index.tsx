'use client';

import {
  Menu,
  X,
  Home,
  Info,
  Mail,
  LogIn,
  UserPlus,
  Briefcase,
  PenSquare,
} from 'lucide-react';
import { useState } from 'react';

export default function HeaderThree() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='p-4 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'>
      <nav className='container mx-auto flex justify-between items-center max-w-7xl px-4'>
        <img
          className='w-10 transition-all hover:scale-105 duration-300'
          src='https://olova.js.org/olova.png'
          alt='Website Logo'
        />

        <button
          className='lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label='Toggle menu'
        >
          {isMenuOpen ? (
            <X
              size={24}
              className='text-gray-700 dark:text-gray-300 rotate-90 transition-transform duration-300'
            />
          ) : (
            <Menu
              size={24}
              className='text-gray-700 dark:text-gray-300 transition-transform duration-300'
            />
          )}
        </button>

        <ul className='hidden lg:flex justify-center items-center gap-6 xl:gap-8'>
          <li>
            <a
              href='#'
              className='flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 group'
            >
              <Home
                size={18}
                className='group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors'
              />
              <span>Home</span>
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 group'
            >
              <Info
                size={18}
                className='group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors'
              />
              <span>About</span>
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 group'
            >
              <Briefcase
                size={18}
                className='group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors'
              />
              <span>Services</span>
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 group'
            >
              <PenSquare
                size={18}
                className='group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors'
              />
              <span>Blog</span>
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 group'
            >
              <Mail
                size={18}
                className='group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors'
              />
              <span>Contact</span>
            </a>
          </li>
        </ul>

        <div className='hidden lg:flex gap-3 xl:gap-4'>
          <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-md group'>
            <LogIn
              size={18}
              className='group-hover:text-blue-500 dark:group-hover:text-blue-400'
            />
            <span>Login</span>
          </button>
          <button className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg group'>
            <UserPlus
              size={18}
              className='group-hover:scale-110 transition-transform'
            />
            <span>Signup</span>
          </button>
        </div>

        {isMenuOpen && (
          <div className='lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-xl p-6 animate-slide-down border-t border-gray-200 dark:border-gray-800'>
            <ul className='flex flex-col gap-4 mb-6'>
              <li>
                <a
                  href='#'
                  className='flex items-center gap-3 py-3 px-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300'
                >
                  <Home size={20} />
                  <span className='text-lg font-medium'>Home</span>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center gap-3 py-3 px-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300'
                >
                  <Info size={20} />
                  <span className='text-lg font-medium'>About</span>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center gap-3 py-3 px-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300'
                >
                  <Briefcase size={20} />
                  <span className='text-lg font-medium'>Services</span>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center gap-3 py-3 px-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300'
                >
                  <PenSquare size={20} />
                  <span className='text-lg font-medium'>Blog</span>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center gap-3 py-3 px-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300'
                >
                  <Mail size={20} />
                  <span className='text-lg font-medium'>Contact</span>
                </a>
              </li>
            </ul>
            <div className='flex flex-col gap-4'>
              <button className='flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-md text-lg font-medium'>
                <LogIn size={20} />
                <span>Login</span>
              </button>
              <button className='flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg text-lg font-medium'>
                <UserPlus size={20} />
                <span>Signup</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
