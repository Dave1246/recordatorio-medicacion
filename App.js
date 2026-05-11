import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

// Pantallas
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddMedicationScreen from './screens/AddMedicationScreen';

// Configuracion del comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Solicitar permisos de notificaciones al iniciar la app
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permisos de notificacion no concedidos');
      }
    };
    requestPermissions();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#4A90E2' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Iniciar Sesion' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Registro' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Mis Medicaciones', headerLeft: () => null }}
        />
        <Stack.Screen
          name="AddMedication"
          component={AddMedicationScreen}
          options={{ title: 'Nueva Medicacion' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
