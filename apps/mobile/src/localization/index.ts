import { getLocales } from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// import { I18nManager } from "react-native";
// import { reloadAppAsync } from "expo";
// import ar from "./ar/translations.json";
import en from './en/translations.json';
import fr from './fr/translations.json';
import { getLocal, setLocal } from './store';

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  //   ar: {
  //     translation: ar,
  //   },
};

export type Local = keyof typeof resources;

/**
 * updateLanguage - Update the language of the app
 *                  and reload it if needed (if changing to/from arabic)
 * @param lng the language to change to
 * @returns void
 *
 * Note: Commented out ar and rtl support for now
 * TODO: Add back the ar and rtl support
 */
export const updateLanguage = async (lng: Local) => {
  if (lng === i18next.language) return;
  //   const oldLocal = i18next.language;
  await setLocal(lng);
  i18next
    .changeLanguage(lng)
    .then(() => {
      //   if (lng === "ar" || oldLocal === "ar") {
      //     I18nManager.allowRTL(true);
      //     I18nManager.forceRTL(true);
      //     reloadAppAsync("To flip the app direction");
      //   }
    })
    .catch((err) => {
      console.log(err);
      console.log('Something went wrong while Changing i18n language');
    });
};

export async function loadLocal() {
  const local = (await getLocal()) || (getLocales()[0].languageCode as Local);
  if (local) await updateLanguage(local);
}

/**
 * initI18n - Initialize the i18n library with the resources and the local language
 *            If the stored language is not set, it will use the device's language
 *
 * Note: Dedicated to run once in this file
 * @returns void
 */
async function initI18n() {
  const local = (await getLocal()) || (getLocales()[0].languageCode as Local);

  i18next.use(initReactI18next).init({
    resources,
    lng: local,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
}

initI18n();

export default i18next;
