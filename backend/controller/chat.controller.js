import { generateStreamToken } from "../config/stream.js";
export const getStreamToken = async (req, res) => {
  try {
    const token = await generateStreamToken(req.user._id);
    res.status(200).json({sucess: true, token});
  } catch (error) {
    console.log("GetStreamToken Error:", error.message);
    return res.status(400).json({sucess: false, message: error.message})
  }
}