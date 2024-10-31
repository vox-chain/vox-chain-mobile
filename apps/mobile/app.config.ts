import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log('config =', config);
  const { googleServicesFile, ...ios } = config.ios as any;
  const { googleServicesFile: _, ...android } = config.android as any;
  return {
    ...config,
    name: config.name || 'FT Hackathon 2024',
    slug: config.slug || 'ft-hackathon-2024',
    owner: 'fevertokens',
    android,
    ios: {
      ...ios,
    },
    updates: {
      url: 'https://u.expo.dev/a57c3d36-d29b-40ed-a2f3-4c9cb7ee0204',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  };
};
