const { auth, createUserDocument } = require("../services/firebaseService");

const register = async (req, res, next) => {
  const { email, password, displayName } = req.body;

  if (!email || !password || !displayName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    // Create a user document in Firestore
    await createUserDocument(userRecord.uid, {
      email,
      displayName,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.code === "auth/email-already-exists") {
      return res.status(409).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Failed to register user" });
  }
};

const login = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized: Missing ID token" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const user = await auth.getUser(decodedToken.uid);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(401).json({ error: "Unauthorized: Invalid ID token" });
  }
};

module.exports = {
  register,
  login,
};
