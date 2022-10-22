import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/Home';
import EntryScreen from './screens/Entry';
import RegisterScreen from './screens/Register';


const StonkNavigator = createStackNavigator(); 
export const Navigation = () => {
    return(
        
        <StonkNavigator.Navigator>
            <StonkNavigator.Screen name='Entry'component={EntryScreen}/>
            <StonkNavigator.Screen name='Home' component={HomeScreen}/>
            <StonkNavigator.Screen name='Register' component={RegisterScreen}/>
        </StonkNavigator.Navigator>
    )
}

