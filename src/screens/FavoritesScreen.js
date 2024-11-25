import React, { useState, useEffect, useCallback } from 'react'; 
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useFocusEffect } from '@react-navigation/native'; 
import QuoteCard from '../components/QuoteCard'; 

// FavoritesScreen-komponenten ansvarar för att visa favoriter
const FavoritesScreen = ({ navigation }) => {
  // Skapa state för att hantera favoriter och laddningsstatus
  const [favorites, setFavorites] = useState([]); // Håller listan med sparade favoriter
  const [loading, setLoading] = useState(true); // Hanterar om innehållet håller på att laddas

  // Funktion för att hämta favoriter från lokal lagring (AsyncStorage)
  const getFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites'); // Hämta sparade data
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites)); // Om data finns, uppdatera state
      }
      setLoading(false); // Stäng av laddningsindikatorn
    } catch (error) {
      console.error('Error retrieving favorites:', error); 
      setLoading(false); // Stäng av laddningsindikatorn vid fel
    }
  };

  useFocusEffect(
    // Skapa en funktion
    useCallback(() => {
      // Hämta favoritdata när skärmen öppnas
      getFavorites(); 
    }, []) // Tom lista = kör bara när skärmen visas
  );
  

  // Funktion för att ta bort ett citat från favoriter
  const removeFavorite = async (quoteToRemove) => {
    try {
      // Filtrera bort det citat som ska tas bort
      const updatedFavorites = favorites.filter(
        (quote) => quote.quote !== quoteToRemove.quote
      );
      setFavorites(updatedFavorites); // Uppdatera state med den nya listan
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Uppdatera lokal lagring
      alert('Borttagen från favoriter!'); // Visa en bekräftelse till användaren
    } catch (error) {
      console.error('Error removing from favorites:', error); 
    }
  };

  return (
    <View style={styles.container}>
      {/* Om data fortfarande laddas, visa en laddningsindikator */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
      ) : favorites.length === 0 ? (
        // Om det inte finns några favoriter, visa ett meddelande
        <Text style={styles.emptyText}>Inga favoriter ännu.</Text>
      ) : (
        // Om favoriter finns, visa dem i en lista
        <FlatList
          data={favorites} // Data för listan
          keyExtractor={(item, index) => index.toString()} // Unik nyckel för varje objekt
          renderItem={({ item }) => (
            <QuoteCard 
              quote={item} // Skicka citatet till QuoteCard-komponenten
              onRemove={removeFavorite} // Funktion för att ta bort citat
            />
          )}
          showsVerticalScrollIndicator={false} // Dölj rullningsindikatorn
          contentContainerStyle={styles.listContainer} // Stilar för listan
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20,
    backgroundColor: '#f0f0f5',
  },
  loader: {
    marginTop: 50, 
  },
  listContainer: {
    paddingBottom: 20, 
  },
  emptyText: {
    textAlign: 'center', 
    marginTop: 20,
    fontSize: 18, 
    color: '#777', 
  },
});

export default FavoritesScreen;
