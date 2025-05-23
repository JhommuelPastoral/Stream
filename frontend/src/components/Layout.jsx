import React from 'react'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
export default function Layout({children,showSidebar=true}) {
  return (
    <div className='min-h-screen '>
      <div className='flex'>
        {showSidebar && <Sidebar/>}

        <div className='flex-1 flex flex-col'>
          <Navbar/>
          <main className='flex-1 overflow-y-auto'>
            {children}
          </main>
          
        </div>
      </div>
    </div>
  )
}
