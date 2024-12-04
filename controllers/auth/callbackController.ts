import { Request, Response } from "express";

const callbackController = async (req: Request, res: Response) => {
  const { code, code_verifier } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No authorization code provided" });
  }
  try {
    // Create the form data with URLSearchParams
    const formData = new URLSearchParams();
    formData.append("code", code as string);
    formData.append("client_id", process.env.GOOGLE_CLIENT_ID || "");
    formData.append("client_secret", process.env.GOOGLE_CLIENT_SECRET || "");
    formData.append("redirect_uri", process.env.GOOGLE_REDIRECT_URI || "");
    formData.append("grant_type", "authorization_code");
    formData.append("code_verifier", code_verifier); // Include code_verifier here

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(), // Convert formData to a URL-encoded string
    });

    if (!response.ok) {
      console.error("Error details:", response);
    }

    const data = await response.json();

    if (response.ok) {
      // Successfully obtained the access token
      const accessToken = data.access_token;


      res.status(200).json({ access_token: accessToken });
    } else {
      res.status(400).json({ error: data.error_description || "Unknown error" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default callbackController;
