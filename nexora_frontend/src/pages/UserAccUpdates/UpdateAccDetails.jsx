import React from 'react'
import UpdateAccountDetails from '../../Components/Settings/UpdateAccountDetails'
import { useNavigate } from 'react-router-dom';

function updateAccDetails() {
    const navigate = useNavigate();
  return (
    <div className='min-h-screen flex flex-col items-center pt-20'>
 <UpdateAccountDetails />
 <button
          className="text-white px-5 py-1.5 bg-[#0175FE]  rounded-2xl w-30 cursor-pointer"
          onClick={() => navigate("/Home")}
        >
          Back
        </button>
    </div>

     
    
  )
}

export default updateAccDetails
