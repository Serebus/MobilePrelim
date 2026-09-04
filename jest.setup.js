/* global jest */
import { NativeModules } from 'react-native';

if (NativeModules.StatusBarManager) {
  NativeModules.StatusBarManager.setNetworkActivityIndicatorVisible = jest.fn();
}
