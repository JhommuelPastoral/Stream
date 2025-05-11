import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getRecommendedUsers, getMyFriends, sendFriendRequest,acceptFriendRequest, getFriendRequest,getOutgoingFriendRequest} from "../controller/user.controller.js";
const router = express.Router();

router.use(protectRoute);
router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);
router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.get('/friends-request', getFriendRequest);
router.get('/outgoing-friends-request', getOutgoingFriendRequest);

export default router;