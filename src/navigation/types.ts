export type RootStackParamList = {
  Home: undefined;
  // Add more screens here
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 