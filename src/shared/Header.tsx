import React, { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';
import { useAuth } from '../authentication/AuthContext';
import { User } from 'firebase/auth';
import LanguageSwitcher from '../locales/LanguageSwitcher';


interface NavigationLinksProps {
    user: User | null;
    isAdmin: boolean;
    onLinkClick?: () => void;
}

interface UserProfileProps {
    user: User;
    handleProfile: () => void;
    handleLogout: () => void;
}


const NavigationLinks: FC<NavigationLinksProps> = ({ user, isAdmin, onLinkClick }) => {
    const links = [
        { name: 'EVENTS', href: '/events' },
        { name: 'CONTACT', href: '/contact' },
    ];

    // If not logged in, show Sign In
    if (!user) {
        links.push({ name: 'SIGN IN', href: '/auth?mode=login' });
    }

    return (
        <div className="flex items-center space-x-4">
            {links.map((item) => (
                <div key={item.name} className="relative flex-none group hover:cursor-pointer">
                    {/* Back Rectangle */}
                    <div
                        className="absolute w-full h-full bg-[#E4DD3B] z-0
                       translate-x-1.5 translate-y-1.5 transition-transform duration-200
                       group-hover:-translate-x-0 group-hover:-translate-y-0"
                    ></div>
                    {/* Front Rectangle */}
                    <Link
                        to={item.href}
                        className="relative z-10 inline-block w-40 h-10 px-4 py-1 text-xl bg-black text-white border-2 border-white font-montserrat-medium uppercase text-center transition-colors duration-200 pt-1.5 leading-tight tracking-wide hover:bg-black"
                        onClick={() => {
                            window.scrollTo(0, 0);
                            if (onLinkClick) onLinkClick();
                        }}
                    >
                        {item.name}
                    </Link>
                </div>
            ))}
            {isAdmin && (
                <div key="admin-panel" className="relative flex-none">
                    {/* Back Rectangle */}
                    <div className="absolute w-full h-full translate-x-1 translate-y-1 bg-[#E4DD3B] z-0"></div>
                    {/* Front Rectangle */}
                    <Link
                        to="/admin"
                        className="relative z-10 inline-block w-40 px-4 py-1 bg-black text-white border-2 border-white font-montserrat-medium uppercase text-center hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => {
                            if (onLinkClick) onLinkClick();
                        }}
                    >
                        Admin Panel
                    </Link>
                </div>
            )}
        </div>
    );
};


const NavigationLinksVertical: FC<NavigationLinksProps> = ({
                                                               user,
                                                               isAdmin,
                                                               onLinkClick,
                                                           }) => {
    const links = [
        { name: 'EVENTS', href: '/events' },
        { name: 'CONTACT', href: '/contact' },
    ];

    if (!user) {
        links.push({ name: 'SIGN IN', href: '/auth?mode=login' });
    }

    return (
        <div className="flex flex-col content-center items-center space-y-6 mt-6 w-full">
            {links.map((item) => (
                <div key={item.name} className="relative flex-none group hover:cursor-pointer">
                    {/* Back Rectangle */}
                    <div
                        className="absolute w-full h-full bg-[#E4DD3B] z-0
                       translate-x-1.5 translate-y-1.5 transition-transform duration-200
                       group-hover:-translate-x-0 group-hover:-translate-y-0"
                    ></div>
                    {/* Front Rectangle */}
                    <Link
                        to={item.href}
                        className="relative z-10 inline-block w-40 h-10 px-4 py-1 text-xl
                       bg-black text-white border-2 border-white font-montserrat-medium
                       uppercase text-center transition-colors duration-200 pt-1.5 leading-tight
                       tracking-wide hover:bg-black"
                        onClick={() => {
                            window.scrollTo(0, 0);
                            if (onLinkClick) onLinkClick();
                        }}
                    >
                        {item.name}
                    </Link>
                </div>
            ))}
            {isAdmin && (
                <div key="admin-panel" className="relative flex-none">
                    {/* Back Rectangle */}
                    <div className="absolute w-full h-full translate-x-1 translate-y-1 bg-[#E4DD3B] z-0"></div>
                    {/* Front Rectangle */}
                    <Link
                        to="/admin"
                        className="relative z-10 inline-block w-40 px-4 py-1 bg-black text-white border-2 border-white font-montserrat-medium uppercase text-center hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => {
                            if (onLinkClick) onLinkClick();
                        }}
                    >
                        Admin Panel
                    </Link>
                </div>
            )}
        </div>
    );
};


