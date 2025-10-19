import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { firestoreService } from "@/services/firestore";
import { WorkOrder } from "@/types/workorder";
import { Download, Edit, ArrowLeft } from "lucide-react";
import { generatePDF } from "@/utils/pdf";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function WorkOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      loadWorkOrder(id);
    }
  }, [id, user]);

  const loadWorkOrder = async (workOrderId: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const order = await firestoreService.getWorkOrder(workOrderId, user.uid);
      console.log("Fetched work order:", order);
      setWorkOrder(order);
    } catch (error) {
      console.error("Error loading work order:", error);
      toast({
        title: "Error",
        description: "Failed to load work order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (workOrder) {
      try {
        await generatePDF(workOrder);
        toast({
          title: "Success",
          description: "PDF downloaded successfully",
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
          title: "Error",
          description: "Failed to generate PDF",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-gray-600">Loading work order...</p>
        </div>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-gray-600 mb-4">Work order not found</p>
          <Link to="/work-orders">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/work-orders" className="inline-block mb-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Work Order {workOrder.workOrderId}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            <Link to={`/work-orders/${workOrder.id}/edit`}>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Edit className="w-5 h-5 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer ID</p>
                <p className="font-semibold text-gray-900">{workOrder.customerId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-semibold text-gray-900">{workOrder.customerName}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold text-gray-900">{workOrder.address}</p>
              </div>
            </div>
          </Card>

          {/* Service Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Service Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Type of PMA</p>
                <p className="font-semibold text-gray-900">{workOrder.pmaType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold text-gray-900">{workOrder.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Indoor Air Quality</p>
                <p className="font-semibold text-gray-900">
                  {workOrder.indoorAirQuality}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Condition</p>
                <p className="font-semibold text-gray-900">
                  {workOrder.overallCondition}
                </p>
              </div>
            </div>
          </Card>

          {/* Comments & Recommendations */}
          {(workOrder.comments || workOrder.recommendations) && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Comments & Recommendations
              </h2>
              {workOrder.comments && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Comments</p>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {workOrder.comments}
                  </p>
                </div>
              )}
              {workOrder.recommendations && (
                <div>
                  <p className="text-sm text-gray-600">Recommendations</p>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {workOrder.recommendations}
                  </p>
                </div>
              )}
            </Card>
          )}

{/* Checklist */}
{workOrder.checklist && Object.keys(workOrder.checklist).length > 0 && (
  <Card className="p-6">
    <h2 className="text-xl font-bold mb-4 text-gray-900">Checklist</h2>

    {/* Split into 2 columns (3 sections per side if 6 total) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(workOrder.checklist).map(([section, items]: any, index) => (
        <div key={section} className="mb-6 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold capitalize mb-3 text-gray-800 border-b pb-2">
            {section.replace(/([A-Z])/g, " $1")}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2 px-2">Label</th>
                  <th className="text-left py-2 px-2">OK</th>
                  <th className="text-left py-2 px-2">Requires Attention</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, i: number) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 px-2">{item.label}</td>
                    <td className="py-2 px-2 text-green-600">
                      {item.ok ? "✅" : "_"}
                    </td>
                    <td className="py-2 px-2 text-yellow-600">
                      {item.requiresAttention ? "⚠️" : "_"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  </Card>
)}


          {/* Safety Info */}
          {workOrder.safetyInfo && Object.keys(workOrder.safetyInfo).length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Safety Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(workOrder.safetyInfo).map(([key, value]: any) => (
                  <div key={key}>
                    <p className="text-sm text-gray-600 capitalize">{key}</p>
                    <p className="font-semibold text-gray-900">
                      {typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Site Conditions */}
          {workOrder.siteConditions &&
            Object.keys(workOrder.siteConditions).length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Site Conditions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(workOrder.siteConditions).map(
                    ([key, value]: any) => (
                      <div key={key}>
                        <p className="text-sm text-gray-600 capitalize">{key}</p>
                        <p className="font-semibold text-gray-900">
                          {typeof value === "boolean"
                            ? value
                              ? "Yes"
                              : "No"
                            : String(value)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </Card>
            )}

          {/* Materials */}
          {workOrder.materials.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Materials</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Source</th>
                      <th className="text-left py-2">QTY</th>
                      <th className="text-left py-2">Description</th>
                      <th className="text-left py-2">PO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workOrder.materials.map((material, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{material.source}</td>
                        <td className="py-2">{material.qty}</td>
                        <td className="py-2">{material.description}</td>
                        <td className="py-2">{material.po}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Hours Worked */}
          {workOrder.hours.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Hours Worked
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Hours</th>
                      <th className="text-left py-2">OT</th>
                      <th className="text-left py-2">RT</th>
                      <th className="text-left py-2">Parking</th>
                      <th className="text-left py-2">Tech</th>
                      <th className="text-left py-2">Initial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workOrder.hours.map((hour, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{hour.date}</td>
                        <td className="py-2">{hour.hours}</td>
                        <td className="py-2">{hour.ot}</td>
                        <td className="py-2">{hour.rt}</td>
                        <td className="py-2">{hour.parking}</td>
                        <td className="py-2">{hour.tech}</td>
                        <td className="py-2">{hour.initial}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  Immediate Attention Required
                </p>
                <p className="font-semibold text-gray-900">
                  {workOrder.immediateAttentionRequired ? "YES" : "NO"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Recommendation to Follow
                </p>
                <p className="font-semibold text-gray-900">
                  {workOrder.recommendationToFollow ? "YES" : "NO"}
                </p>
              </div>
            </div>
          </Card>

                    {/* Signatures */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Signatures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Technician Signature</p>
                <p className="font-semibold text-gray-900">
                  {workOrder.technicianSignature}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer Signature</p>
                <p className="font-semibold text-gray-900">
                  {workOrder.customerSignature}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
