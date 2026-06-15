import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GlassSurface from './GlassSurface';

interface PokemonFav {
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
}


// Mapping Pokemon types to specific background colors for the UI cards
const Color_By_Type: any = {
  normal: "#D3D3C8",
  fire: "#f6bfb2",
  water: "#A6D8FF",
  grass: "#B5E7B5",
  electric: "#FFFACD",
  ice: "#D4F1F9",
  fighting: "#FFCCCC",
  poison: "#E6CCFF",
  ground: "#F0E6D2",
  flying: "#E0E0FF",
  psychic: "#FFD6E0",
  bug: "#D9F2D9",
  rock: "#E8DFD0",
  ghost: "#D8CCEB",
  dark: "#C0C0C0",
  dragon: "#D8CCEB",
  steel: "#E8E8F0",
  fairy: "#FFE6EE"
};

// Default list to show if the user hasn't saved any favorites yet
const DEFAULT_FAVS = ["pikachu", "bulbasaur", "charmander", "squirtle", "eevee"];

export default function Favorites() {
  const [favData, setFavData] = useState<PokemonFav[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from storage as soon as the component mounts
  useEffect(() => {
    loadFavs();
  }, []);

  const loadFavs = async () => {
  try {
    // Pull saved names from device storage
    const stored = await AsyncStorage.getItem('pokemon_favs');
    
    let names = stored ? JSON.parse(stored) : DEFAULT_FAVS;
    
    // Fallback to defaults if the list is empty
    if (names.length === 0) names = DEFAULT_FAVS;

    // Fetch full details 
    const detailed = await Promise.all(
      names.map(async (name: string) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        return await res.json();
      })
    );
    setFavData(detailed);
  } catch (e) {
    console.error("Failed to load favorites:", e);
  } finally {
    setLoading(false);
  }
};

  // Logic to remove a Pokemon from the state 
  const removeItem = async (name: string) => {
    const updated = favData.filter(p => p.name !== name);
    setFavData(updated);
    const namesOnly = updated.map(p => p.name);
    await AsyncStorage.setItem('pokemon_favs', JSON.stringify(namesOnly));
  };

  let content = null;
  if (favData.length === 0 && !loading) {
    content = (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        
         <View style={styles.center}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#333', marginBottom: 20 }}>
                No Favorites Yet
            </Text>
                <LottieView
                  source={require("../assets/noFav.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
                 <Text style={{ fontSize: 18, color: '#666', textAlign: 'center' }}>
                lol unfortuneately you have no favourites yet, go catch some pokemon brotato
                </Text>
                <Text style={{ fontSize: 14, color: '#aaa', marginTop: 10, textAlign: 'center' }}>
                (hint: give your heart to a pokemon in the details page to add it here)
                </Text>
              </View>
      
      </View>
    );
  } else {
    // Main List view
    content = (
      <View style={styles.container}>
        <View>
        <Text style={styles.title}>Favourites</Text>
        <Text
          style={{
            fontSize: 24,
            color: '#666',
            marginBottom: 20,
            paddingHorizontal: 10,
            textAlign: 'center',
          }}
        >
          umm did the pokemon consent to this ? 
          i dont know aint there some rules about keeping private locked up in a ball or something ?
          sure we all come from balls but damm.
      
          
            
        </Text>
         {/**Some black bar here or something */}
            <View
            style={{
                alignItems:'center'
                
            }}
            >
                 <View
            style={{
                marginTop:8,

                width:'20%',
                height:8,
                marginBottom:20,
                borderRadius:22,
                backgroundColor:'#11111160',
            }}
            >
                

            </View>
            </View>
            </View>
        
        
        <FlatList
          data={favData}
          keyExtractor={(item) => item.name}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => {
            const mainType = item.types[0].type.name;
            const themeColor = Color_By_Type[mainType] || "#eee";
            
            return (
              <View style={styles.barWrapper}>
                {/* Left side */}
                <View style={[styles.coloredHalf, { backgroundColor: themeColor }]}>
                  <Link href={{ pathname: "/PokemonDetails", params: { name: item.name } }} asChild>
                    <TouchableOpacity style={styles.infoSection}>
                      <Image 
                        source={{ uri: item.sprites.front_default }} 
                        style={styles.sprite} 
                      />
                      <View style={styles.textData}>
                        <Text style={styles.cardName}>{item.name}</Text>
                        <Text style={styles.typeText}>{mainType.toUpperCase()}</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                </View>

                {/* Right side*/}
                <View style={styles.actionSection}>
                  <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFill} />
                  <TouchableOpacity style={styles.actionBtn} onPress={() => console.log("More options for", item.name)}>
                     <Ionicons name="options-outline" size={24} color="#444" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeItem(item.name)} style={styles.actionBtn}>
                    <Ionicons name="trash-outline" size={24} color="#b55858" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        {content}
      </View>
      
      <View style={styles.floatingGlassContainer}>
        <GlassSurface />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  title: { fontSize: 36, fontWeight: '900', marginVertical: 20, letterSpacing: -1.5, 
    alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#333'
  },
  barWrapper: {
    flexDirection: 'row',
    height: 100,
    borderRadius: 24,
    marginBottom: 14,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  coloredHalf: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  sprite: { width: 85, height: 85, resizeMode: 'contain' },
  textData: { marginLeft: 5 },
  cardName: { fontSize: 20, fontWeight: '800', textTransform: 'capitalize', color: '#333' },
  typeText: { fontSize: 10, fontWeight: '900', color: 'rgba(0,0,0,0.4)', marginTop: 2 },
  actionSection: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  actionBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  floatingGlassContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 999,
  },
    center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent:'center'
  },
   lottie: {
    width: 280,
    height: 280
  },
});