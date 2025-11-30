import React from 'react'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="bg-">
    <div className='fixed inset-0 m-4 min-h-screen rounded-lg overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [scrollbar-width:0] [-ms-overflow-style:none] bg-background'>
      <Outlet/>
    </div>
    </div>
  )
}

export default Layout
