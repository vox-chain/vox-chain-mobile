# Internationalization

This directory contains the localization files for the project. The localization files are used to translate the text in the application to different languages.

## Usage

### 1 - Adding translations

For each language, go to the corresponding JSON file and add the translations for the text you want to add to the application.

For example, to add a translation for the text `"Hello"` in French, add the following key-value pair to the `fr/translations.json` file:

```json
{
  "Hello": "Bonjour",
  ... // other translations
}
```

> [!WARNING] Case sensitivity and matching is important.
> The keys in the JSON object should match the keys in the source code exactly.

### 2 - Using translations

The `useTranslation` hook is used to get the translations for the current language. The hook returns an object with the `t` function that can be used to get the translation for a key.

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t("hello")}</Text>
      <Text>{t("goodbye")}<Text>
    </View>
  );
}
```

## Adding a new language

To add a new language, create a new folder in the `~/src/localization` directory with the name of the language code. For example, to add a French translation, create a file named `localization/fr/translations.json`.

The file should contain a JSON object with the translations for the language. For example:

```json
{
  "hello": "Bonjour",
  "goodbye": "Au revoir"
}
```

then add the language code to the `~/src/localization/index.ts` file:

```ts
...

import fr from "./fr/translations.json";
import en from "./en/translations.json";
** import the new language json file here **

const resources = {
  fr: {
	translation: fr,
  },
  en: {
	translation: en,
  },
  ** add the new language here **
};
```
