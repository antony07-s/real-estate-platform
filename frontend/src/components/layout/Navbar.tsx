"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import {
  Home,
  Plus,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-600 font-bold text-xl"
        >
          <Home size={24} />
          RealEstate
        </Link>

        {/* Desktop Nav — hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/properties"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Properties
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              <Link href="/properties/new">
                <Button size="sm" className="flex items-center gap-1">
                  <Plus size={16} />
                  List Property
                </Button>
              </Link>

              <div className="flex items-center gap-2 text-gray-600">
                <User size={16} />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger — hidden on desktop */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-600 p-1"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-3">
          <Link
            href="/properties"
            onClick={closeMenu}
            className="text-gray-600 font-medium py-1"
          >
            Properties
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="flex items-center gap-2 text-gray-600 font-medium py-1"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              <Link
                href="/properties/new"
                onClick={closeMenu}
                className="flex items-center gap-2 text-gray-600 font-medium py-1"
              >
                <Plus size={16} />
                List Property
              </Link>

              <div className="flex items-center gap-2 text-gray-600 py-1 border-t pt-3">
                <User size={16} />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center justify-center gap-1 w-full"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 border-t pt-3">
              <Link href="/login" onClick={closeMenu}>
                <Button variant="outline" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={closeMenu}>
                <Button size="sm" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