const UserProfile: FC<UserProfileProps> = ({ user, handleProfile, handleLogout }) => {
    const initial = user.email?.charAt(0).toUpperCase() ?? 'U';

    return (
        <div className="flex items-center space-x-4">
            <button onClick={handleProfile} className="relative flex items-center justify-center p-2">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white bg-black border-2 border-[#E4DD3B]">
                    {initial}
                </div>
            </button>
            <button
                onClick={handleLogout}
                className="relative z-10 inline-block w-40 h-10 px-4 py-1 text-xl bg-black text-white border-2 border-white font-montserrat-medium uppercase hover:bg-black transition-colors duration-200 group"
            >
                Log Out
                <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-200 ease-in-out"
                >
          →
        </span>
            </button>
        </div>
    );
};


const UserProfileVertical: FC<UserProfileProps> = ({ user, handleProfile, handleLogout }) => {
    const initial = user.email?.charAt(0).toUpperCase() ?? 'U';

    return (
        <div className="flex flex-col content-center items-center space-y-2 w-full">
            <button onClick={handleProfile} className="relative flex items-center justify-center p-2">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white bg-black border-2 border-[#E4DD3B]">
                    {initial}
                </div>
            </button>
            <button
                onClick={handleLogout}
                className="relative z-10 inline-block w-40 h-10 px-4 py-1 text-xl bg-black text-white border-2 border-white font-montserrat-medium uppercase hover:bg-black transition-colors duration-200 group"
            >
                Log Out
                <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-200 ease-in-out"
                >
          →
        </span>
            </button>
        </div>
    );
};


const Header: FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleProfile = () => {
        navigate('/profile');
        setMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    return (
        <header className="bg-black bg-opacity-100 fixed top-0 -left-1 -right-1 z-50 font-montserrat-medium border-b-2 border-yellow">
            <nav className="px-8 lg:px-20 flex items-center justify-between h-20 relative z-10">
                {/* Left Section: Logo */}
                <div className="flex items-center">
                    <Link
                        to="/"
                        className="text-white font-dela-gothic-one text-4xl md:text-5xl relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-1 after:bg-[#E4DD3B] after:transition-all after:duration-300 hover:after:w-full"
                        onClick={() => window.scrollTo(0, 0)}
                    >
                        KLUUB.EE
                    </Link>
                </div>

                {/* Right Section: Navigation Links and User Profile (Desktop) */}
                <div className="hidden md:flex items-center space-x-4">
                    <NavigationLinks
                        user={user}
                        isAdmin={isAdmin}
                    />
                    <div className="relative flex-none">
                        <LanguageSwitcher/>
                    </div>

                    {user && (
                        <UserProfile
                            user={user}
                            handleProfile={handleProfile}
                            handleLogout={handleLogout}
                        />
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                <button
                        type="button"
                        className="inline-flex items-center justify-center p-0.5 pt-1.5 rounded-md text-gray-400 hover:text-white"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                    </button>
                </div>
            </nav>

            {/* Mobile Burger Menu */}
            <Dialog
                as="div"
                className="md:hidden"
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
            >
                <div className="fixed inset-0 z-40 min-h-screen">
                    <Dialog.Panel className="fixed inset-y-0 right-0 z-40 w-full bg-black bg-opacity-90 backdrop-blur-md overflow-y-auto">
                        <div className="flex items-center justify-between p-3 pl-8 border-b-2 border-white">
                            <Link
                                to="/"
                                className="text-white font-dela-gothic-one text-4xl md:text-5xl relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-1 after:bg-[#E4DD3B] after:transition-all after:duration-300 hover:after:w-full"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                KLUUB.EE
                            </Link>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center pr-5 pt-3.5 pb-2.5 rounded-md text-gray-400 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Navigation Links (Mobile) */}
                        <div className="mt-6 px-5 space-y-6 flex flex-col items-start">
                            <NavigationLinksVertical
                                user={user}
                                isAdmin={isAdmin}
                                onLinkClick={() => setMobileMenuOpen(false)}
                            />
                        </div>

                        {/* User Profile / Logout (Mobile) */}
                        {user && (
                            <div className="mt-6 pt-4 pb-2">
                                <div className="flex flex-col items-start px-5 space-y-4">
                                    <UserProfileVertical
                                        user={user}
                                        handleProfile={handleProfile}
                                        handleLogout={handleLogout}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Mobile Footer */}
                        <footer className="absolute bottom-0 left-0 w-full z-50">
                            <div className="absolute bottom-24 w-full flex flex-col items-center text-white pb-20">
                                <p className="text-xl pb-7 tracking-widest font-semibold">
                                    KLUUBIKE OÜ
                                </p>
                                <p className="text-lg pb-1">+372 5244 0420</p>
                                <p className="text-lg">info@kluub.ee</p>
                            </div>

                            {/* Social Links */}
                            <div className="absolute bottom-28 w-full flex flex-row justify-center items-center text-white space-x-4">
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#E4DD3B]"
                                >
                                    <FaInstagram className="h-10 w-10" />
                                </a>
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#E4DD3B]"
                                >
                                    <FaFacebookF className="h-10 w-10" />
                                </a>
                                <a
                                    href="https://tiktok.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#E4DD3B]"
                                >
                                    <FaTiktok className="h-10 w-10" />
                                </a>
                            </div>

                            {/* Bottom stripes */}
                            <div className="h-2 bg-[#E4DD3B]" />
                            <div className="h-5 bg-black" />
                            <div className="h-10 bg-[#E4DD3B]" />
                        </footer>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </header>
    );
};

export default Header;