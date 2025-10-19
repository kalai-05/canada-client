import { Link } from "react-router-dom";
import AirsonicLogo from "./AirsonicLogo";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <AirsonicLogo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/work-orders" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
            Work Orders
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/create-work-order">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Create Work Order
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
