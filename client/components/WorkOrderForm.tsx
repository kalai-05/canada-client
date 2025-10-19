import { useState } from "react";
import { WorkOrder } from "@/types/workorder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface WorkOrderFormProps {
  initialData?: WorkOrder;
  onSubmit: (data: Omit<WorkOrder, "id">) => Promise<void>;
  loading?: boolean;
}

const checklistDefaults = {
  compressors: [
    { label: "Condition & operation", ok: false, requiresAttention: false },
    { label: "Voltage & amperage", ok: false, requiresAttention: false },
    { label: "Oil heater operation", ok: false, requiresAttention: false },
    { label: "Unloaders & staging", ok: false, requiresAttention: false },
  ],
  condenser: [
    { label: "Coil condition", ok: false, requiresAttention: false },
    { label: "Contactor & disconnect", ok: false, requiresAttention: false },
    { label: "Fan bearings", ok: false, requiresAttention: false },
  ],
  evaporator: [
    { label: "Coil condition", ok: false, requiresAttention: false },
    { label: "Condensate pan", ok: false, requiresAttention: false },
    { label: "Condensate traps", ok: false, requiresAttention: false },
    { label: "Condition of insulation", ok: false, requiresAttention: false },
    { label: "Operation of controls", ok: false, requiresAttention: false },
  ],
  refrigerantCircuit: [
    { label: "Oil & refrigerant charge", ok: false, requiresAttention: false },
    { label: "Operation of controls", ok: false, requiresAttention: false },
    { label: "Condition of insulation", ok: false, requiresAttention: false },
  ],
  fanFanDrives: [
    {
      label: "Lubricate fan & motor bearings",
      ok: false,
      requiresAttention: false,
    },
    { label: "Drive & pully alignment", ok: false, requiresAttention: false },
    { label: "Condition of motor", ok: false, requiresAttention: false },
    { label: "Fan wheel housing", ok: false, requiresAttention: false },
  ],
  heatingNaturalGas: [
    { label: "Burner condition", ok: false, requiresAttention: false },
    { label: "Heat exchanger condition", ok: false, requiresAttention: false },
    { label: "Sheet metal flue piping", ok: false, requiresAttention: false },
    { label: "Air adjustment & controls", ok: false, requiresAttention: false },
  ],
  other: [
    { label: "Thermostat operation", ok: false, requiresAttention: false },
    {
      label: "Operation of pressure switch",
      ok: false,
      requiresAttention: false,
    },
    { label: "Starter & contact pts.", ok: false, requiresAttention: false },
    { label: "Check & adjust belts", ok: false, requiresAttention: false },
  ],
  electricalControls: [
    { label: "Starter & contact pts.", ok: false, requiresAttention: false },
    {
      label: "Operation of pressure switch",
      ok: false,
      requiresAttention: false,
    },
    { label: "Thermostat operation", ok: false, requiresAttention: false },
    { label: "Damper motor", ok: false, requiresAttention: false },
    {
      label: "Relay & contactor operation",
      ok: false,
      requiresAttention: false,
    },
  ],
};

