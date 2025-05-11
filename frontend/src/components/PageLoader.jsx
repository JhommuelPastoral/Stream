import React from 'react'
import { Loader } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className='min-h-screen flex justify-center items-center gap-2 '>
      <Loader size={30} className='animate-spin'/>
      Fetching Data
    </div>
  )
}
