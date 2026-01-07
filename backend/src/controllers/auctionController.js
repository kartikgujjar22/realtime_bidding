const supabase = require("../config/supabase");
const Joi = require("joi");

const createAuction = async (req, res) => {
  try {
    const { title, description, startingBid, endTime } = req.body;

    // 1. Basic Validation
    if (!title || !startingBid || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Upload Image to Supabase Storage
    let imageUrl = null;

    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      // Unique filename: user_id + timestamp
      const fileName = `${req.user.id}_${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("auctionProductsIMG") // Your bucket name
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: urlData } = supabase.storage
        .from("auctionProductsIMG")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    // 3. Insert into Supabase (PostgreSQL)
    // Notice: We use snake_case keys to match SQL column names
    const { data: auctionData, error: dbError } = await supabase
      .from("auctions")
      .insert([
        {
          title: title,
          description: description,
          starting_bid: parseFloat(startingBid),
          current_bid: parseFloat(startingBid),
          end_time: endTime, // Postgres handles ISO strings well
          image_url: imageUrl,
          seller_id: req.user.id, // From your auth middleware
        },
      ])
      .select(); // Returns the created object

    if (dbError) throw dbError;

    // 4. Success Response
    res.status(201).json(auctionData[0]);
  } catch (err) {
    console.error("Auction Create Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { createAuction };
