const supabase = require("../config/supabase");
const logger = require("../../logger");

// --- DEPOSIT MONEY (Mock Function for Dev) ---
const depositFunds = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    // 1. Get Current Balance
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("wallet_balance")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    const newBalance = parseFloat(user.wallet_balance) + parseFloat(amount);

    // 2. Update User Balance
    const { error: updateError } = await supabase
      .from("users")
      .update({ wallet_balance: newBalance })
      .eq("id", userId);

    if (updateError) throw updateError;

    // 3. Create Transaction Record
    const { error: txnError } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        amount: amount,
        type: "DEPOSIT",
        description: "Added funds to wallet",
      },
    ]);

    if (txnError) {
      // Log it, but don't fail the request since the money is already added
      logger.error("Failed to log transaction:", txnError);
    }

    logger.info(
      `User ${userId} deposited $${amount}. New Balance: $${newBalance}`
    );

    res.status(200).json({
      message: "Funds added successfully",
      new_balance: newBalance,
    });
  } catch (err) {
    logger.error("Deposit Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// --- GET TRANSACTION HISTORY ---
const getTransactions = async (req, res) => {
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { depositFunds, getTransactions };
