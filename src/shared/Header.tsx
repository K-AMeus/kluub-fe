import { FC } from "react";
import { Link } from "react-router-dom";

const Header: FC = () => {
  return (
    <header className="bg-black bg-opacity-100 fixed top-0 -left-1 -right-1 z-60 font-montserrat-medium border-b-1 border-white/70">
      <nav className="px-8 lg:px-10 2xl:px-20 flex items-center justify-center h-14 2xl:h-16 relative z-10">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-white font-dela-gothic-one text-[1.8rem] 2xl:text-4xl relative
                       after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-1
                       after:bg-[#E4DD3B] after:transition-all after:duration-300
                       hover:after:w-full"
            onClick={() => window.scrollTo(0, 0)}
          >
            KLUUB.EE
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
