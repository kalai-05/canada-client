import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { firestoreService } from "@/services/firestore";
import { WorkOrder } from "@/types/workorder";
import { Trash2, Eye, Edit, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function WorkOrderList() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWorkOrders();
    }
  }, [user]);

  const loadWorkOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const orders = await firestoreService.getAllWorkOrders(user.uid);
      setWorkOrders(orders);
    } catch (error) {
      console.error("Error loading work orders:", error);
      toast({
        title: "Error",
        description: "Failed to load work orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !user) return;
    try {
      await firestoreService.deleteWorkOrder(id, user.uid);
      setWorkOrders(workOrders.filter((wo) => wo.id !== id));
      toast({
        title: "Success",
        description: "Work order deleted",
      });
    } catch (error) {
      console.error("Error deleting work order:", error);
      toast({
        title: "Error",
        description: "Failed to delete work order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Work Orders</h1>
          <Link to="/create-work-order">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-5 h-5 mr-2" />
              New Work Order
            </Button>
          </Link>
        </div>

        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">Loading work orders...</p>
          </Card>
        ) : workOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-4">No work orders yet</p>
            <Link to="/create-work-order">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Create First Work Order
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {workOrders.map((order) => (
              <Card
                key={order.id}
                className="p-6 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Work Order ID</p>
                    <p className="font-bold text-gray-900">
                      {order.workOrderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-bold text-gray-900">
                      {order.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-bold text-gray-900">{order.date}</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Link to={`/work-orders/${order.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to={`/work-orders/${order.id}/edit`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(order.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
