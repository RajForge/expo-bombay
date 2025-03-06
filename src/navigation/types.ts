export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  // Add more screens here
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 