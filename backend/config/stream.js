import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();
const apikey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apikey || !apiSecret){  
  console.error("Please provide STREAM_API_KEY and STREAM_API_SECRET in .env file");
}

const streamClient = StreamChat.getInstance(apikey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    return userData;
  } catch (error) {
    console.log("UpsertStream"+ error.message);
  }
}
export const generateStreamToken = async (userId) => {
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.log("GenerateStreamToken"+ error.message);
  }
}
