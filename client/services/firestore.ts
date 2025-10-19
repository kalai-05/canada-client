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
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { WorkOrder } from "@/types/workorder";

const COLLECTION_NAME = "workOrders";

export const firestoreService = {
  async createWorkOrder(
    workOrder: Omit<WorkOrder, "id">,
    userId: string
  ) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...workOrder,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating work order:", error);
      throw error;
    }
  },

  async getWorkOrder(id: string, userId: string) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Ensure user owns this work order
        if (data.userId !== userId) {
          throw new Error("Unauthorized");
        }
        return { id: docSnap.id, ...data } as WorkOrder;
      }
      return null;
    } catch (error) {
      console.error("Error fetching work order:", error);
      throw error;
    }
  },

  async getAllWorkOrders(userId: string) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId),
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

  async updateWorkOrder(
    id: string,
    updates: Partial<WorkOrder>,
    userId: string
  ) {
    try {
      // Verify ownership
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists() || docSnap.data().userId !== userId) {
        throw new Error("Unauthorized");
      }

      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating work order:", error);
      throw error;
    }
  },

  async deleteWorkOrder(id: string, userId: string) {
    try {
      // Verify ownership
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists() || docSnap.data().userId !== userId) {
        throw new Error("Unauthorized");
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting work order:", error);
      throw error;
    }
  },
};
