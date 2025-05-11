import React from 'react'
import useAuthUser from '../hooks/useAuthUser.js'
import {useLocation} from 'react-router'
import { Link } from 'react-router';
import { House, Users, Bell } from 'lucide-react';

export default function Sidebar() {
  const {authData} = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const isChatPage = location.pathname?.startsWith('/chat');
  return (
      <aside className={`w-64 min-h-screen bg-base-200 ${isChatPage ? 'hidden' : 'hidden lg:flex'} flex-col sticky top-0`}>
        <div className='p-5  items-center flex justify-center' >
          <Link to='/'>
            <p className="font-bold text-2xl bg-gradient-to-r from-[#2A7B9B] via-[#57C785] to-[#EDDD53] bg-clip-text text-transparent">Streamnify</p>
          </Link>
        </div>
        <nav className='p-5  flex flex-1 justify-start flex-col gap-[20px]'>
          <Link 
            to='/'
            className={`btn btn-soft justify-start  w-full gap-3 normal-case  rounded-xl  ${currentPath === '/' ? 'btn-active btn-primary ' : ''}`}
          >
            <span className='flex items-center gap-3'> <House/>Home</span>
          </Link>
          <Link 
            to='/friends'
            className={`btn btn-soft justify-start  w-full gap-3 normal-case  rounded-xl  ${currentPath === '/friends' ? 'btn-active btn-primary ' : ''}`}
          >
            <span className='flex items-center gap-3'> <Users/>Friends</span>
          </Link>
          <Link 
            to='/notification'
            className={`btn btn-soft justify-start  w-full gap-3 normal-case  rounded-xl  ${currentPath === '/notification' ? 'btn-active btn-primary ' : ''}`}
          >
            <span className='flex items-center gap-3'> <Bell/>Notifications</span>
          </Link>

        </nav>
        <footer className='p-5 flex z-10 items-center gap-3'>
          <img src={authData?.profilePic} className='w-10 h-10 rounded-full '/>
          <div className='flex flex-col items-start justify-start'>
            <p className='font-Poppins font-semibold text-sm'>{authData?.fullname}</p>
            <p className='font-Poppins text-green-500 text-sm flex items-center gap-1' > <span className='w-2 h-2 bg-green-500 rounded-full'></span>  Online</p>
          </div>
        </footer>

      </aside>


  )
}
