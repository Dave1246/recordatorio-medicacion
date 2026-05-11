import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Componente reutilizable: Item de la lista de medicaciones
 * Props:
 *  - medication: objeto { id, nombre, dosis, horario }
 *  - onDelete: funcion para eliminar la medicacion
 */
export default function MedicationItem({ medication, onDelete }) {
  return (
    <View style={styles.item}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💊</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.nombre}>{medication.nombre}</Text>
        {medication.dosis ? (
          <Text style={styles.dosis}>Dosis: {medication.dosis}</Text>
        ) : null}
        <View style={styles.horarioContainer}>
          <Text style={styles.horarioIcon}>⏰</Text>
          <Text style={styles.horario}>{medication.horario}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#e8f0fe',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  dosis: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  horarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  horarioIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  horario: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffebee',
  },
  deleteText: {
    fontSize: 18,
  },
});
