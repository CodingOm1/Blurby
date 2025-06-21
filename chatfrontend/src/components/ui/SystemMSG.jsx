import React from 'react'

export default function SystemMSG({msg}) {
    return (
        <div className='flex justify-center mb-6'>
            <div className='px-3 py-1 bg-gray-100 rounded-full shadow-inner'>
                <span className='text-xs font-medium text-gray-500'>{msg}</span>
            </div>
        </div>
    )
}
