import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import CustomButton from '../components/CustomButton';

export default function AddMedicationScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [dosis, setDosis] = useState('');
  const [hora, setHora] = useState('');
  const [minuto, setMinuto] = useState('');
  const [segundosNotif, setSegundosNotif] = useState('10');
  const [tipoNotificacion, setTipoNotificacion] = useState('segundos'); // 'segundos' o 'hora'

  const programarNotificacion = async (medicacion) => {
    try {
      let trigger;

      if (tipoNotificacion === 'segundos') {
  const segs = parseInt(segundosNotif, 10);
  if (isNaN(segs) || segs < 1) {
    Alert.alert('Error', 'Ingresa un numero valido de segundos (minimo 1)');
    return null;
  }
  trigger = {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: segs,
    repeats: false,
  };
} else {
  const h = parseInt(hora, 10);
  const m = parseInt(minuto, 10);
  if (isNaN(h) || h < 0 || h > 23) {
    Alert.alert('Error', 'Hora invalida (0-23)');
    return null;
  }
  if (isNaN(m) || m < 0 || m > 59) {
    Alert.alert('Error', 'Minuto invalido (0-59)');
    return null;
  }
  trigger = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: h,
    minute: m,
  };
}

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '💊 Hora de tu medicacion',
          body: `Tomar: ${medicacion.nombre}${
            medicacion.dosis ? ' - ' + medicacion.dosis : ''
          }`,
          sound: true,
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Error programando notificacion:', error);
      return null;
    }
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Ingresa el nombre del medicamento');
      return;
    }

    try {
      const nuevaMedicacion = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
        dosis: dosis.trim(),
        horario:
          tipoNotificacion === 'hora'
            ? `${hora.padStart(2, '0')}:${minuto.padStart(2, '0')}`
            : `En ${segundosNotif} segundos`,
        tipoNotificacion,
        creado: new Date().toISOString(),
      };

      // Programar notificacion
      const notificationId = await programarNotificacion(nuevaMedicacion);
      if (notificationId === null) return;
      nuevaMedicacion.notificationId = notificationId;

      // Guardar en AsyncStorage
      const medicacionesJSON = await AsyncStorage.getItem('medicaciones');
      const medicaciones = medicacionesJSON ? JSON.parse(medicacionesJSON) : [];
      medicaciones.push(nuevaMedicacion);
      await AsyncStorage.setItem('medicaciones', JSON.stringify(medicaciones));

      Alert.alert(
        'Exito',
        `Medicacion guardada y notificacion programada (${nuevaMedicacion.horario})`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la medicacion');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Datos del Medicamento</Text>

          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Ibuprofeno"
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Dosis (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 1 comprimido / 500mg"
            placeholderTextColor="#999"
            value={dosis}
            onChangeText={setDosis}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Programar Recordatorio</Text>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tab,
                tipoNotificacion === 'segundos' && styles.tabActive,
              ]}
              onPress={() => setTipoNotificacion('segundos')}
            >
              <Text
                style={[
                  styles.tabText,
                  tipoNotificacion === 'segundos' && styles.tabTextActive,
                ]}
              >
                En segundos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                tipoNotificacion === 'hora' && styles.tabActive,
              ]}
              onPress={() => setTipoNotificacion('hora')}
            >
              <Text
                style={[
                  styles.tabText,
                  tipoNotificacion === 'hora' && styles.tabTextActive,
                ]}
              >
                Hora fija (diaria)
              </Text>
            </TouchableOpacity>
          </View>

          {tipoNotificacion === 'segundos' ? (
            <>
              <Text style={styles.label}>Segundos hasta el aviso</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 10"
                placeholderTextColor="#999"
                value={segundosNotif}
                onChangeText={setSegundosNotif}
                keyboardType="numeric"
              />
              <Text style={styles.helper}>
                La notificacion se disparara en {segundosNotif || '0'}{' '}
                segundo(s)
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.label}>Hora del recordatorio</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.inputSmall]}
                  placeholder="HH"
                  placeholderTextColor="#999"
                  value={hora}
                  onChangeText={setHora}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.colon}>:</Text>
                <TextInput
                  style={[styles.input, styles.inputSmall]}
                  placeholder="MM"
                  placeholderTextColor="#999"
                  value={minuto}
                  onChangeText={setMinuto}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <Text style={styles.helper}>
                La notificacion se repetira todos los dias a esa hora
              </Text>
            </>
          )}
        </View>

        <CustomButton title="Guardar Medicacion" onPress={handleGuardar} />
        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputSmall: {
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colon: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginBottom: 12,
    color: '#555',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    color: '#666',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  helper: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 5,
  },
});
