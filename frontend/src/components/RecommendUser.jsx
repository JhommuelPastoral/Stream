import React from 'react'
import {LANGUAGE_TO_FLAG} from '../constant/index.js'
import { MapPin } from 'lucide-react';

export default function RecommendUser({location,id,outgoingFriendRequestId,fullname, profilePic, nativeLanguage, learningLanguage,bio,handleRequest}) {
  return (
    <>
      <div className="avatar flex items-center gap-3">
        <div className="w-12 rounded-full">
          <img src={profilePic} alt={fullname} />
        </div>
        <p className="font-semibold flex-col flex text-primary">{fullname} <span className='text-sm text-secondary flex items-center'>  <MapPin size={16}/>  {location} </span> </p>
      </div>
      <p className='text-sm'>{bio} </p>
      <div className='flex gap-2 w-full text-sm content'>
        <div className='bg-secondary rounded-full p-1'>
          <p className='text-sm text-primary-content'>{getLanguageFlag(nativeLanguage)} Native: {nativeLanguage} </p>
        </div>
        <div className='bg-secondary rounded-full p-1'>
          <p className='text-sm text-primary-content'>{getLanguageFlag(learningLanguage)} Learning: {learningLanguage}</p>
        </div>
      </div>
      <button
        onClick={handleRequest}
        disabled={outgoingFriendRequestId?.has(id)}
        className={`btn btn-primary rounded-full ${outgoingFriendRequestId?.has(id) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {outgoingFriendRequestId?.has(id) ? 'Request Sent' : 'Send Friend Request'}
      </button>

    </>
  )
}
function getLanguageFlag(language){

  if(!language) return null;
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if(countryCode){
    return(
      <img src={`https://flagcdn.com/w20/${countryCode}.png`} className='h-3 mr-1 inline-block' />
    )
  }

}