export default function WorkOrderForm({
  initialData,
  onSubmit,
  loading = false,
}: WorkOrderFormProps) {
  const [formData, setFormData] = useState<Omit<WorkOrder, "id">>({
    workOrderId: initialData?.workOrderId || "",
    customerId: initialData?.customerId || "",
    customerName: initialData?.customerName || "",
    address: initialData?.address || "",
    pmaType: initialData?.pmaType || "Preventive Maintenance Agreement",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    indoorAirQuality:
      initialData?.indoorAirQuality ||
      "No suspected biological growth observed during PM",
    checklist: initialData?.checklist || checklistDefaults,
    overallCondition: initialData?.overallCondition || "Fair",
    siteConditions: initialData?.siteConditions || {
      garbageRemoval: false,
      roofCondition: false,
      guardRailsRequired: false,
      other: "",
    },
    safetyInfo: initialData?.safetyInfo || {
      safetyConsidered: false,
      redTagIssued: false,
      refrigerantLeakDetected: false,
    },
    comments: initialData?.comments || "",
    recommendations: initialData?.recommendations || "",
    immediateAttentionRequired:
      initialData?.immediateAttentionRequired || false,
    recommendationToFollow: initialData?.recommendationToFollow || false,
    materials: initialData?.materials || [],
    hours: initialData?.hours || [],
    authorizedBy: initialData?.authorizedBy || "",
    spokeWith: initialData?.spokeWith || "",
    customerSignature: initialData?.customerSignature || "",
    technicianSignature: initialData?.technicianSignature || "",
    po: initialData?.po || "",
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [newMaterial, setNewMaterial] = useState({
    source: "",
    qty: 0,
    description: "",
    po: "",
  });

  const [newHours, setNewHours] = useState({
    date: new Date().toISOString().split("T")[0],
    hours: 0,
    ot: 0,
    rt: 0,
    parking: 0,
    tech: "",
    initial: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const toggleChecklistItem = (
    section: keyof typeof checklistDefaults,
    index: number,
    field: "ok" | "requiresAttention",
  ) => {
    setFormData((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [section]: prev.checklist[section].map((item, i) =>
          i === index ? { ...item, [field]: !item[field] } : item,
        ),
      },
    }));
  };

  const addMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, newMaterial],
    }));
    setNewMaterial({ source: "", qty: 0, description: "", po: "" });
  };

  const removeMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const addHours = () => {
    setFormData((prev) => ({
      ...prev,
      hours: [...prev.hours, newHours],
    }));
    setNewHours({
      date: new Date().toISOString().split("T")[0],
      hours: 0,
      ot: 0,
      rt: 0,
      parking: 0,
      tech: "",
      initial: "",
    });
  };

  const removeHours = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      hours: prev.hours.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Customer Information */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Customer Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workOrderId">Work Order ID</Label>
            <Input
              id="workOrderId"
              value={formData.workOrderId}
              onChange={(e) =>
                setFormData({ ...formData, workOrderId: e.target.value })
              }
              placeholder="e.g., 0141181"
            />
          </div>
          <div>
            <Label htmlFor="customerId">Customer ID</Label>
            <Input
              id="customerId"
              value={formData.customerId}
              onChange={(e) =>
                setFormData({ ...formData, customerId: e.target.value })
              }
              placeholder="e.g., SFTE01"
            />
          </div>
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              placeholder="e.g., Sweets from the Earth"
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="e.g., 101 Canarctic Drive"
            />
          </div>
          <div>
            <Label htmlFor="pmaType">Type of PMA</Label>
            <Input
              id="pmaType"
              value={formData.pmaType}
              onChange={(e) =>
                setFormData({ ...formData, pmaType: e.target.value })
              }
              placeholder="e.g., Major inspection and filter change"
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
        </div>
      </Card>

      {/* Indoor Air Quality */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Indoor Air Quality
        </h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={
                formData.indoorAirQuality ===
                "Presence of suspected biological growth observed"
              }
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  indoorAirQuality: checked
                    ? "Presence of suspected biological growth observed"
                    : "",
                })
              }
            />
            <span>Presence of suspected biological growth observed</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={
                formData.indoorAirQuality ===
                "Customer notified that suspected biological growth was observed"
              }
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  indoorAirQuality: checked
                    ? "Customer notified that suspected biological growth was observed"
                    : "",
                })
              }
            />
            <span>
              Customer notified that suspected biological growth was observed
            </span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={
                formData.indoorAirQuality ===
                "No suspected biological growth observed during PM"
              }
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  indoorAirQuality: checked
                    ? "No suspected biological growth observed during PM"
                    : "",
                })
              }
            />
            <span>No suspected biological growth observed during PM</span>
          </label>
        </div>
      </Card>

      {/* Planned Service Checklist */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Planned Service Checklist
        </h2>
        <div className="space-y-6">
          {Object.entries(checklistDefaults).map(([section, items]) => (
            <div key={section}>
              <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm">
                {section
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        {item.label}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1">
                        <Checkbox
                          checked={
                            formData.checklist[
                              section as keyof typeof checklistDefaults
                            ][index].ok
                          }
                          onCheckedChange={() =>
                            toggleChecklistItem(
                              section as keyof typeof checklistDefaults,
                              index,
                              "ok",
                            )
                          }
                        />
                        <span className="text-xs text-gray-600">OK</span>
                      </label>
                      <label className="flex items-center gap-1">
                        <Checkbox
                          checked={
                            formData.checklist[
                              section as keyof typeof checklistDefaults
                            ][index].requiresAttention
                          }
                          onCheckedChange={() =>
                            toggleChecklistItem(
                              section as keyof typeof checklistDefaults,
                              index,
                              "requiresAttention",
                            )
                          }
                        />
                        <span className="text-xs text-gray-600">Attn</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Overall Equipment Condition */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Overall Equipment Condition
        </h2>
        <div className="flex gap-4">
          {["Poor", "Fair", "Good"].map((condition) => (
            <label key={condition} className="flex items-center gap-2">
              <Checkbox
                checked={formData.overallCondition === condition}
                onCheckedChange={(checked) =>
                  checked &&
                  setFormData({ ...formData, overallCondition: condition })
                }
              />
              <span>{condition}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Site Conditions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Site Conditions
        </h2>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={formData.siteConditions.garbageRemoval}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  siteConditions: {
                    ...formData.siteConditions,
                    garbageRemoval: checked as boolean,
                  },
                })
              }
            />
            <span>Garbage requires removal</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={formData.siteConditions.roofCondition}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  siteConditions: {
                    ...formData.siteConditions,
                    roofCondition: checked as boolean,
                  },
                })
              }
            />
            <span>Roof condition</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={formData.siteConditions.guardRailsRequired}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  siteConditions: {
                    ...formData.siteConditions,
                    guardRailsRequired: checked as boolean,
                  },
                })
              }
            />
            <span>Guard rails required</span>
          </label>
          <div>
            <Label htmlFor="otherConditions">Other</Label>
            <Input
              id="otherConditions"
              value={formData.siteConditions.other}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  siteConditions: {
                    ...formData.siteConditions,
                    other: e.target.value,
                  },
                })
              }
              placeholder="Additional site conditions"
            />
          </div>
        </div>
      </Card>

      {/* Safety Information */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Safety Information
        </h2>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={formData.safetyInfo.safetyConsidered}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  safetyInfo: {
                    ...formData.safetyInfo,
                    safetyConsidered: checked as boolean,
                  },
                })
              }
            />
            <span>Safety Concern</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={formData.safetyInfo.redTagIssued}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  safetyInfo: {
                    ...formData.safetyInfo,
                    redTagIssued: checked as boolean,
                  },
                })
              }
            />
            <span>Red Tag Issued</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={formData.safetyInfo.refrigerantLeakDetected}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  safetyInfo: {
                    ...formData.safetyInfo,
                    refrigerantLeakDetected: checked as boolean,
                  },
                })
              }
            />
            <span>Refrigerant Leak Detected</span>
          </label>
        </div>
      </Card>

      {/* Materials */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Materials / Miscellaneous
        </h2>
        {formData.materials.length > 0 && (
          <div className="mb-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Source</th>
                  <th className="text-left py-2">QTY</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">PO</th>
                  <th className="text-left py-2"></th>
                </tr>
              </thead>
              <tbody>
                {formData.materials.map((material, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{material.source}</td>
                    <td className="py-2">{material.qty}</td>
                    <td className="py-2">{material.description}</td>
                    <td className="py-2">{material.po}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              placeholder="Source"
              value={newMaterial.source}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, source: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="QTY"
              value={newMaterial.qty}
              onChange={(e) =>
                setNewMaterial({
                  ...newMaterial,
                  qty: parseInt(e.target.value) || 0,
                })
              }
            />
            <Input
              placeholder="Description"
              value={newMaterial.description}
              onChange={(e) =>
                setNewMaterial({
                  ...newMaterial,
                  description: e.target.value,
                })
              }
            />
            <Input
              placeholder="PO"
              value={newMaterial.po}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, po: e.target.value })
              }
            />
          </div>
          <Button
            type="button"
            onClick={addMaterial}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Material
          </Button>
        </div>
      </Card>

      {/* Hours Worked */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Hours Worked</h2>
        {formData.hours.length > 0 && (
          <div className="mb-4 overflow-x-auto">
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
                  <th className="text-left py-2"></th>
                </tr>
              </thead>
              <tbody>
                {formData.hours.map((hour, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{hour.date}</td>
                    <td className="py-2">{hour.hours}</td>
                    <td className="py-2">{hour.ot}</td>
                    <td className="py-2">{hour.rt}</td>
                    <td className="py-2">{hour.parking}</td>
                    <td className="py-2">{hour.tech}</td>
                    <td className="py-2">{hour.initial}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => removeHours(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              type="date"
              value={newHours.date}
              onChange={(e) =>
                setNewHours({ ...newHours, date: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Hours"
              value={newHours.hours}
              onChange={(e) =>
                setNewHours({
                  ...newHours,
                  hours: parseInt(e.target.value) || 0,
                })
              }
            />
            <Input
              type="number"
              placeholder="OT"
              value={newHours.ot}
              onChange={(e) =>
                setNewHours({ ...newHours, ot: parseInt(e.target.value) || 0 })
              }
            />
            <Input
              type="number"
              placeholder="RT"
              value={newHours.rt}
              onChange={(e) =>
                setNewHours({ ...newHours, rt: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              type="number"
              placeholder="Parking"
              value={newHours.parking}
              onChange={(e) =>
                setNewHours({
                  ...newHours,
                  parking: parseInt(e.target.value) || 0,
                })
              }
            />
            <Input
              placeholder="Tech"
              value={newHours.tech}
              onChange={(e) =>
                setNewHours({ ...newHours, tech: e.target.value })
              }
            />
            <Input
              placeholder="Initial"
              value={newHours.initial}
              onChange={(e) =>
                setNewHours({ ...newHours, initial: e.target.value })
              }
            />
          </div>
          <Button
            type="button"
            onClick={addHours}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Hours Entry
          </Button>
        </div>
      </Card>

      {/* Comments & Recommendations */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Comments & Recommendations
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              placeholder="Additional comments..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="recommendations">Recommendations</Label>
            <Textarea
              id="recommendations"
              value={formData.recommendations}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  recommendations: e.target.value,
                })
              }
              placeholder="Recommendations for follow-up..."
              rows={4}
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={formData.immediateAttentionRequired}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    immediateAttentionRequired: checked as boolean,
                  })
                }
              />
              <span>Immediate Attention Required</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={formData.recommendationToFollow}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    recommendationToFollow: checked as boolean,
                  })
                }
              />
              <span>Recommendation to Follow</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Signatures & Authorization */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Signatures & Authorization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="authorizedBy">Authorized By</Label>
            <Input
              id="authorizedBy"
              value={formData.authorizedBy}
              onChange={(e) =>
                setFormData({ ...formData, authorizedBy: e.target.value })
              }
              placeholder="Authorized person name"
            />
          </div>
          <div>
            <Label htmlFor="spokeWith">Spoke With</Label>
            <Input
              id="spokeWith"
              value={formData.spokeWith}
              onChange={(e) =>
                setFormData({ ...formData, spokeWith: e.target.value })
              }
              placeholder="Customer name"
            />
          </div>
          <div>
            <Label htmlFor="customerSignature">Customer Signature</Label>
            <Input
              id="customerSignature"
              value={formData.customerSignature}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customerSignature: e.target.value,
                })
              }
              placeholder="Customer signature (base64 or URL)"
            />
          </div>
          <div>
            <Label htmlFor="technicianSignature">Technician Signature</Label>
            <Input
              id="technicianSignature"
              value={formData.technicianSignature}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  technicianSignature: e.target.value,
                })
              }
              placeholder="Technician signature (base64 or URL)"
            />
          </div>
          <div>
            <Label htmlFor="po">P.O. #</Label>
            <Input
              id="po"
              value={formData.po}
              onChange={(e) => setFormData({ ...formData, po: e.target.value })}
              placeholder="Purchase order number"
            />
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Work Order"
              : "Create Work Order"}
        </Button>
      </div>
    </form>
  );
}
