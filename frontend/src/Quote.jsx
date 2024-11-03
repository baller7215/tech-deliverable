import React from 'react';
import { Separator } from "@/components/ui/separator";

const Quote = ({ quote }) => {
    return (
        <div className='w-full flex flex-col gap-0'>
            <div className='w-full flex gap-2'>
                <h3>{quote.name}</h3>
                <Separator orientation="vertical" />
                <h4>{quote.time}</h4>
            </div>
            <h2>{quote.message}</h2>
        </div>
    )
}

export default Quote;