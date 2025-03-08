import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { useTranslation } from 'react-i18next';
import Footer from './shared/Footer.tsx'

import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';


const LandingPage: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const cld = new Cloudinary({ cloud: { cloudName: 'dgptexs0w' } });
    const collageImage = cld
        .image('KluubLanding_elrymc')
        .format('auto')
        .quality('auto')
        .resize(auto());

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);


    const handleCitySelect = (cityName) => {
        navigate(`/events`);
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-black">
            {/* Background Collage */}
            <div className="flex-grow relative">
                <div className="absolute inset-0 overflow-hidden">
                    <AdvancedImage
                        cldImg={collageImage}
                        alt="Collage"
                        className="h-full object-cover max-w-none transform scale-[0.82] translate-x-[19%] translate-y-[-7%] origin-right"
                    />
                </div>

                {/* Main Content */}
                <div
                    className="absolute inset-0 z-20 flex flex-col justify-center items-center
                   md:px-8 md:-translate-y-20 md:items-start"
                >
                    {/* Main Text */}
                    <div
                        className="text-white text-xl md:text-3xl mb-10 -mt-40 max-w-md text-center font-montserrat-bolder font-bold
                     md:-mt-0 md:mb-12 md:ml-48"
                    >
                        {t('header.title')}
                        <br/>
                        <br/>
                        <p className="md:block font-montserrat-bolder">
                            {t('header.subtitle')}
                        </p>
                    </div>

                    {/* City Buttons Container */}
                    <div className="flex flex-col items-center md:items-start">
                        {/* Top City Button (Tallinn) */}
                        <div className="relative mb-8 md:ml-72">
                            <div className="relative">
                                {/* Back Rectangle */}
                                <div
                                    className="absolute z-0 bg-black border-2 border-[#696969] w-40 h-12 md:w-64 md:h-20
                           translate-x-2.5 translate-y-2.5"
                                />
                                {/* Front Rectangle */}
                                <button
                                    aria-label="Select Tallinn"
                                    className="relative z-10 w-40 h-12 md:w-64 md:h-20 text-lg md:text-3.5xl text-[#929292]
                           font-dela-gothic-one font-black bg-[#494725] border-2 border-[#696969]
                           uppercase flex items-end justify-center pb-2.5 md:pb-6 custom-text-shadow tracking-widest"
                                    disabled
                                >
                                    Tallinn
                                </button>
                            </div>
                        </div>

                        {/* Bottom Row with Two City Buttons */}
                        <div className="flex flex-row items-start space-x-8 md:space-x-12 md:ml-36">
                            {/* Tartu Button */}
                            <div className="relative group hover:cursor-pointer pl-10 md:pl-0">
                                <div className="relative">
                                    {/* Back Rectangle */}
                                    <div
                                        className="absolute z-0 bg-black border-2 border-white w-36 h-12 md:w-60 md:h-20
                             translate-x-2.5 translate-y-2.5 transition-transform duration-200
                             group-hover:-translate-x-3 group-hover:-translate-y-3 group-hover:bg-[#E4DD3B]"
                                    />
                                    {/* Front Rectangle */}
                                    <button onClick={() => handleCitySelect("Tartu")}
                                        aria-label="Select Tartu"
                                        className="relative z-10 w-36 h-12 md:w-60 md:h-20 text-lg md:text-3.5xl text-white
                             font-dela-gothic-one font-black bg-[#E4DD3B] border-2 border-white
                             uppercase flex items-end justify-center pb-2.5 md:pb-6 hover:bg-black
                             transition-colors duration-200 custom-text-shadow tracking-widest"
                                    >
                                        Tartu
                                    </button>
                                </div>
                            </div>

                            {/* Pärnu Button */}
                            <div className="relative pr-10 md:pr-0">
                                <div className="relative">
                                    {/* Back Rectangle */}
                                    <div
                                        className="absolute z-0 bg-black border-2 border-[#696969] w-36 h-12 md:w-60 md:h-20
                             translate-x-2.5 translate-y-2.5"
                                    />
                                    {/* Front Rectangle */}
                                    <button
                                        aria-label="Select Pärnu"
                                        className="relative z-10 w-36 h-12 md:w-60 md:h-20 text-lg md:text-3.5xl text-[#929292]
                             font-dela-gothic-one font-black bg-[#494725] border-2 border-[#696969]
                             uppercase flex items-end justify-center pb-2.5 md:pb-6 custom-text-shadow tracking-widest"
                                        disabled
                                    >
                                        Pärnu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 w-full z-500">
                <Footer/>
            </div>
        </div>
    );
};

export default LandingPage;
