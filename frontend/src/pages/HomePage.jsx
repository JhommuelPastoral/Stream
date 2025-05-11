import { useThemeStore } from '../store/useThemeStore.js';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getUserFriends, getRecommendUsers, outgoingFriendReq, sendFriendRequest } from '../lib/api.js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router'; 
import { Users } from 'lucide-react';
import { toast } from 'react-hot-toast'; 
import NoFriendsFound from '../components/NoFriendsFound.jsx';
import FriendCard from '../components/FriendCard.jsx';
import RecommendUser from '../components/RecommendUser.jsx';
export default function HomePage() {
  const queryClient = useQueryClient();
  const [outgoingFriendRequestIds, setOutgoingFriendRequestIds] = useState(new Set());

  const { data: friendsData = {}, isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
    staleTime: 0
  });
  const {theme} = useThemeStore();

  const { data: recommendUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getRecommendUsers,
  });

  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ['outgoingFriendReqs'],
    queryFn: outgoingFriendReq,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outgoingFriendReqs'] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  useEffect(() => {
    const ids = new Set();
    if (outgoingFriendReqs?.outgoingRequest?.length > 0) {
      outgoingFriendReqs?.outgoingRequest.forEach((req) => {
        ids.add(String(req.recipient._id));
      });
    }
    else {
      setOutgoingFriendRequestIds(new Set()); 
    }
    setOutgoingFriendRequestIds(ids);
  }, [outgoingFriendReqs]);

const handleRequest = (id) => {
  const stringId = String(id); 
  if (!outgoingFriendRequestIds.has(stringId)) {
    const newSet = new Set(outgoingFriendRequestIds);
    newSet.add(stringId);
    setOutgoingFriendRequestIds(newSet);
    sendRequestMutation(stringId);
  }
};


  return (
    <div data-theme={theme} className="font-Poppins p-[20px] px-[20px] w-full">
      <div className="flex justify-between items-center">
        <p className="font-bold text-2xl">Your Friends</p>
        <Link to="/notification">
          <button className="btn rounded-full btn-soft btn-sm flex gap-2 items-center">
            <Users size={20} /> Friend Requests
          </button>
        </Link>
      </div>

      <div  className="w-full flex py-6 flex-wrap gap-5 ">
        {loadingFriends ? (
          <div className="flex justify-center w-full">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : friendsData.friends?.length === 0 ? (
          <div className="flex justify-center w-full text-gray-500">
            <NoFriendsFound/>
          </div>
        ) : (
          friendsData?.friends?.map((friend) => (
            <div key={friend._id} className="flex flex-col gap-5 w-90 bg-black/10 rounded-lg p-5">
              <FriendCard id={friend?._id} profilePic={friend.profilePic} fullname={friend.fullname} nativeLanguage={friend.nativeLanguage} learningLanguage={friend.learningLanguage} />
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col ">
        <p className="font-bold text-2xl ">Meet New Learners</p>
        <p className='text-gray-500'>Discover perfect language exchange partners based on your profile</p>
        <div className='grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] mt-[20px] gap-[10px]'>
          {recommendUsers?.recommendedUsers?.map((reco) => {
            return(
              <div key={reco._id} className="flex flex-col gap-5 w-90 bg-black/10 rounded-lg p-5">
                  <RecommendUser location = {reco?.location} id={String(reco?._id)} outgoingFriendRequestId={outgoingFriendRequestIds} handleRequest={() => handleRequest(reco._id)} profilePic={reco.profilePic} bio={reco.bio} fullname={ reco.fullname} nativeLanguage={reco.nativeLanguage} learningLanguage={reco.learningLanguage} />
              </div>
            )
          })}
        </div>

      </div>
    </div>
  );
}
