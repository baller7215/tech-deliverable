import React from 'react';
import logo from './public/quotebook.png';

const Header = () => {
    return (
        <div className='w-full flex flex-row gap-5 justify-between place-items-center border-b-[1px] py-5 mb-5'>
            <img src={logo} alt='quotebook logo' width={75} height={75} />
            <h1 className='text-3xl font-mono font-extralight'>Hack at UCI Tech Deliverable</h1>
        </div>
    )
}

export default Header;