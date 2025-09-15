// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from "react";
import { translations } from "../locales/translations";

export type Language = "vi" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Hàm helper để lấy value theo path "header.home"
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("vi");

  const t = (path: string): string => {
    return getNestedValue(translations[language], path) ?? path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
