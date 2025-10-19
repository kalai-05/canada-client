export interface ChecklistItem {
  label: string;
  ok: boolean;
  requiresAttention: boolean;
}

export interface Checklist {
  compressors: ChecklistItem[];
  condenser: ChecklistItem[];
  evaporator: ChecklistItem[];
  refrigerantCircuit: ChecklistItem[];
  fanFanDrives: ChecklistItem[];
  heatingNaturalGas: ChecklistItem[];
  other: ChecklistItem[];
  electricalControls: ChecklistItem[];
}

export interface MaterialEntry {
  source: string;
  qty: number;
  description: string;
  po: string;
}

export interface HoursEntry {
  date: string;
  hours: number;
  ot: number;
  rt: number;
  parking: number;
  tech: string;
  initial: string;
}

export interface WorkOrder {
  id?: string;
  workOrderId: string;
  customerId: string;
  customerName: string;
  address: string;
  pmaType: string;
  date: string;
  indoorAirQuality: string;
  checklist: Checklist;
  overallCondition: string;
  siteConditions: {
    garbageRemoval: boolean;
    roofCondition: boolean;
    guardRailsRequired: boolean;
    other: string;
  };
  safetyInfo: {
    safetyConsidered: boolean;
    redTagIssued: boolean;
    refrigerantLeakDetected: boolean;
  };
  comments: string;
  recommendations: string;
  immediateAttentionRequired: boolean;
  recommendationToFollow: boolean;
  materials: MaterialEntry[];
  hours: HoursEntry[];
  authorizedBy: string;
  spokeWith: string;
  customerSignature: string;
  technicianSignature: string;
  po: string;
  createdAt: string;
  updatedAt: string;
}
