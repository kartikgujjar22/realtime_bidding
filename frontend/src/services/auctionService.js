import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

// Collection references
const auctionsRef = collection(db, "auctions");
const bidsRef = collection(db, "bids");

export const auctionService = {
  // Create a new auction
  async createAuction(auctionData, userId) {
    try {
      const auction = {
        ...auctionData,
        createdBy: userId,
        createdAt: serverTimestamp(),
        status: "active",
        currentBid: auctionData.startingPrice,
        totalBids: 0,
      };

      const docRef = await addDoc(auctionsRef, auction);
      return { id: docRef.id, ...auction };
    } catch (error) {
      console.error("Error creating auction:", error);
      throw error;
    }
  },

  // Get all auctions
  async getAllAuctions() {
    try {
      const q = query(auctionsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting auctions:", error);
      throw error;
    }
  },

  // Get auction by ID
  async getAuctionById(auctionId) {
    try {
      const docRef = doc(db, "auctions", auctionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Auction not found");
      }
    } catch (error) {
      console.error("Error getting auction:", error);
      throw error;
    }
  },

  // Get auctions by user
  async getAuctionsByUser(userId) {
    try {
      const q = query(
        auctionsRef,
        where("createdBy", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting user auctions:", error);
      throw error;
    }
  },

  // Get bids for a user
  async getBidsForUser(userId) {
    try {
      const q = query(
        bidsRef,
        where("bidderId", "==", userId),
        orderBy("bidTime", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting user bids:", error);
      throw error;
    }
  },

  // Place a bid
  async placeBid(auctionId, bidAmount, userId, userName) {
    try {
      // Get the auction to check current bid
      const auction = await this.getAuctionById(auctionId);

      if (auction.status !== "active") {
        throw new Error("Auction is not active");
      }

      if (bidAmount <= auction.currentBid) {
        throw new Error("Bid must be higher than current bid");
      }

      // Add bid to bids collection
      const bidData = {
        auctionId,
        bidAmount,
        bidderId: userId,
        bidderName: userName,
        bidTime: serverTimestamp(),
      };

      await addDoc(bidsRef, bidData);

      // Update auction with new current bid
      const auctionRef = doc(db, "auctions", auctionId);
      await updateDoc(auctionRef, {
        currentBid: bidAmount,
        totalBids: auction.totalBids + 1,
        lastBidTime: serverTimestamp(),
      });

      return bidData;
    } catch (error) {
      console.error("Error placing bid:", error);
      throw error;
    }
  },

  // Get bids for an auction
  async getBidsForAuction(auctionId) {
    try {
      const q = query(
        bidsRef,
        where("auctionId", "==", auctionId),
        orderBy("bidTime", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting bids:", error);
      throw error;
    }
  },

  // Update auction status
  async updateAuctionStatus(auctionId, status) {
    try {
      const auctionRef = doc(db, "auctions", auctionId);
      await updateDoc(auctionRef, { status });
    } catch (error) {
      console.error("Error updating auction status:", error);
      throw error;
    }
  },

  // Delete auction
  async deleteAuction(auctionId) {
    try {
      await deleteDoc(doc(db, "auctions", auctionId));
    } catch (error) {
      console.error("Error deleting auction:", error);
      throw error;
    }
  },
};
