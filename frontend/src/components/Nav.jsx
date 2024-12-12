import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchUserDetails, logoutUser } from '../features/authSlice';
import { toast } from 'react-toastify';

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, authTokens, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authTokens) {
      dispatch(fetchUserDetails());
    }
    
  }, [authTokens, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('User Logged out');
    navigate('/login');
  };

  const username = user?.username; // Safely access username

  const navigation = [
    { name: 'Tasks', href: '/tasks' },
    { name: 'Projects', href: '/' },
    // { name: 'Add Projects', href: '/create_project' },
    { name: 'Add Tasks', href: '/create_task' },
  ];

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo or Headline */}
          <div className="flex-shrink-0 text-white text-2xl font-bold">
            Project Management System
          </div>

          {/* Show navigation only if the user exists */}
          {user && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden sm:flex items-center space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                  Hi {username}
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="sm:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && user && (
        <div className="sm:hidden px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                isActive
                  ? 'bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
              }
            >
              {item.name}
            </NavLink>
          ))}
          <div className="border-t border-gray-700 pt-2">
            <div className="text-gray-300 px-3 py-2">{username}</div>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}