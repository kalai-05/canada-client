import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import WorkOrderForm from "@/components/WorkOrderForm";
import { firestoreService } from "@/services/firestore";
import { WorkOrder } from "@/types/workorder";
import { useToast } from "@/components/ui/use-toast";

export default function CreateWorkOrder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Omit<WorkOrder, "id">) => {
    setLoading(true);
    try {
      const id = await firestoreService.createWorkOrder(data);
      toast({
        title: "Success",
        description: "Work order created successfully",
      });
      navigate(`/work-orders/${id}`);
    } catch (error) {
      console.error("Error creating work order:", error);
      toast({
        title: "Error",
        description: "Failed to create work order. Note: Firebase needs to be configured.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Create New Work Order
        </h1>
        <div className="bg-white rounded-lg p-6 md:p-8">
          <WorkOrderForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
