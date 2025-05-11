import { Bell, LogOut } from 'lucide-react';
import { useLocation } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthUser from '../hooks/useAuthUser';
import { logout } from '../lib/api.js';
import ThemeSelector from './ThemeSelector.jsx';
import { useThemeStore } from '../store/useThemeStore.js';
import {Link} from 'react-router';
export default function Navbar() {
  const {authData} = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith('/chat');

  const queryClient = useQueryClient();
  const {mutate:logoutMutation} = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["authUser"]});
    }
  });
  const {theme} = useThemeStore();

  const handleLogout = () => {
    logoutMutation();
  }

  return (
    <div  className={` bg-base-200 flex items-center h-14 px-2.5 lg:px-6 z-10 ${isChatPage ? 'justify-between' : 'justify-end'}`}  >
      {isChatPage &&
        <div className="tooltip tooltip-bottom" data-tip="Back">
          <Link to='/'>
            <p className="font-bold text-2xl bg-gradient-to-r from-[#2A7B9B] via-[#57C785] to-[#EDDD53] bg-clip-text text-transparent">Streamnify</p>
          </Link>
       </div>
       }

      <div className='flex items-center gap-5'>

        <div className="tooltip tooltip-bottom" data-tip="Notifications">
          <Bell size={20} className='cursor-pointer'/>
        </div>

        <div className="tooltip tooltip-bottom" data-tip="Themes">
          <ThemeSelector/>
        </div>

        <img src={authData?.profilePic} alt="profile" className='w-8 h-8 rounded-full' />
        <div className="tooltip tooltip-bottom" data-tip="Log Out">
          <LogOut size={20} className='cursor-pointer' onClick={handleLogout}/>
        </div >
      </div>
    </div>
  )
}
