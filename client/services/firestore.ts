import { WorkOrder } from "@/types/workorder";

const COLLECTION_NAME = "workOrders";

// Local storage fallback for work orders
// In production, connect Firebase through MCP integrations
const getStorageKey = () => `${COLLECTION_NAME}:all`;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getWorkOrdersFromStorage(): WorkOrder[] {
  try {
    const stored = localStorage.getItem(getStorageKey());
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWorkOrdersToStorage(orders: WorkOrder[]) {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(orders));
  } catch {
    console.error("Failed to save to localStorage");
  }
}

export const firestoreService = {
  async createWorkOrder(workOrder: Omit<WorkOrder, "id">) {
    try {
      const id = generateId();
      const orders = getWorkOrdersFromStorage();
      const newOrder: WorkOrder = {
        ...workOrder,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      orders.push(newOrder);
      saveWorkOrdersToStorage(orders);
      return id;
    } catch (error) {
      console.error("Error creating work order:", error);
      throw error;
    }
  },

  async getWorkOrder(id: string) {
    try {
      const orders = getWorkOrdersFromStorage();
      return orders.find((o) => o.id === id) || null;
    } catch (error) {
      console.error("Error fetching work order:", error);
      throw error;
    }
  },

  async getAllWorkOrders() {
    try {
      const orders = getWorkOrdersFromStorage();
      return orders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Error fetching work orders:", error);
      throw error;
    }
  },

  async updateWorkOrder(id: string, updates: Partial<WorkOrder>) {
    try {
      const orders = getWorkOrdersFromStorage();
      const index = orders.findIndex((o) => o.id === id);
      if (index !== -1) {
        orders[index] = {
          ...orders[index],
          ...updates,
          id,
          updatedAt: new Date().toISOString(),
        };
        saveWorkOrdersToStorage(orders);
      }
    } catch (error) {
      console.error("Error updating work order:", error);
      throw error;
    }
  },

  async deleteWorkOrder(id: string) {
    try {
      const orders = getWorkOrdersFromStorage();
      const filtered = orders.filter((o) => o.id !== id);
      saveWorkOrdersToStorage(filtered);
    } catch (error) {
      console.error("Error deleting work order:", error);
      throw error;
    }
  },
};
