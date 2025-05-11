import React from 'react'
import { getFriendRequest,acceptFriendRequest } from '../lib/api.js'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { UserRoundPlus, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import NoFriendsFound from '../components/NoFriendsFound.jsx';

export default function NotificationPage() {
  const {data: friendReqsData = []} = useQuery({
    queryKey: ['friendReqs'], 
    queryFn: getFriendRequest
  }); 
  
  const queryClient =  useQueryClient();
  const {mutate: acceptRequestMutation} = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: ()=>{
      toast.success("Request accepted successfully");
      queryClient.invalidateQueries({queryKey:["friendReqs"]});
      queryClient.invalidateQueries({queryKey:["friends"]});

    }

  })


  const handleAcceptRequest = (id) => {
    acceptRequestMutation(id);
  }  

  return (
    <div className='max-w-[800px] mx-auto font-Poppins py-[10px] flex flex-col gap-[10px] '>
      <p className='font-bold text-primary text-2xl '>Notification</p>

      {/* Friends Request */}
      <div className='flex flex-col gap-[20px] max-h-[500px]'>
        <p className='flex items-center gap-[10px]'> <UserRoundPlus/> Friend Request</p>
        {friendReqsData?.incomingRequests?.length ===0 ? (
          <div className="flex justify-center w-full text-gray-500">
            <p>No friends found.</p>
          </div>
        ) : ( 
          friendReqsData?.incomingRequests?.map((req,index) => (
            <div key={index} className='w-full bg-base-200 p-[20px] flex justify-between'>
              <div className='flex'>
                <img src={req?.sender.profilePic} alt={req?.sender?.fullname} className='w-[50px] h-[50px] rounded-full '/>
                <div className='flex flex-col ml-[10px]'>
                  <p className='font-semibold'>{req?.sender.fullname}</p>
                  <div className='flex gap-[10px]'>
                    <p className='text-sm bg-primary p-1 rounded-full'> {req?.sender.nativeLanguage} </p>
                    <p className='text-sm bg-secondary p-1 rounded-full'> {req?.sender.learningLanguage} </p>
                  </div>
                </div>
              </div>
              <button onClick={()=>handleAcceptRequest(req?.sender?._id)} className="btn btn-ghost bg-primary">Accept</button>
            </div>
            
          ))
        )}


      </div>

      {/* Notification */}  
      <div className='flex flex-col gap-[20px] max-h-[500px]'>
        <p className='flex items-center gap-[10px]'> <Bell/> New Connections</p>
        {friendReqsData?.acceptedRequests?.length ===0 ? (
          <div className="flex justify-center w-full text-gray-500">
            <p>No New Connections</p>
          </div>
        ) : 
        (        
          friendReqsData?.acceptedRequests?.map((req,index) => (
          <div key={index} className='w-full bg-base-200 p-[20px] flex justify-between'>
            <div className='flex'>
              <img src={req?.recipient.profilePic} alt={req?.recipient?.fullname} className='w-[50px] h-[50px] rounded-full '/>
              <div className='flex flex-col ml-[10px]'>
                <p className='font-semibold'>{req?.recipient.fullname}</p>
                <p className='text-sm'>{req?.recipient.fullname} accepted your friend request </p>
              </div>
            </div>
            <div className="badge badge-soft badge-success">New Friend</div>

          </div>
        )))
        }

      </div>


    </div>
  )
}
