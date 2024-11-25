import React, { useState, useEffect } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';  
import { Ionicons } from '@expo/vector-icons'; 
import QuoteCard from '../components/QuoteCard'; 
const HomeScreen = () => {
  // State för att lagra citaten som hämtas eller lagras
  const [quotes, setQuotes] = useState([]); 

  // State för att hålla koll på vilket citat som visas (index)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(-1); 

  const API_KEY = '5m8up/cIW3M+qB0tJaxLXw==WiKOZG51bH4AZSOU'; 

  // useEffect hook som körs när komponenten har laddats
  useEffect(() => {
    getStoredQuotes(); // Hämtar lagrade citat från AsyncStorage när appen startas
  }, []);

  // Funktion för att hämta tidigare sparade citat från AsyncStorage
  const getStoredQuotes = async () => {
    try {
      // Hämtar historik över citat från AsyncStorage
      const storedQuotes = await AsyncStorage.getItem('quoteHistory'); 
      if (storedQuotes) {
        // Om det finns lagrade citat, parse:a dem till ett objekt och uppdatera state
        const parsedQuotes = JSON.parse(storedQuotes); 
        setQuotes(parsedQuotes); 
        
        // Hämtar index för det senaste visade citatet
        const lastIndex = await AsyncStorage.getItem('lastQuoteIndex'); 
        setCurrentQuoteIndex(lastIndex ? parseInt(lastIndex) : parsedQuotes.length - 1); // Sätter aktuellt citat-index
      } else {
        // Om inga citat finns, hämta nya från API
        fetchNewQuote(); 
      }
    } catch (error) {
      console.error('Error retrieving quote history:', error); 
    }
  };

  // Funktion för att hämta ett nytt citat från ett externt API
  const fetchNewQuote = async () => {
    try {
      // Skickar en begäran till API:t med den angivna API-nyckeln
      const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
        headers: { 'X-Api-Key': API_KEY }, 
      });
      
      if (!response.ok) {
        console.error('Network response was not ok:', response.statusText); 
        return;
      }
      
      // Hämtar svaret som JSON och tar det första citatet
      const data = await response.json(); 
      const newQuote = data[0]; 

      // Uppdaterar citatlistan genom att lägga till det nya citatet
      const updatedQuotes = [...quotes, newQuote]; 
      setQuotes(updatedQuotes); 
      
      // Uppdaterar index för aktuellt citat
      setCurrentQuoteIndex(updatedQuotes.length - 1); 
      
      // Sparar den uppdaterade citathistoriken
      saveQuoteHistory(updatedQuotes); 
      
      // Spara indexet för det senaste visade citatet i AsyncStorage
      await AsyncStorage.setItem('lastQuoteIndex', (updatedQuotes.length - 1).toString()); 
    } catch (error) {
      console.error('Error fetching quote:', error); 
    }
  };

  // Funktion för att spara den uppdaterade citathistoriken
  const saveQuoteHistory = async (newQuotes) => {
    try {
      // Sparar den nya citathistoriken som en JSON-sträng i AsyncStorage
      await AsyncStorage.setItem('quoteHistory', JSON.stringify(newQuotes)); 
    } catch (error) {
      console.error('Error saving quote history:', error); // Loggar fel om sparning misslyckas
    }
  };

  // Funktion för att spara ett citat i användarens favoritlista
  const saveToFavorites = async (quote) => {
    try {
      // Hämtar tidigare sparade favoriter från AsyncStorage
      let favorites = await AsyncStorage.getItem('favorites'); 
      favorites = favorites ? JSON.parse(favorites) : []; // Om inga favoriter finns, skapa en tom lista

      // Kollar om citatet redan finns bland favoriterna
      const isAlreadyFavorite = favorites.some(
        (favQuote) => favQuote.quote === quote.quote && favQuote.author === quote.author
      );

      // Om citatet redan är en favorit, visa ett meddelande och avsluta
      if (isAlreadyFavorite) {
        alert('Citatet finns redan i favoriter!'); 
        return; 
      }

      // Lägg till citatet i favoriter och spara tillbaka till AsyncStorage
      favorites.push(quote);
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites)); 
      alert('Tillagd i favoriter!'); // Meddelande om att citatet har lagts till i favoriter
    } catch (error) {
      console.error('Error saving to favorites:', error); 
    }
  };

  // Funktion för att visa nästa citat
  const showNextQuote = () => {
    if (currentQuoteIndex < quotes.length - 1) {
      // Om det finns ett nästa citat, uppdatera indexet
      setCurrentQuoteIndex(currentQuoteIndex + 1); 
    } else {
      // Om inget nästa citat finns, hämta ett nytt citat
      fetchNewQuote(); 
    }
    // Spara det nya citatindexet
    AsyncStorage.setItem('lastQuoteIndex', (currentQuoteIndex + 1).toString()); 
  };

  // Funktion för att visa föregående citat
  const showPreviousQuote = () => {
    if (currentQuoteIndex > 0) {
      // Om det finns ett föregående citat, uppdatera indexet
      setCurrentQuoteIndex(currentQuoteIndex - 1); 
    }
    // Spara det nya citatindexet
    AsyncStorage.setItem('lastQuoteIndex', (currentQuoteIndex - 1).toString()); 
  };

  return (
    <View style={styles.container}>
      {currentQuoteIndex >= 0 ? (
        <View style={styles.quoteContainer}>
          {/* Visar citatet med hjälp av QuoteCard-komponenten */}
          <QuoteCard quote={quotes[currentQuoteIndex]} onSave={saveToFavorites} />

          <View style={styles.navigationButtons}>
            {/* Knapp för att visa föregående citat (vänsterpil) */}
            <TouchableOpacity
              onPress={showPreviousQuote}
              style={[styles.navButton, currentQuoteIndex === 0 && styles.disabledButton]} 
              disabled={currentQuoteIndex === 0}
            >
              <Ionicons name="chevron-back" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Knapp för att visa nästa citat (högerpil) */}
            <TouchableOpacity onPress={showNextQuote} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Om inga citat finns att visa, visa ett meddelande
        <Text style={styles.emptyText}>Inga citat att visa.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#f0f0f5',
  },
  quoteContainer: {
    alignItems: 'center', 
  },
  navigationButtons: {
    flexDirection: 'row', 
    marginTop: 20, 
  },
  navButton: {
    marginHorizontal: 20, 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    backgroundColor: '#FF6B6B', 
    borderRadius: 50,  
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc', 
  },
  emptyText: {
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 18, 
    color: '#333',
  },
});

export default HomeScreen;
