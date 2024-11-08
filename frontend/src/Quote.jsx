import React from 'react';
import { Separator } from "@/components/ui/separator";

const Quote = ({ quote }) => {
    return (
        <div className='hoverLarge hover:!scale-95 scale-90 shadow-md w-full flex flex-col gap-0 bg-black/10 p-3 rounded-lg font-mono'>
            <div className='w-full flex gap-2'>
                <h3 className='text-md md:text-base'>{quote.name}</h3>
                |
                {/* <h4 className='hidden md:flex text-sm md:text-base'>{new Date(quote.time).toLocaleString()}</h4> */}
                <h4 className='text-sm md:text-base'>{new Date(quote.time).getMonth()}/{new Date(quote.time).getDate()}</h4>
            </div>
            <h2 className='text-lg md:text-2xl overflow-x-auto'>{quote.message}</h2>
        </div>
    )
}

export default Quote;