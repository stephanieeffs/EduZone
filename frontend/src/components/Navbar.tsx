/**
 * @fileoverview Navigation bar component that provides the main navigation interface for the application.
 * Includes responsive design with mobile support and dynamic rendering based on user authentication.
 */

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/use-auth";
import ImageWithFallback from "./ImageWithFallback";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

/**
 * Main navigation component for the application.
 * Handles responsive navigation, user authentication state, and route management.
 *
 * Features:
 * - Responsive design with mobile menu
 * - Dynamic navigation based on user authentication
 * - Role-based menu items
 * - Animated transitions
 *
 * @returns {JSX.Element} The rendered navigation bar
 */
const Navbar = () => {
  // Hooks for navigation and authentication
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /**
   * Handles user logout action.
   * Calls the logout function and redirects to home page.
   */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      className="bg-white shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Home Link - Branding section */}
          <Link to="/" className="flex items-center gap-3">
            <ImageWithFallback
              src="/images/frankfield-school-banner.jpg"
              alt="School Logo"
              className="h-10 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-eduNavy leading-tight">
                Edu Zone
              </span>
              <span className="text-xs text-gray-600">
                Educational Management System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Public navigation links */}
            <NavLink href="/" isActive={location.pathname === "/"}>
              Home
            </NavLink>

            <NavLink href="/staff" isActive={location.pathname === "/staff"}>
              Staff
            </NavLink>

            <NavLink
              href="/gallery"
              isActive={location.pathname === "/gallery"}
            >
              Gallery
            </NavLink>

            <NavLink href="/forms" isActive={location.pathname === "/forms"}>
              Forms
            </NavLink>

            {/* Protected navigation links - Only shown when user is authenticated */}
            {user && (
              <>
                <NavLink
                  href="/dashboard"
                  isActive={location.pathname === "/dashboard"}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  href="/library"
                  isActive={location.pathname === "/library"}
                >
                  Library
                </NavLink>

                <NavLink
                  href="/calendar"
                  isActive={location.pathname === "/calendar"}
                >
                  Calendar
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu - Shown only on mobile devices */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Public Links - Available to all users */}
              <DropdownMenuItem asChild>
                <Link to="/" className="w-full">
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/staff" className="w-full">
                  Staff
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/gallery" className="w-full">
                  Gallery
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/forms" className="w-full">
                  Forms
                </Link>
              </DropdownMenuItem>

              {/* Authenticated User Menu Items */}
              {user ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/library" className="w-full">
                      Library
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calendar" className="w-full">
                      Calendar
                    </Link>
                  </DropdownMenuItem>

                  {/* Role-specific menu items */}
                  {user.role === "parent" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/contact-teacher" className="w-full">
                          Contact Teacher
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/feedback" className="w-full">
                          Feedback
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuItem asChild>
                    <Link to="/contact-info" className="w-full">
                      Contact Info
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="w-full">
                      Login
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Authentication Menu */}
          <div className="hidden md:block">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative">
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Role-specific menu items */}
                  {user.role === "parent" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/contact-teacher" className="w-full">
                          Contact Teacher
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/feedback" className="w-full">
                          Feedback
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuItem asChild>
                    <Link to="/contact-info" className="w-full">
                      Contact Info
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

/**
 * Interface for NavLink component props
 * @interface NavLinkProps
 * @property {string} href - The URL the link points to
 * @property {React.ReactNode} children - The content to be rendered inside the link
 * @property {boolean} [isActive] - Whether the link is currently active
 */
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

/**
 * Custom navigation link component with active state styling
 *
 * Features:
 * - Supports both internal and external links
 * - Visual indication of active state
 * - Smooth hover transitions
 * - Underline animation for active state
 *
 * @param {NavLinkProps} props - The component props
 * @returns {JSX.Element} The rendered navigation link
 */
const NavLink = ({ href, children, isActive }: NavLinkProps) => {
  // Check if the link is internal (starts with /) or external
  const isInternal = href.startsWith("/");

  // Common content for both internal and external links
  const content = (
    <span
      className={`relative text-base font-medium transition-colors duration-300 ${
        isActive ? "text-eduBlue" : "text-gray-500 hover:text-eduBlue"
      }`}
    >
      {children}
      {/* Active state indicator - Blue underline */}
      {isActive && (
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-eduBlue rounded" />
      )}
    </span>
  );

  // Render either a React Router Link or a regular anchor tag based on the href
  return isInternal ? (
    <Link to={href}>{content}</Link>
  ) : (
    <a href={href}>{content}</a>
  );
};

export default Navbar;
