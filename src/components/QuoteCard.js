import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// QuoteCard-komponenten ansvarar för att visa ett citat, författare och knappar för att spara / ta bort
const QuoteCard = ({ quote, onSave, onRemove }) => {
  return (
    <View style={styles.quoteCard}>
      {/* Visar själva citatet med hjälp av text */}
      <Text style={styles.quoteText}>"{quote.quote}"</Text>
      {/* Visar författarens namn */}
      <Text style={styles.authorText}>- {quote.author}</Text>

      {/* Element för att visa "Spara"-knapp om funktionen onSave har skickats med */}
      {onSave && (
        <TouchableOpacity onPress={() => onSave(quote)} style={styles.saveButton}>
          {/* Hjärt-ikon från Ionicons, används för att representera spara */}
          <Ionicons name="heart" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      )}

      {/* Element för att visa "Ta bort"-knapp om funktionen onRemove har skickats med */}
      {onRemove && (
        <TouchableOpacity onPress={() => onRemove(quote)} style={styles.removeButton}>
          {/* Kryss-ikon från Ionicons, används för att representera ta bort */}
          <Ionicons name="close" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  quoteCard: {
    marginBottom: 15,
    padding: 35,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
    paddingBottom: 40, 
  },
  quoteText: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'Roboto', 
    lineHeight: 28, 
    textShadowColor: '#ddd',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  authorText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#777',
    fontFamily: 'Roboto',
    marginBottom: 10,
  },
  saveButton: {
    position: 'absolute',
    bottom: 10,
    right: 40,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 8,
    elevation: 5,
  },
  removeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 8,
    elevation: 5,
  },
});

export default QuoteCard;