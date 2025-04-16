import { FC } from "react";
import Footer from "./shared/Footer";
import "./index.css";

const Contact: FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col text-white font-dela-gothic-one">
      <div className="absolute inset-0 area z-0"></div>

      <div className="relative py-12 sm:max-w-6xl w-full sm:mx-auto px-8 flex-grow">
        {/* Contact Info Box */}
        <div className="relative self-center inline-block w-full max-w-sm mx-auto mb-20 mt-10">
          <div className="absolute w-full h-full translate-x-1.5 translate-y-1.5 bg-[#E4DD3B] z-0"></div>
          <div className="relative z-10 p-6 bg-black border border-white/70 space-y-4 text-center">
            <p className="text-[1.2rem] font-montserrat-bolder">Kluubike OÜ</p>
            <p className="text-[1.2rem] font-montserrat-bolder">
              info@kluub.ee
            </p>
            <p className="text-[1.2rem] font-montserrat-bolder">
              +372 1234 5678
            </p>
          </div>
        </div>

        {/* Our Vision Box */}
        <div className="relative w-full max-w-5xl mx-auto mb-20">
          <div className="absolute w-full h-full -translate-x-1.5 -translate-y-1.5 bg-[#E4DD3B] z-0" />
          <div className="relative z-10 bg-black border border-white/70 p-8">
            <h2 className="text-3xl font-dela-gothic-one text-left">
              Our Vision
            </h2>
            <div className="w-60 border-t-2 border-white/70 mt-2 mb-4"></div>
            <p className="text-left text-white font-montserrat">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
              sodales massa at nisl dignissim interdum. Fusce eleifend lorem at
              eros varius, non tempus odio malesuada. Nulla facilisi. Quisque eu
              semper sem, non dapibus arcu. In hac habitasse platea dictumst.
            </p>
          </div>
        </div>

        {/* Our Mission Box */}
        <div className="relative w-full max-w-5xl mx-auto mb-20">
          <div className="absolute w-full h-full translate-x-1.5 translate-y-1.5 bg-[#E4DD3B] z-0" />
          <div className="relative z-10 bg-black border border-white/70 p-8">
            <h2 className="text-3xl font-dela-gothic-one text-right">
              Our Mission
            </h2>
            <div className="ml-auto w-60 border-t-2 border-white/70 mt-2 mb-4"></div>
            <p className="text-right text-white font-montserrat">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed risus
              turpis, tempus in orci ac, rhoncus varius libero. Vestibulum ante
              ipsum primis in faucibus orci luctus et ultrices posuere cubilia
              curae; Vivamus vel egestas metus. Nulla luctus metus ac sem
              placerat, eu lobortis libero dapibus.
            </p>
          </div>
        </div>

        {/* Meet the Team Header */}
        <h2 className="text-3xl font-dela-gothic-one text-center mt-20">
          Meet the team
        </h2>
        <div className="mt-2 w-40 border-t-2 border-white/70 mx-auto mb-20"></div>

        {/* Team Members */}
        <div className="flex justify-center flex-wrap gap-10 mb-32">
          {[1, 2, 3, 4].map((member) => (
            <div key={member} className="flex flex-col items-center space-y-2">
              <div className="relative flex-shrink-0 w-[200px] h-[200px]">
                <div className="absolute w-full h-full translate-x-1.5 translate-y-1.5 bg-[#E4DD3B] z-0"></div>
                <div className="relative z-10 bg-black border border-white/70 w-full h-full"></div>
              </div>
              <p className="text-lg font-montserrat-bolder text-white">
                Name {member}
              </p>
              <p className="text-sm font-montserrat-medium text-gray-300">
                Position {member}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
