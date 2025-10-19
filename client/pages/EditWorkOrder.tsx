import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import WorkOrderForm from "@/components/WorkOrderForm";
import { firestoreService } from "@/services/firestore";
import { WorkOrder } from "@/types/workorder";
import { useToast } from "@/components/ui/use-toast";

export default function EditWorkOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadWorkOrder(id);
    }
  }, [id]);

  const loadWorkOrder = async (workOrderId: string) => {
    try {
      const order = await firestoreService.getWorkOrder(workOrderId);
      setWorkOrder(order);
    } catch (error) {
      console.error("Error loading work order:", error);
      toast({
        title: "Error",
        description: "Failed to load work order",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: Omit<WorkOrder, "id">) => {
    if (!id) return;
    setLoading(true);
    try {
      await firestoreService.updateWorkOrder(id, data);
      toast({
        title: "Success",
        description: "Work order updated successfully",
      });
      navigate(`/work-orders/${id}`);
    } catch (error) {
      console.error("Error updating work order:", error);
      toast({
        title: "Error",
        description: "Failed to update work order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!workOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-gray-600">Loading work order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Edit Work Order {workOrder.workOrderId}
        </h1>
        <div className="bg-white rounded-lg p-6 md:p-8">
          <WorkOrderForm
            initialData={workOrder}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
