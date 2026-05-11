import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * Componente reutilizable: Boton personalizado
 * Props:
 *  - title: texto del boton
 *  - onPress: funcion al presionar
 *  - color: color de fondo (opcional)
 *  - style: estilos adicionales (opcional)
 */
export default function CustomButton({ title, onPress, color, style }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        color && { backgroundColor: color },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
