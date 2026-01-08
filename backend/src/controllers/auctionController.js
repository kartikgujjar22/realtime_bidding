const logger = require("../../logger");
const supabase = require("../config/supabase");
const Joi = require("joi");

const createAuction = async (req, res) => {
  logger.info("--- [START] createAuction Controller ---");

  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    starting_price: Joi.number().required(),
    bid_increment: Joi.number().required(),
    end_time: Joi.date().required(),
  }).unknown(true);

  try {
    // 1. Log Auth Status
    if (!req.user || !req.user.id) {
      logger.error(
        "Authentication Failed: User or User ID is missing in request."
      );
      return res.status(401).json({
        message: "User ID missing from request. Check Auth Middleware.",
      });
    }
    logger.info(`User Authenticated. User ID: ${req.user.id}`);

    // 2. Log Validation Input
    logger.info("Validating body:", req.body);

    const { error, value } = schema.validate(req.body);

    if (error) {
      logger.error("Joi Validation Error:", error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description, starting_price, end_time, bid_increment } =
      value;
    logger.info("Validation Successful. Parsed Fields:", {
      title,
      starting_price,
      end_time,
    });

    // 3. Image Upload Section
    let image_url = null;

    if (req.file) {
      logger.info(
        `File detected: ${req.file.originalname} (${req.file.mimetype})`
      );

      const fileExt = req.file.originalname.split(".").pop();
      // Ensure ID is a string to prevent "object to primitive" crash
      const safeUserId = String(req.user.id);
      const fileName = `${safeUserId}_${Date.now()}.${fileExt}`;

      logger.info(`Generated filename: ${fileName}`);
      logger.info("Uploading to Supabase bucket 'auctionProductsIMG'...");

      const { error: uploadError } = await supabase.storage
        .from("auctionProductsIMG")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        logger.error("Supabase Storage Upload Failed:", uploadError);
        throw uploadError; // Go to catch block
      }

      const { data: urlData } = supabase.storage
        .from("auctionProductsIMG")
        .getPublicUrl(fileName);

      image_url = urlData.publicUrl;
      logger.info(`Image Upload Successful. Public URL: ${image_url}`);
    } else {
      logger.info("No file uploaded. Skipping image storage.");
    }

    // 4. DB Insert Section
    // Construct the payload first so we can log EXACTLY what we are sending
    const insertPayload = {
      title: title,
      description: description,
      starting_price: parseFloat(starting_price),
      current_price: parseFloat(starting_price),
      end_time: end_time, // Consider .toISOString() if dates act weird
      bid_increment: parseFloat(bid_increment),
      image_url: image_url,
      seller_id: req.user.id,
    };

    logger.info(
      "Attempting DB Insert into table 'Product' with payload:",
      insertPayload
    );

    const { data: auctionData, error: dbError } = await supabase
      .from("Product") // <--- CHECK THIS: Is your table named "Product" or "auctions"?
      .insert([insertPayload])
      .select();

    if (dbError) {
      // Log the FULL Supabase error object (it contains codes and hints)
      logger.error(
        "Supabase DB Insert Error Object:",
        JSON.stringify(dbError, null, 2)
      );
      throw dbError;
    }

    logger.info("Auction successfully created in DB. ID:", auctionData[0]?.id);

    // 5. Success Response
    res.status(201).json(auctionData[0]);
    logger.info("--- [END] Request Completed Successfully ---");
  } catch (err) {
    // Log the stack trace to find where exactly it crashed
    logger.error("CRITICAL CONTROLLER CRASH:", err);

    // If it's a specific Supabase error, it might not have a .message
    const errorMsg = err.message || err.details || "Unknown Server Error";
    res.status(500).json({ message: "Server Error", error: errorMsg });
  }
};

module.exports = { createAuction };
