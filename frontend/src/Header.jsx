import React from 'react';
import logo from './public/quotebook.png';

const Header = () => {
    return (
        <div className='w-full flex flex-row gap-5 justify-between place-items-center border-b-[1px] py-5 mb-5 max-h-[10vh]'>
            <img src={logo} alt='quotebook logo' width={75} height={75} className='hidden md:flex' />
            <img src={logo} alt='quotebook logo' width={50} height={50} className='flex md:hidden' />
            <h1 className='text-lg md:text-3xl font-mono font-extralight lowercase'>Hack at UCI Tech Deliverable</h1>
        </div>
    )
}

export default Header;