import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import { Ionicons } from '@expo/vector-icons';

// Skapa en Tab-navigator som hanterar navigeringen mellan sidor
const Tab = createBottomTabNavigator();

export default function App() {
  return (
        // NavigationContainer är en wrapper som hanterar navigering i appen
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Tabbarna får en ikon beroende på vilken skärm som är vald
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
                          // Om skärmen är 'Home', använd en hem-ikon
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Favorites') {
              // Om skärmen är 'Favorites', använd en hjärt-ikon
              iconName = focused ? 'heart' : 'heart-outline';
            }
            // Returnerar en Ionicon med den valda ikonen
            return <Ionicons name={iconName} size={size} color={color} />;
          },
                    // Definiera färgen på ikonen när den är aktiv
          tabBarActiveTintColor: '#FF6B6B',
                    // Färg när ikonen inte är aktiv
          tabBarInactiveTintColor: '#555',
          tabBarStyle: {
            paddingBottom: 15,
            paddingTop: 15,
            height: 90,
          },
          tabBarLabelStyle: {
            fontSize: 15, 
            fontWeight: '600', 
            fontFamily: 'Roboto', 
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
