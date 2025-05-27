import { FC } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const switchToEnglish = () => i18n.changeLanguage("en");
  const switchToEstonian = () => i18n.changeLanguage("et");

  return (
    <div className="flex space-x-2">
      <button
        onClick={switchToEstonian}
        className={`px-4 py-2 h-10 bg-black border-2 border-white/70 font-montserrat-medium uppercase transition-colors duration-200 ${
          currentLang === "et" ? "text-[#E4DD3B] font-bold" : "text-white"
        }`}
      >
        EST
      </button>
      <button
        onClick={switchToEnglish}
        className={`px-4 py-2 h-10 bg-black border-2 border-white/70 font-montserrat-medium uppercase transition-colors duration-200 ${
          currentLang === "en" ? "text-[#E4DD3B] font-bold" : "text-white"
        }`}
      >
        ENG
      </button>
    </div>
  );
};

export default LanguageSwitcher;
