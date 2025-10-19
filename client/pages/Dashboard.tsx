import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ClipboardList, Plus, FileText, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-red-600">Airsonic</span>
                <br />
                <span className="text-gray-900">Work Manager</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Professional HVAC work order management system for Airsonic Mechanical Inc.
                Streamline your service operations with digital forms, signatures, and PDF generation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link to="/create-work-order">
                      <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto">
                        <Plus className="w-5 h-5 mr-2" />
                        Create Work Order
                      </Button>
                    </Link>
                    <Link to="/work-orders">
                      <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                        <ClipboardList className="w-5 h-5 mr-2" />
                        View Orders
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto">
                        <Plus className="w-5 h-5 mr-2" />
                        Get Started
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                        <ClipboardList className="w-5 h-5 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg transform rotate-3 opacity-20" />
                <div className="relative bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">HVAC Services</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-red-600" />
                      Air Conditioning & Heating
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-red-600" />
                      Water Heater & Tankless
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-red-600" />
                      Boiler & Heat Pump Systems
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-red-600" />
                      Rooftop Units
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <ClipboardList className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">Digital Work Orders</h3>
              <p className="text-gray-600">
                Create and manage work orders with detailed checklists, customer info, and service notes.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <FileText className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">PDF Export</h3>
              <p className="text-gray-600">
                Generate professional A4-size PDFs with company branding, signatures, and service details.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Zap className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">Cloud Sync</h3>
              <p className="text-gray-600">
                Securely store all work orders in Firebase with real-time sync across devices.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Begin managing your HVAC service operations with Airsonic Work Manager today.
          </p>
          {user ? (
            <Link to="/create-work-order">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Work Order
              </Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <Plus className="w-5 h-5 mr-2" />
                Sign Up for Free
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; 2024 Airsonic Mechanical Inc. All rights reserved.</p>
          <p className="mt-2">Residential & Commercial HVAC Services</p>
        </div>
      </footer>
    </div>
  );
}
