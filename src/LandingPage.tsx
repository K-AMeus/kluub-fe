import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { useTranslation } from "react-i18next";
import Footer from "./shared/Footer.tsx";

import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";

const LandingPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cld = new Cloudinary({ cloud: { cloudName: "dgptexs0w" } });
  const collageImage = cld
    .image("KluubLanding_elrymc")
    .format("auto")
    .quality("auto")
    .resize(auto());

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflowX;
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = originalStyle;
    };
  }, []);

  const handleCitySelect = (cityName: string) => {
    navigate(`/events?city=${cityName}`);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black">
      {/* Background Collage */}
      <div className="flex-grow relative ">
        <div className="absolute inset-0 overflow-hidden hidden md:block">
          <AdvancedImage
            cldImg={collageImage}
            alt="Collage"
            className="w-full h-full object-cover translate-x-[20%] scale-[0.87] translate-y-[-11%] origin-bottom"
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
            {t("landingPage.title")}
            <br />
            <br />
            <p className="md:block font-montserrat-bolder">
              {t("landingPage.subtitle")}
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
                  className="relative z-10 w-40 h-12 md:w-64 md:h-20 text-xl md:text-[2rem] text-[#929292]
                            font-dela-gothic-one font-black bg-[#494725] border-2 border-[#696969]
                            uppercase flex items-end justify-center pb-2.5 md:pb-6 custom-text-shadow tracking-widest !cursor-default leading-none"
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
                  <button
                    onClick={() => handleCitySelect("Tartu")}
                    aria-label="Select Tartu"
                    className="relative z-10 w-36 h-12 md:w-60 md:h-20 text-xl md:text-[2rem] text-white
                                font-dela-gothic-one font-black bg-[#E4DD3B] border-2 border-white
                                uppercase flex items-end justify-center pb-2.5 md:pb-6 hover:bg-black
                                transition-colors duration-200 custom-text-shadow tracking-widest leading-none"
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
                    className="relative z-10 w-36 h-12 md:w-60 md:h-20 text-xl md:text-[2rem] text-[#929292]
                                font-dela-gothic-one font-black bg-[#494725] border-2 border-[#696969]
                                uppercase flex items-end justify-center pb-2.5 md:pb-6 custom-text-shadow tracking-widest !cursor-default leading-none"
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
      <div className="w-full z-40 absolute bottom-0">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
