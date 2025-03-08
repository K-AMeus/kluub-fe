import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';

const Footer: FC = () => {
    return (
        <footer className="w-full bg-black border-t-[10px] border-[#E4DD3B] text-white font-montserrat-medium text-[1.1rem]">
            <div className="w-full px-8 pt-5 pb-5 flex justify-between items-center">
                {/* Left Section: Email, Contact, and Sign In */}
                <div className="flex items-center space-x-6">
                    <a href="mailto:info@kluub.ee" className="hover:underline">
                        info@kluub.ee
                    </a>
                    <Link
                        to="/contact"
                        className="hover:underline hidden md:block"
                        onClick={() => window.scrollTo(0, 0)}
                    >
                        Contact
                    </Link>
                    <Link
                        to="/auth?mode=login"
                        className="hover:underline hidden md:block"
                        onClick={() => window.scrollTo(0, 0)}
                    >
                        Sign in
                    </Link>
                </div>

                {/* Right Section: Social Media Icons, Privacy Policy, and Year */}
                <div className="flex items-center">
                    <div className="flex space-x-4 items-center pr-3">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="h-10 w-10 md:h-12 md:w-12 hover:text-[#E4DD3B]"/>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF className="h-10 w-10 md:h-12 md:w-12 hover:text-[#E4DD3B]"/>
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                            <FaTiktok className="h-10 w-10 md:h-12 md:w-12 hover:text-[#E4DD3B]"/>
                        </a>
                    </div>

                    <div className="flex flex-col items-end ml-6 justify-center hidden md:block">
                        <div>@Kluub 2025</div>
                        <Link to="/privacy" className="hover:underline" onClick={() => window.scrollTo(0, 0)}>
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
