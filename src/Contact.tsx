import { FC } from "react";
import Footer from "./shared/Footer";
import "./index.css";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

const cld = new Cloudinary({ cloud: { cloudName: "dgptexs0w" } });

const getCloudinaryUrl = (publicId: string, width: number, height: number) => {
  return cld.image(publicId).resize(fill().width(width).height(height)).toURL();
};

const teamMemberImageIds = [
  "jan_rmbg_qmy1at",
  "stassy_nobg_t3591d",
  "meus_nobg_ukzzmc",
  "kathy_nobg_1_b9bshm",
];

const teamMembers = [
  { name: "Jan Erik Köst", position: "Bee keeper 1", offset: -40 },
  { name: "Anastasya Chertova", position: "Bee keeper 2", offset: -30 },
  { name: "Karl-Andreas Meus", position: "Bee keeper 3", offset: -20 },
  { name: "Kathy Klassen", position: "Bee keeper 4", offset: -50 },
];

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
        <div className="relative w-full max-w-5xl mx-auto mb-10">
          <div className="absolute w-full h-full -translate-x-1.5 -translate-y-1.5 bg-[#E4DD3B] z-0" />
          <div className="relative z-10 bg-black border border-white/70 p-8">
            <h2 className="text-3xl font-dela-gothic-one text-left">
              Our Vision
            </h2>
            <div className="w-60 border-t-2 border-white/70 mt-2 mb-4"></div>
            <p className="text-left text-white font-montserrat-bolder">
              We are here to become the go-to digital hive for the social scene,
              where buzzing bars and social butterflies connect.
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
            <p className="text-right text-white font-montserrat-bolder">
              We give venues the tools to showcase their scene and let users
              instantly see where the buzz is—who's going, what's happening, and
              what's worth showing up for.
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
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="flex flex-col items-center space-y-2 group"
            >
              <div
                className="relative flex-shrink-0 w-[200px] h-[200px] overflow-visible z-10 transition-all"
                style={{ marginLeft: member.offset || 0 }}
              >
                {teamMemberImageIds[index] && (
                  <img
                    src={getCloudinaryUrl(teamMemberImageIds[index], 500, 500)}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 z-50"
                  />
                )}
              </div>
              <p
                className="text-lg font-montserrat-bolder text-white w-[200px] word-spacing-normal"
                style={{ width: "200px", wordSpacing: "normal" }}
              >
                {member.name}
              </p>
              <p
                className="text-sm font-montserrat-medium text-gray-300 w-[200px] word-spacing-normal"
                style={{ width: "200px", wordSpacing: "normal" }}
              >
                {member.position}
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
