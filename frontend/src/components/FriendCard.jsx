import React from 'react'
import {LANGUAGE_TO_FLAG} from '../constant/index.js'
import {Link } from 'react-router';
export default function FriendCard({fullname, profilePic, nativeLanguage, learningLanguage, id}) {
  return (
    <>
      <div className="avatar flex items-center gap-3">
        <div className="w-12 rounded-full">
          <img src={profilePic} alt={fullname} />
        </div>
        <p className="font-semibold">{fullname}</p>
      </div>

      <div className='flex gap-2 w-full text-sm'>
        <div className='w-1/2'>
          <p>{getLanguageFlag(nativeLanguage)} Native: {nativeLanguage} </p>
        </div>
        <div className='w-1/2'>
          <p>{getLanguageFlag(learningLanguage)} Learning: {learningLanguage}</p>
        </div>
      </div>

      <Link className='btn btn-primary rounded-full' to={`/chat/${id}`} >
        Message
      </Link>

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