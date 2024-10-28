import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  GetStarted: undefined;
  WalletSetup: undefined;
  WalletCreationForm: undefined;
  ImportWalletScreen: undefined;
  Main: NavigatorScreenParams<TabParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

export type TabParamList = {
  Home: undefined;
  Portfolio: undefined;
  Contact: undefined;
  History: undefined;
  Logs: undefined;
  Settings: undefined;
  TransferScreen: undefined;
  TransactionHistory: undefined;
  NFTsection: undefined;
};

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
