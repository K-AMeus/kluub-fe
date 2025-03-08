import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: FC = () => {
    const { i18n } = useTranslation();

    const switchToEnglish = () => {
        i18n.changeLanguage('en');
    };

    const switchToEstonian = () => {
        i18n.changeLanguage('et');
    };

    return (
        <div className="flex space-x-2">
            <button
                className="px-3 py-1 border bg-black text-white font-bold hover:bg-gray-700"
                onClick={switchToEstonian}
            >
                EST
            </button>
            <button
                className="px-3 py-1 border bg-black text-white font-bold hover:bg-gray-700"
                onClick={switchToEnglish}
            >
                ENG
            </button>
        </div>
    );
};

export default LanguageSwitcher;
