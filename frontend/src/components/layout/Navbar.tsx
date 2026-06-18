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
  AlertTriangle,
} from "lucide-react";

const LogoutModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    />
    {/* Modal */}
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
        <LogOut size={26} className="text-blue-600" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Logout?</h2>
        <p className="text-gray-500 text-sm">
          Are you sure you want to logout from your account?
        </p>
      </div>
      <div className="flex gap-3 w-full">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  </div>
)

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    setMenuOpen(false);
    setShowLogoutModal(false);
    router.push("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

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

          {/* Desktop Nav */}
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
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-1"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-600 p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
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
                  onClick={() => {
                    closeMenu()
                    setShowLogoutModal(true)
                  }}
                  className="flex items-center justify-center gap-1 w-full"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 border-t pt-3">
                <Link href="/login" onClick={closeMenu}>
                  <Button variant="outline" size="sm" className="w-full">Login</Button>
                </Link>
                <Link href="/register" onClick={closeMenu}>
                  <Button size="sm" className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
