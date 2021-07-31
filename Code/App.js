/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';



import Login from './src/components/Login';
import Events from './src/components/Events';
import ListTickets from './src/components/ListTickets';
import AuthLoadingScreen from './src/components/AuthLoadingScreen';
import ScanBarcode from './src/components/ScanBarcode';





const AuthStack = createStackNavigator({ Login: Login });

const AppNavigator = createStackNavigator(
  {
    Events: Events,
    ListTickets: ListTickets,
    ScanBarcode: ScanBarcode
  },
  {
  
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f29d00',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      
    },
  }
  
  
);


export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppNavigator,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )

);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,

        backgroundColor: '#c0d6f1'
    },
    
});

