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

export default function RegisterScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // Validaciones basicas
    if (!usuario.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password.length < 4) {
      Alert.alert('Error', 'La contrasena debe tener al menos 4 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contrasenas no coinciden');
      return;
    }

    try {
      // Recuperar usuarios existentes
      const usuariosJSON = await AsyncStorage.getItem('usuarios');
      const usuarios = usuariosJSON ? JSON.parse(usuariosJSON) : [];

      // Verificar que el usuario no exista
      const yaExiste = usuarios.find((u) => u.usuario === usuario.trim());
      if (yaExiste) {
        Alert.alert('Error', 'Ese usuario ya esta registrado');
        return;
      }

      // Agregar nuevo usuario
      const nuevoUsuario = {
        usuario: usuario.trim(),
        password: password,
      };
      usuarios.push(nuevoUsuario);

      // Guardar en AsyncStorage
      await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));

      Alert.alert('Exito', 'Usuario registrado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Login'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Ocurrio un problema al registrar el usuario');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Registrate para empezar</Text>

        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Elige un usuario"
          placeholderTextColor="#999"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contrasena</Text>
        <TextInput
          style={styles.input}
          placeholder="Minimo 4 caracteres"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar Contrasena</Text>
        <TextInput
          style={styles.input}
          placeholder="Repeti la contrasena"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <CustomButton title="Registrarme" onPress={handleRegister} />

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkText}>
            Ya tenes cuenta?{' '}
            <Text style={styles.linkBold}>Inicia sesion</Text>
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
