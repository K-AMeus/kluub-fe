import { FC } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer: FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-black border-t-[6px] border-[#E4DD3B] text-white font-montserrat-small text-[1.1rem]">
      <div className="w-full px-8 pt-4 pb-4 flex justify-between items-center">
        {/* Left Section: Email, Contact, and Sign In */}
        <div className="flex items-center space-x-6 flex-nowrap">
          <a
            href="mailto:info@kluub.ee"
            className="hover:underline whitespace-nowrap"
          >
            info@kluub.ee ||
          </a>
          <Link
            to="/contact"
            className="hover:underline hidden md:block whitespace-nowrap"
            onClick={() => window.scrollTo(0, 0)}
          >
            {t("footer.contact")} ||
          </Link>
          <Link
            to="/auth?mode=login"
            className="hover:underline hidden md:block whitespace-nowrap"
            onClick={() => window.scrollTo(0, 0)}
          >
            {t("footer.signIn")} ||
          </Link>
        </div>

        {/* Right Section: Social Media Icons, Privacy Policy, and Year */}
        <div className="flex items-center">
          <div className="flex space-x-4 items-center pr-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="h-6 w-6 md:h-8 md:w-8 hover:text-[#E4DD3B]" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="h-6 w-6 md:h-8 md:w-8 hover:text-[#E4DD3B]" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="h-6 w-6 md:h-8 md:w-8 hover:text-[#E4DD3B]" />
            </a>
          </div>

          <div className=" flex-row items-end ml-6 justify-center text-md hidden md:flex">
            <div >@Kluub 2025</div>
            <Link
              to="/privacy"
              className="hover:underline pl-4"
              onClick={() => window.scrollTo(0, 0)}
            >
              {t("footer.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
