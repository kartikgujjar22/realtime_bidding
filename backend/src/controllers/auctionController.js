const { db } = require("../services/firebaseService");

const createAuction = async (req, res) => {
  try {
    console.log("Received request to create auction.");

    const {
      title,
      description,
      startingPrice,
      minimumBidIncrement,
      endDate,
      category,
      condition,
      imageURL,
    } = req.body;

    const sellerId = req.user?.uid;
    console.log("Seller ID from auth:", sellerId);

    if (!title || !description || !startingPrice || !endDate) {
      console.warn("Missing required fields:", {
        title,
        description,
        startingPrice,
        endDate,
      });
      return res
        .status(400)
        .json({ message: "Missing required auction fields." });
    }

    const auctionData = {
      title,
      description,
      startingPrice: Number(startingPrice),
      minimumBidIncrement: Number(minimumBidIncrement),
      currentPrice: Number(startingPrice),
      endDate: new Date(endDate),
      sellerId,
      winnerId: null,
      status: "active",
      createdAt: new Date(),
      category,
      condition,
      imageURL,
      bids: [],
    };

    console.log("Prepared auction data:", auctionData);

    const auctionRef = await db.collection("auctions").add(auctionData);
    console.log("Auction document created with ID:", auctionRef.id);

    const newAuction = await auctionRef.get();
    console.log("Fetched new auction data from Firestore.");

    res.status(201).json({ id: auctionRef.id, ...newAuction.data() });
  } catch (error) {
    console.error("Error creating auction:", error);
    res.status(500).json({ message: "Error creating auction." });
  }
};

module.exports = {
  createAuction,
};
