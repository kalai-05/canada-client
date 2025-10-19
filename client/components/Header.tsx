import { Link, useNavigate } from "react-router-dom";
import AirsonicLogo from "./AirsonicLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <AirsonicLogo />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
          >
            Dashboard
          </Link>
          {user && (
            <Link
              to="/work-orders"
              className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
            >
              Work Orders
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/create-work-order">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Create Work Order
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{user.email}</span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
