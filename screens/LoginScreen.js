import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!usuario.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      // Recuperar usuarios registrados desde AsyncStorage
      const usuariosJSON = await AsyncStorage.getItem('usuarios');
      const usuarios = usuariosJSON ? JSON.parse(usuariosJSON) : [];

      // Buscar usuario que coincida con las credenciales
      const usuarioEncontrado = usuarios.find(
        (u) => u.usuario === usuario.trim() && u.password === password
      );

      if (usuarioEncontrado) {
        // Guardar sesion activa
        await AsyncStorage.setItem(
          'sesionActiva',
          JSON.stringify({ usuario: usuarioEncontrado.usuario })
        );
        // Limpiar campos
        setUsuario('');
        setPassword('');
        // Navegar a Home
        navigation.replace('Home');
      } else {
        Alert.alert('Error', 'Usuario o contrasena incorrectos');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrio un problema al iniciar sesion');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Recordatorio de Medicacion</Text>

        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu usuario"
          placeholderTextColor="#999"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contrasena</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contrasena"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton title="Iniciar Sesion" onPress={handleLogin} />

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>
            No tenes cuenta?{' '}
            <Text style={styles.linkBold}>Registrate aqui</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
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
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  linkContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 14,
  },
  linkBold: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});
