import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native';
import MedicationItem from '../components/MedicationItem';
import CustomButton from '../components/CustomButton';

export default function HomeScreen({ navigation }) {
  const [medicaciones, setMedicaciones] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState('');

  // Cargar datos cada vez que la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      // Cargar usuario actual
      const sesionJSON = await AsyncStorage.getItem('sesionActiva');
      if (sesionJSON) {
        const sesion = JSON.parse(sesionJSON);
        setUsuarioActual(sesion.usuario);
      }

      // Cargar medicaciones
      const medicacionesJSON = await AsyncStorage.getItem('medicaciones');
      const lista = medicacionesJSON ? JSON.parse(medicacionesJSON) : [];
      setMedicaciones(lista);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const eliminarMedicacion = async (id) => {
    Alert.alert(
      'Confirmar',
      'Estas seguro que queres eliminar esta medicacion?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const med = medicaciones.find((m) => m.id === id);
              // Cancelar notificacion programada si existe
              if (med && med.notificationId) {
                await Notifications.cancelScheduledNotificationAsync(
                  med.notificationId
                );
              }

              const nuevaLista = medicaciones.filter((m) => m.id !== id);
              await AsyncStorage.setItem(
                'medicaciones',
                JSON.stringify(nuevaLista)
              );
              setMedicaciones(nuevaLista);
            } catch (error) {
              console.error('Error al eliminar:', error);
            }
          },
        },
      ]
    );
  };

  const cerrarSesion = async () => {
    Alert.alert('Cerrar sesion', 'Queres cerrar sesion?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Si',
        onPress: async () => {
          await AsyncStorage.removeItem('sesionActiva');
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hola, {usuarioActual}</Text>
          <Text style={styles.headerSubtitle}>
            Tenes {medicaciones.length} medicacion(es)
          </Text>
        </View>
        <TouchableOpacity onPress={cerrarSesion} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {medicaciones.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💊</Text>
          <Text style={styles.emptyTitle}>No hay medicaciones</Text>
          <Text style={styles.emptySubtitle}>
            Toca el boton de abajo para agregar tu primera medicacion
          </Text>
        </View>
      ) : (
        <FlatList
          data={medicaciones}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MedicationItem
              medication={item}
              onDelete={() => eliminarMedicacion(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.addButtonContainer}>
        <CustomButton
          title="+ Agregar Medicacion"
          onPress={() => navigation.navigate('AddMedication')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0eaf7',
    marginTop: 3,
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 15,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 70,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});
