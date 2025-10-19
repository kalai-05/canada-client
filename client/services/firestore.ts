import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { WorkOrder } from "@/types/workorder";

const COLLECTION_NAME = "workOrders";

export const firestoreService = {
  async createWorkOrder(workOrder: Omit<WorkOrder, "id">) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...workOrder,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating work order:", error);
      throw error;
    }
  },

  async getWorkOrder(id: string) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as WorkOrder;
      }
      return null;
    } catch (error) {
      console.error("Error fetching work order:", error);
      throw error;
    }
  },

  async getAllWorkOrders() {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WorkOrder[];
    } catch (error) {
      console.error("Error fetching work orders:", error);
      throw error;
    }
  },

  async updateWorkOrder(id: string, updates: Partial<WorkOrder>) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating work order:", error);
      throw error;
    }
  },

  async deleteWorkOrder(id: string) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting work order:", error);
      throw error;
    }
  },
};
