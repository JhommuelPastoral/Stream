
import axiosInstance from "./axios.js";
export const signup = async (signupData) => {
  try {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data; 
  } catch (error) {
    console.error(error.messsage); 
  }
};

export const getauthUser = async ()=>{
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    return null;
  }
}

export const completeOnboarding = async (onboardData) => {
  try {
    const response = await axiosInstance.post("/auth/onboard", onboardData);
    return response.data;
  } catch (error) {
    throw  Error(error.response?.data?.message );
  }
}

export const signin = async (signinData) => {
  try {
    const response = await axiosInstance.post("/auth/login", signinData);
    return response.data;
  } catch (error) {
    throw  Error(error.response?.data );
  }
}

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw  Error(error.response?.data?.message );
  }
}

export const getUserFriends = async ()=>{
  try {
    const response = await axiosInstance.get("/user/friends");
    return response.data;
  } catch (error) {
    console.error(error.message);
  }

}
export const getRecommendUsers = async ()=>{
 
  try {
    const response = await axiosInstance.get("/user");
    return response.data;
  } catch (error) {
    console.error(error.message);
  }

}

export const outgoingFriendReq = async () => {
  try {
    const response = await axiosInstance.get("/user/outgoing-friends-request");
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

export const sendFriendRequest = async (userId) => {
  try {
    const response = await axiosInstance.post(`/user/friend-request/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

export const getFriendRequest = async () => {
  try {
    const response = await axiosInstance.get("/user/friends-request");
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

export const acceptFriendRequest = async (userId) => {
  try {
    const response = await axiosInstance.put(`/user/friend-request/${userId}/accept`);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

export const getStreamToken = async () => {
  try {
    const response = await axiosInstance.get("/chat/token");
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}