import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {Home,ProcurarEvento,EntrarEvento,Tips,Ranking,ProcurarRanking,CriarEvento} from './views';

export default function App() {

  const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Home" 
                    component={Home}
                    options={{
                        title:"CAÇA TESOURO",
                        // headerStyle:{backgroundColor: "#73D4FF"},
                        headerStyle:{backgroundColor: "#fcd526"},
                        headerTintColor: "#333",
                        headerTitleStyle:{fontWeight:"bold", alignSelf: "center"}
                }}/>
                <Stack.Screen 
                    name="ProcurarEvento" 
                    component={ProcurarEvento} 
                    options={{headerShown:false}}
                />
                <Stack.Screen 
                    name="EntrarEvento" 
                    component={EntrarEvento} 
                    options={{headerShown:false}}
                />
                <Stack.Screen 
                    name="Tips" 
                    component={Tips} 
                    options={{headerShown:false}}
                />
                <Stack.Screen 
                    name="Ranking" 
                    component={Ranking} 
                    options={{headerShown:false}}
                />
                <Stack.Screen 
                    name="ProcurarRanking" 
                    component={ProcurarRanking} 
                    options={{headerShown:false}}
                />
                <Stack.Screen 
                    name="CriarEvento" 
                    component={CriarEvento} 
                    options={{headerShown:false}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}