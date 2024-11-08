import React from 'react';
import { Separator } from "@/components/ui/separator";

const Quote = ({ quote }) => {
    return (
        <div className='hoverLarge hover:!scale-95 scale-90 shadow-md w-full flex flex-col gap-0 bg-black/10 p-3 rounded-lg font-mono'>
            <div className='w-full flex gap-2'>
                <h3 className='text-base'>{quote.name}</h3>
                |
                <h4 className='text-base'>{new Date(quote.time).toLocaleString()}</h4>
            </div>
            <h2 className='text-2xl'>{quote.message}</h2>
        </div>
    )
}

export default Quote;