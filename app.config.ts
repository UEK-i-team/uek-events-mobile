import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const allowHttp = process.env.EXPO_PUBLIC_ALLOW_HTTP === 'true';

  return {
    ...config,
    name: "UEK Eventuje",
    slug: "uek-events-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "uekeventsmobile",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.item.uekevents",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        ...(allowHttp
          ? {
              NSAppTransportSecurity: {
                NSAllowsArbitraryLoads: true,
              },
            }
          : {}),
      },
    },
    android: {
      package: "com.item.uekevents",
      versionCode: 1,
      // @ts-ignore - To właściwość znana przez natywny builder, ale może jej brakować w podstawowych typach configu.
      usesCleartextTraffic: allowHttp,
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      notification: {
        color: "#E6F4FE"
      },
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          color: "#E6F4FE",
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "0015ea15-697c-44f8-8b5f-1ca9798f6d5d",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/0015ea15-697c-44f8-8b5f-1ca9798f6d5d",
    },
  };
};
