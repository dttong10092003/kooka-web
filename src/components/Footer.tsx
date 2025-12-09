import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ChefHat, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const selectedLanguage = languages.find((l) => l.code === language) || languages[0];

  return (
    <footer className="bg-[#181e29] text-gray-300 pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-2">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Kooka</span>
          </div>
          <p className="mb-6 text-gray-400">{t("footer.description")}</p>
          <div className="flex gap-4 text-gray-400">
            <a href="#" aria-label="Facebook"><Facebook className="w-5 h-5 hover:text-orange-500 transition" /></a>
            <a href="#" aria-label="Twitter"><Twitter className="w-5 h-5 hover:text-orange-500 transition" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5 hover:text-orange-500 transition" /></a>
            <a href="#" aria-label="YouTube"><Youtube className="w-5 h-5 hover:text-orange-500 transition" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">{t("footer.quickLinks")}</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/recipes/all" className="hover:text-white transition">
                {t("footer.allRecipes")}
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-white transition">
                {t("footer.popularIngredients")}
              </Link>
            </li>
            <li>
              <Link to="/meal-planner" className="hover:text-white transition">
                {t("footer.mealPlanning")}
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-white transition">
                {t("footer.cookingTips")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4">{t("header.categories")}</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/recipes/all" 
                state={{ categoryName: t("footer.breakfast") }}
                className="hover:text-white transition"
              >
                {t("footer.breakfast")}
              </Link>
            </li>
            <li>
              <Link 
                to="/recipes/all" 
                state={{ categoryName: t("footer.lunch") }}
                className="hover:text-white transition"
              >
                {t("footer.lunch")}
              </Link>
            </li>
            <li>
              <Link 
                to="/recipes/all" 
                state={{ categoryName: t("footer.dinner") }}
                className="hover:text-white transition"
              >
                {t("footer.dinner")}
              </Link>
            </li>
            <li>
              <Link 
                to="/recipes/all" 
                state={{ categoryName: t("footer.desserts") }}
                className="hover:text-white transition"
              >
                {t("footer.desserts")}
              </Link>
            </li>
         
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-white font-semibold mb-4">{t("footer.contactUs")}</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2"><Mail className="w-5 h-5 text-orange-500" /> <span>cskh.kooka@gmail.com</span></li>
            <li className="flex items-center gap-2"><Phone className="w-5 h-5 text-orange-500" /> <span>+1 (555) 123-4567</span></li>
            <li className="flex items-center gap-2"><MapPin className="w-5 h-5 text-orange-500" /> <span>12 Nguyen Van Bao, TP HCM</span></li>
          </ul>
        </div>

        {/* Language Selector */}
        <div className="mt-6">
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm cursor-pointer"
            >
              <Globe className="w-4 h-4 text-orange-500" />
              <span className="text-xs">{selectedLanguage.flag}</span>
              <span>{selectedLanguage.name}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`} />
            </button>

            {isLanguageOpen && (
              <div className="absolute bottom-full mb-2 left-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg min-w-[140px] z-10">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as "vi" | "en");
                      setIsLanguageOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-700 transition-colors text-sm first:rounded-t-lg last:rounded-b-lg"
                  >
                    <span className="text-xs">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
        <div className="mb-4 md:mb-0">© 2025 Kooka. {t("footer.allRightsReserved")}</div>
        <div className="flex gap-6">
          <Link to="/privacy-policy" className="hover:text-white transition">{t("footer.privacyPolicy")}</Link>
          <Link to="/terms-of-service" className="hover:text-white transition">{t("footer.termsOfService")}</Link>
        </div>
      </div>
    </footer>
  );
}
