# Read me for Bombay Expo App

- To setup the application:
`npx create-expo-app -t expo-template-blank-typescript .`

- To start the application:
  - Expo Go: `npx expo start`
  - For iOS: `npm run ios`
  - For Web: `npm run web` 
  - Android: `npm run android`

- The dummy credentials for testing are:
Email: test@example.com
Password: password

## Builds

## Build Steps:
1. Install necessary build tools: `npx expo install expo-dev-client`
2. Two options for build:
  1. Using EAS Build(Recommended):
    - `npm install -g eas-cli`
    - `eas login`
    - `eas build:configure`
    - `eas build -p android`
 2. Using Classic Build:
    - `expo build:android`
3. Build Types:
    1. For development build:               `eas build -p android --profile development`
    2. For preview APK(easier to install):  `eas build -p android --profile preview`
    3. For production build:                `eas build -p android --profile development`

## Run on Emulator
1. Check available emulators: `emulator -list-avds`.
2. Check adb is running: `adb devices`
3. Build and run on emulator: `npx expo run:android`
2. To run in emulator for example: `emulator -avd emulator -avd Pixel_7_API_29`