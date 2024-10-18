import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name || 'FT Hackathon 2024',
  slug: config.slug || 'ft-hackathon-2024',
  owner: 'aminenouabi',
  android: {
    ...config.android,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ||
      config.android?.googleServicesFile ||
      './google-services.json',
  },
  ios: {
    ...config.ios,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_PLIST ||
      config.ios?.googleServicesFile ||
      './GoogleService-Info.plist',
  },
  updates: {
    url: 'https://u.expo.dev/a57c3d36-d29b-40ed-a2f3-4c9cb7ee0204',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
});
