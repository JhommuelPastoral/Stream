import user from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
export const getRecommendedUsers = async (req, res) => {

  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await user.find({ 
      $and: [ // In the array all of the condition must be true
        {_id: {$ne: currentUserId}}, // ne = not equal 
        {_id: {$nin: currentUser.friends}}, // nin = not in 
        {isOnboarded: true}
      ]
    
    })
    res.status(200).json({recommendedUsers})

  } catch (error) {
    console.log("GetRecommendUser Error:", error.message);
    return res.status(400).json({sucess: false, message: error.message})
  }
}

export const getMyFriends = async (req, res) => {

  try {
    const currentUser  = await user.findById(req.user._id).select('friends')
    .populate('friends', "fullname profilePic nativeLanguage learningLanguage");
    res.status(200).json({sucess: true, friends: currentUser.friends})
  } catch (error) {
    console.log("GetMyFriends Error:", error.message);  
    return res.status(400).json({sucess: false, message: error.message})
  }
}

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const {id: recipientId} = req.params;
    
    //Prevent sending to yourself
    if(myId === recipientId) {
      return res.status(400).json({sucess: false, message: "You cannot send friend request to yourself"});
    }

    const recipient = await user.findById(recipientId);
    if(!recipient) {
      return res.status(400).json({sucess: false, message: "Recipient not found"});
    }

    if(recipient.friends.includes(myId)) {
      return res.status(400).json({sucess: false, message: "You are already friends"});
    }

    // Check is already sending a request 

    const existingRequest = await FriendRequest.findOne({
      $or:[
        {sender: myId, recipient: recipientId},
        {sender: recipientId, recipient: myId}
      ]
    })

    if(existingRequest) {
      return res.status(400).json({sucess: false, message: "You have already sent a friend request"});
    }

    const friendRequest = await FriendRequest.create({sender: myId, recipient: recipientId});
    res.status(200).json({sucess: true, friendRequest})


  } catch (error) {
    console.log("SendFriendRequest Error:", error.message);
    return res.status(400).json({sucess: false, message: error.message});
  }
}
export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: senderId } = req.params;

    const friendRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: req.user._id,
      status: "pending"
    });

    if (!friendRequest) {
      return res.status(400).json({ success: false, message: "Friend request not found" });
    }

    // Update status
    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each other to friends list
    await user.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient }
    });

    await user.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender }
    });

    res.status(200).json({ success: true, friendRequest });

  } catch (error) {
    console.log("AcceptFriendRequest Error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};


export const getFriendRequest = async (req, res) => {
  try {
    const incomingRequests = await FriendRequest.find({recipient: req.user._id, status: "pending"}).populate('sender', "fullname profilePic nativeLanguage learningLanguage");
    const acceptedRequests = await FriendRequest.find({sender: req.user._id, status: "accepted"}).populate('recipient', "fullname profilePic nativeLanguage learningLanguage");
    res.status(200).json({sucess: true, incomingRequests, acceptedRequests})
  } catch (error) {
    console.log("GetFriendRequest Error:", error.message);
    return res.status(400).json({sucess: false, message: error.message});
  }
}

export const getOutgoingFriendRequest = async (req, res) => {
  try {
    const outgoingRequest = await FriendRequest.find({sender: req.user._id, status: "pending"}).populate('recipient', "fullname profilePic nativeLanguage learningLanguage");
    res.status(200).json({sucess: true, outgoingRequest})


  } catch (error) { 
    console.log("GetOutgoingFriendRequest Error:", error.message);
    return res.status(400).json({sucess: false, message: error.message});
  }
}

