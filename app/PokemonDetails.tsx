import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from 'react';
import { Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View, useWindowDimensions } from "react-native";
import { useTheme } from './ThemeContext';

const Color_By_Type_C2 = {
  normal: "#a49a4dff",
  fire: "#FF8C69",
  water: "#6CB4EE",
  grass: "#7BCF7B",
  electric: "#FFE866",
  ice: "#9CE1FF",
  fighting: "#FF6B6B",
  poison: "#C77DFF",
  ground: "#D2B48C",
  flying: "#B2B2FF",
  psychic: "#FF85A1",
  bug: "#90EE90",
  rock: "#B8A38D",
  ghost: "#9370DB",
  dark: "rgba(69, 11, 120, 0.57)",
  dragon: "#836FFF",
  steel: "#B0C4DE",
  fairy: "#FFB7C5"
};

// Interfaces
interface Pokemon {
  name: string;
  id: number;
  base_experience: number;
  height: number;
  weight: number;
  abilities: PokeAbilities[];
  moves: PokeMoves[];
  types: PokemonType[];
  sprites: PokeSprites;
}

interface EvolutionNode {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionNode[];
}

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokeAbilities {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface PokeMoves {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
    };
  }>;
}

// New interfaces for detailed ability and move info
interface AbilityDetails {
  name: string;
  effect_entries: Array<{
    effect: string;
    short_effect: string;
    language: {
      name: string;
    };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
}

interface MoveDetails {
  name: string;
  accuracy: number;
  power: number;
  pp: number;
  type: {
    name: string;
  };
  damage_class: {
    name: string;
  };
  effect_entries: Array<{
    effect: string;
    short_effect: string;
    language: {
      name: string;
    };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
}

interface PokeSprites {
  back_default: string;
  front_default: string;
  other: {
    ["official-artwork"]: {
      front_default: string;
    };
  };
}

// Helper func
const getResponsiveSize = (width: number, sizes: { phone: number; tablet: number; desktop: number }) => {
  if (width >= 1024) return sizes.desktop;
  if (width >= 768) return sizes.tablet;
  return sizes.phone;
};

// Move Details 
const MoveDetailsModal = ({ visible, move, onClose, styles, fontSizes, spacing, colorScheme }: any) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { borderRadius: spacing.cardRadius }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { fontSize: fontSizes.subtitle, fontFamily: 'Inter_700Bold' }]}>
            {move?.name}
          </Text>
          <TouchableOpacity onPress={() => {
            if (Platform.OS === 'android') {
              Vibration.vibrate(8);
            }
            onClose();
          }}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalBody}>
          {move && (
            <>
              <View style={styles.moveStatsGrid}>
                <View style={[styles.moveStatItem, { backgroundColor: colorScheme + '15' }]}>
                  <Text style={[styles.moveStatLabel, { fontSize: fontSizes.body - 2, fontFamily: 'Inter_600SemiBold' }]}>Type</Text>
                  <Text style={[styles.moveStatValue, { fontSize: fontSizes.body, fontFamily: 'Inter_700Bold' }]}>{move.type.name}</Text>
                </View>
                <View style={[styles.moveStatItem, { backgroundColor: colorScheme + '15' }]}>
                  <Text style={[styles.moveStatLabel, { fontSize: fontSizes.body - 2, fontFamily: 'Inter_600SemiBold' }]}>Category</Text>
                  <Text style={[styles.moveStatValue, { fontSize: fontSizes.body, fontFamily: 'Inter_700Bold' }]}>{move.damage_class.name}</Text>
                </View>
                <View style={[styles.moveStatItem, { backgroundColor: colorScheme + '15' }]}>
                  <Text style={[styles.moveStatLabel, { fontSize: fontSizes.body - 2, fontFamily: 'Inter_600SemiBold' }]}>Power</Text>
                  <Text style={[styles.moveStatValue, { fontSize: fontSizes.body, fontFamily: 'Inter_700Bold' }]}>{move.power || '—'}</Text>
                </View>
                <View style={[styles.moveStatItem, { backgroundColor: colorScheme + '15' }]}>
                  <Text style={[styles.moveStatLabel, { fontSize: fontSizes.body - 2, fontFamily: 'Inter_600SemiBold' }]}>Accuracy</Text>
                  <Text style={[styles.moveStatValue, { fontSize: fontSizes.body, fontFamily: 'Inter_700Bold' }]}>{move.accuracy || '—'}</Text>
                </View>
                <View style={[styles.moveStatItem, { backgroundColor: colorScheme + '15' }]}>
                  <Text style={[styles.moveStatLabel, { fontSize: fontSizes.body - 2, fontFamily: 'Inter_600SemiBold' }]}>PP</Text>
                  <Text style={[styles.moveStatValue, { fontSize: fontSizes.body, fontFamily: 'Inter_700Bold' }]}>{move.pp}</Text>
                </View>
              </View>
              
              <Text style={[styles.moveDescription, { fontSize: fontSizes.body, fontFamily: 'Inter_500Medium', lineHeight: 24, marginTop: spacing.margin }]}>
                {getEnglishEffect(move.effect_entries)}
              </Text>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

// Helper function to get English effect text
const getEnglishEffect = (entries: Array<{ effect: string; short_effect: string; language: { name: string } }>) => {
  const englishEntry = entries.find(entry => entry.language.name === 'en');
  return englishEntry?.effect || englishEntry?.short_effect || "No description available";
};

export default function PokemonDetails() {
  const params = useLocalSearchParams<{ name?: string | string[] }>();
  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  const { isDark } = useTheme();
  
  const [pokemonDets, setPokemonDets] = useState<Pokemon | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<{ name: string; sprite: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const Color_By_Type = {
    normal: isDark ? "#3a3a3a" : "#D3D3C8",
    fire: isDark ? "#8b3a00" : "#FFB6A5",
    water: isDark ? "#003d5c" : "#A6D8FF",
    grass: isDark ? "#2a5a2a" : "#B5E7B5",
    electric: isDark ? "#5a5a00" : "#FFFACD",
    ice: isDark ? "#003a5c" : "#D4F1F9",
    fighting: isDark ? "#5a0000" : "#FFCCCC",
    poison: isDark ? "#4a0066" : "#E6CCFF",
    ground: isDark ? "#5a4a2a" : "#F0E6D2",
    flying: isDark ? "#2a2a5a" : "#E0E0FF",
    psychic: isDark ? "#5a003a" : "#FFD6E0",
    bug: isDark ? "#2a5a2a" : "#D9F2D9",
    rock: isDark ? "#5a4a3a" : "#E8DFD0",
    ghost: isDark ? "#3a2a5a" : "#D8CCEB",
    dark: isDark ? "#1a1a1a" : "#C0C0C0",
    dragon: isDark ? "#3a1a5a" : "#D8CCEB",
    steel: isDark ? "#3a3a4a" : "#E8E8F0",
    fairy: isDark ? "#5a2a4a" : "#FFE6EE"
  };

  const [abilitiesDetails, setAbilitiesDetails] = useState<Map<string, AbilityDetails>>(new Map());
  const [movesDetails, setMovesDetails] = useState<Map<string, MoveDetails>>(new Map());
  const [selectedMove, setSelectedMove] = useState<MoveDetails | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  
  //device type
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  

  const fontSizes = {
    title: getResponsiveSize(width, { phone: 28, tablet: 36, desktop: 44 }),
    subtitle: getResponsiveSize(width, { phone: 20, tablet: 24, desktop: 28 }),
    body: getResponsiveSize(width, { phone: 16, tablet: 18, desktop: 20 }),
    stats: getResponsiveSize(width, { phone: 35, tablet: 40, desktop: 48 }),
    header: getResponsiveSize(width, { phone: 33, tablet: 40, desktop: 48 }),
    number: getResponsiveSize(width, { phone: 48, tablet: 60, desktop: 72 }),
  };
  
  const spacing = {
    padding: getResponsiveSize(width, { phone: 12, tablet: 20, desktop: 24 }),
    margin: getResponsiveSize(width, { phone: 8, tablet: 12, desktop: 16 }),
    cardRadius: getResponsiveSize(width, { phone: 12, tablet: 16, desktop: 20 }),
  };
  
  //Imae sizes 
  const imageSizes = {
    main: getResponsiveSize(width, { 
      phone: width > 600 ? 270 : 220, 
      tablet: 350, 
      desktop: 400 
    }),
    evolution: getResponsiveSize(width, { phone: 60, tablet: 80, desktop: 100 }),
  };
  
  //  fetch ability details
  const fetchAbilityDetails = async (abilityUrl: string): Promise<AbilityDetails> => {
    try {
      const response = await fetch(abilityUrl);
      const data = await response.json();
      return {
        name: data.name,
        effect_entries: data.effect_entries,
        flavor_text_entries: data.flavor_text_entries
      };
    } catch (error) {
      console.error("Error fetching ability details:", error);
      return {
        name: "",
        effect_entries: [],
        flavor_text_entries: []
      };
    }
  };
  
  // move details
  const fetchMoveDetails = async (moveUrl: string): Promise<MoveDetails> => {
    try {
      const response = await fetch(moveUrl);
      const data = await response.json();
      return {
        name: data.name,
        accuracy: data.accuracy,
        power: data.power,
        pp: data.pp,
        type: data.type,
        damage_class: data.damage_class,
        effect_entries: data.effect_entries,
        flavor_text_entries: data.flavor_text_entries
      };
    } catch (error) {
      console.error("Error fetching move details:", error);
      return {
        name: "",
        accuracy: 0,
        power: 0,
        pp: 0,
        type: { name: "" },
        damage_class: { name: "" },
        effect_entries: [],
        flavor_text_entries: []
      };
    }
  };
  
  //abilities and moves details
  const fetchAbilitiesAndMovesDetails = async (pokemon: Pokemon) => {
    // Fetch abilities details
    const abilitiesMap = new Map<string, AbilityDetails>();
    const abilityPromises = pokemon.abilities.map(async (ability) => {
      const details = await fetchAbilityDetails(ability.ability.url);
      abilitiesMap.set(ability.ability.name, details);
    });
    
    // Fetch moves details 
    const movesMap = new Map<string, MoveDetails>();
    const movesToFetch = pokemon.moves.slice(0, 20);
    const movePromises = movesToFetch.map(async (move) => {
      const details = await fetchMoveDetails(move.move.url);
      movesMap.set(move.move.name, details);
    });
    
    await Promise.all([...abilityPromises, ...movePromises]);
    setAbilitiesDetails(abilitiesMap);
    setMovesDetails(movesMap);
  };
  
  const fetchEvolutionChain = async (pokemon: Pokemon) => {
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
    const speciesData = await speciesRes.json();
    
    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();
    
    const names: string[] = [];
    
    function traverse(node: EvolutionNode) {
      if (!node?.species?.name) return;
      names.push(node.species.name);
      if (Array.isArray(node.evolves_to) && node.evolves_to.length > 0) {
        node.evolves_to.forEach((child: EvolutionNode) => traverse(child));
      }
    }
    
    traverse(evoData.chain);
    
    const detailed = await Promise.all(
      names.map(async n => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${n}`);
        const data = await res.json();
        return {
          name: n,
          sprite: data.sprites.front_default
        };
      })
    );
    
    setEvolutionChain(detailed);
  };
  
  useEffect(() => {
    if (!name) return;
    fetchDetailsFromName(name);
  }, [name]);

  useEffect(() => {
    if (!pokemonDets) return;
    fetchEvolutionChain(pokemonDets);
    fetchAbilitiesAndMovesDetails(pokemonDets);
    checkIfFavorite(pokemonDets.name);
  }, [pokemonDets]);
  
  async function checkIfFavorite(pokemonName: string) {
    try {
      const stored = await AsyncStorage.getItem('pokemon_favs');
      const favs = stored ? JSON.parse(stored) : [];
      setIsFavorite(favs.includes(pokemonName));
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  }
  
  async function toggleFavorite(pokemonName: string) {
    if (Platform.OS === 'android') {
      Vibration.vibrate(10);
    }
    try {
      const stored = await AsyncStorage.getItem('pokemon_favs');
      let favs = stored ? JSON.parse(stored) : [];
      
      if (favs.includes(pokemonName)) {
        favs = favs.filter((name: string) => name !== pokemonName);
      } else {
        favs.push(pokemonName);
      }
      
      await AsyncStorage.setItem('pokemon_favs', JSON.stringify(favs));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  }
  
  async function fetchDetailsFromName(name: string) {
    try {
      setLoading(true);
      setNotFound(false);
      setPokemonDets(null);
      
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);
      
      if (!response.ok) {
        setNotFound(true);
        return;
      }
      const results = await response.json();
      setPokemonDets(results);
    } catch (error) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }
  
  const handleMovePress = (move: MoveDetails) => {
    setSelectedMove(move);
    setModalVisible(true);
  };
  
  // Loading state
  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: spacing.padding }]}>
        <View style={{ alignItems: 'center' }}>
          <View style={[styles.loaderBar, { width: width * 0.3 }]} />
        </View>
        <View style={styles.center}>
          <LottieView
            source={require("../assets/Searching.json")}
            autoPlay
            loop
            style={[styles.lottie, { width: imageSizes.main, height: imageSizes.main }]}
          />
        </View>
      </View>
    );
  }
  
  // Not found state
  if (notFound) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', paddingTop: spacing.padding }}>
          <View style={[styles.loaderBar, { width: width * 0.3 }]} />
        </View>
        <View style={styles.center}>
          <LottieView
            source={require("../assets/No data Found.json")}
            autoPlay
            loop
            style={[styles.lottie, { width: imageSizes.main, height: imageSizes.main }]}
          />
        </View>
        <Text style={[styles.notFoundText, { fontSize: fontSizes.title, fontFamily: 'Inter_700Bold', paddingHorizontal: spacing.padding }]}>
          Sorry, that Pokemon kinda doesn't exist lol
        </Text>
      </View>
    );
  }
  
  if (!pokemonDets) return null;
  
  const pokemonColor = Color_By_Type[pokemonDets?.types[0]?.type.name as keyof typeof Color_By_Type];
  const pokemonColorDark = Color_By_Type_C2[pokemonDets?.types[0]?.type.name as keyof typeof Color_By_Type_C2];
  
  // Desktop/Large Tablet Layout (split screen)
  if (isDesktop || (isTablet && width >= 900)) {
    return (
      <>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={[
            styles.header,
            { backgroundColor: pokemonColor, paddingHorizontal: spacing.padding * 1.5 }
          ]}>
          </View>
          
          {/* Split Screen Layout */}
          <View style={styles.splitContainer}>
            {/* Left side - Image */}
            <View style={[styles.splitLeft, { backgroundColor: pokemonColor }]}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={fontSizes.title} color="black" />
              </TouchableOpacity>
             <TouchableOpacity onPress={() => router.back()}>
                </TouchableOpacity>
              <Image
                source={{ uri: pokemonDets?.sprites.other["official-artwork"].front_default }}
                style={[styles.mainImage, { width: imageSizes.main, height: imageSizes.main }]}
                resizeMode="contain"
              />
              <Text style={[styles.pokename, { fontFamily: 'Inter_800Black', fontSize: fontSizes.title }]}>
                {pokemonDets?.name}
              </Text>
              <Text style={[styles.pokemonNumber, { fontSize: fontSizes.number, fontFamily: 'Inter_700Bold', marginTop: spacing.margin * 2 }]}>
                #{pokemonDets?.id}
              </Text>
            </View>
            
            {/* Right side - Details */}
            <ScrollView style={[styles.splitRight, { backgroundColor: isDark ? '#141415' : '#f5f5f5' }]} showsVerticalScrollIndicator={false}>
              <View style={[styles.detailsSection, { padding: spacing.padding }]}>
                {/* Stats */}
                <View style={[styles.statsContainer, { backgroundColor: isDark ? '#1a1a1c' : '#ffffff', shadowColor: isDark ? '#000000' : '#00000020' }]}>
                  {[
                    { label: 'Height', value: pokemonDets?.height },
                    { label: 'Weight', value: pokemonDets?.weight },
                    { label: 'Base Exp', value: pokemonDets?.base_experience }
                  ].map(stat => (
                    <View key={stat.label} style={styles.statItem}>
                      <Text style={[styles.statLabel, { fontSize: fontSizes.body, fontFamily: 'Inter_600SemiBold', color: isDark ? '#9090a0' : '#666' }]}>{stat.label}</Text>
                      <Text style={[styles.statValue, { 
                        color: pokemonColorDark,
                        fontSize: fontSizes.stats,
                        fontFamily: 'Inter_800Black'
                      }]}>
                        {stat.value}
                      </Text>
                    </View>
                  ))}
                </View>
                
                {/* Evolution Timeline */}
                <View style={[styles.card, { borderRadius: spacing.cardRadius, marginTop: spacing.margin, backgroundColor: isDark ? '#1a1a1c' : '#ffffff90', shadowColor: isDark ? '#000000' : '#00000020' }]}>
                  <Text style={[styles.sectionTitle, { fontSize: fontSizes.subtitle, fontFamily: 'Inter_700Bold', color: isDark ? '#ffffff' : '#000000' }]}>Evolution Timeline</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.evolutionContainer}>
                      {evolutionChain.map((evo, i) => (
                        <React.Fragment key={evo.name}>
                          <TouchableOpacity
                            style={styles.evolutionItem}
                            onPress={() => {
                              router.push({
                                pathname: "/PokemonDetails",
                                params: { name: evo.name },
                              });
                            }}
                          >
                            <Image
                              source={{ uri: evo.sprite }}
                              style={[styles.evolutionImage, { width: imageSizes.evolution, height: imageSizes.evolution }]}
                            />
                            <Text style={[styles.evolutionName, { fontSize: fontSizes.body, fontFamily: 'Inter_600SemiBold', color: isDark ? '#ffffff' : '#000000' }]}>{evo.name}</Text>
                          </TouchableOpacity>
                          {i < evolutionChain.length - 1 && (
                            <Text style={[styles.evolutionArrow, { fontSize: fontSizes.title, fontFamily: 'Inter_700Bold' }]}>→</Text>
                          )}
                        </React.Fragment>
                      ))}
                    </View>
                  </ScrollView>
                </View>
             
                {/* Abilities with Details */}
                <View style={[styles.card, { borderRadius: spacing.cardRadius, marginTop: spacing.margin, backgroundColor: isDark ? '#1a1a1c' : '#ffffff90', shadowColor: isDark ? '#000000' : '#00000020' }]}>
                  <Text style={[styles.sectionTitle, { fontSize: fontSizes.subtitle, fontFamily: 'Inter_700Bold', color: isDark ? '#ffffff' : '#000000' }]}>Abilities</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.abilitiesScrollContainer}>
                    <View style={styles.abilitiesRowContainer}>
                      {pokemonDets?.abilities.map(ability => {
                        const isSelected = selectedAbility === ability.ability.name;
                        return (
                          <TouchableOpacity 
                            key={ability.ability.name}
                            style={[styles.abilityBadge, { 
                              backgroundColor: isSelected ? pokemonColorDark : pokemonColorDark + '40',
                              paddingVertical: spacing.padding * 0.6,
                              paddingHorizontal: spacing.padding,
                              borderWidth: isSelected ? 2 : 0,
                              borderColor: pokemonColorDark,
                            }]}
                            onPress={() => setSelectedAbility(isSelected ? null : ability.ability.name)}
                          >
                            <Text style={[styles.abilityText, { fontSize: fontSizes.body, fontFamily: 'Inter_700Bold', color: isSelected ? '#fff' : '#111' }]}>
                              {ability.ability.name} {ability.is_hidden && ""}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                  
                  {selectedAbility && (
                    <View style={[styles.abilityDescriptionBlock, { marginTop: spacing.margin, padding: spacing.padding, backgroundColor: pokemonColorDark + '10', borderRadius: spacing.cardRadius }]}>
                      <Text style={[styles.abilityDescriptionTitle, { fontSize: fontSizes.body, fontFamily: 'Inter_700Bold', marginBottom: spacing.margin / 2, color: isDark ? '#ffffff' : '#333' }]}>
                        {selectedAbility}
                      </Text>
                      <Text style={[styles.abilityDescription, { fontSize: fontSizes.body - 2, fontFamily: 'Inter_500Medium', lineHeight: 22, color: isDark ? '#b0b0c0' : '#333' }]}>
                        {getEnglishEffect(abilitiesDetails.get(selectedAbility)?.effect_entries || [])}
                      </Text>
                    </View>
                  )}
                </View>
                
                {/* Moves Block */}
                <View style={[styles.card, { borderRadius: spacing.cardRadius, marginTop: spacing.margin, backgroundColor: isDark ? '#1a1a1c' : '#ffffff90', shadowColor: isDark ? '#000000' : '#00000020' }]}>
                  <Text style={[styles.sectionTitle, { fontSize: fontSizes.subtitle, fontFamily: 'Inter_700Bold', color: isDark ? '#ffffff' : '#000000' }]}>Moves</Text>
                  <View style={styles.movesGrid}>
                    {pokemonDets.moves.slice(0, 6).map(move => {
                      const moveDetail = movesDetails.get(move.move.name);
                      return (
                        <TouchableOpacity 
                          key={move.move.name}
                          style={[styles.moveCard, {
                            backgroundColor: pokemonColorDark + '20'
                          }]}
                          onPress={() => moveDetail && handleMovePress(moveDetail)}
                        >
                          <Text style={[styles.moveName, { fontSize: fontSizes.body, fontFamily: 'Inter_700Bold' }]}>
                            {move.move.name}
                          </Text>
                          {moveDetail && (
                            <Text style={[styles.moveType, { fontSize: fontSizes.body - 3, fontFamily: 'Inter_500Medium', color: '#666' }]}>
                              {moveDetail.type.name} • {moveDetail.damage_class.name}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {pokemonDets.moves.length > 6 && (
                    <Text style={[styles.moreMovesText, { fontSize: fontSizes.body - 2, fontFamily: 'Inter_500Medium', textAlign: 'center', marginTop: spacing.margin }]}>
                      + {pokemonDets.moves.length - 6} more learnable moves
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
        
        {/* Modal for Move Details */}
        <MoveDetailsModal 
          visible={modalVisible}
          move={selectedMove}
          onClose={() => setModalVisible(false)}
          styles={styles}
          fontSizes={fontSizes}
          spacing={spacing}
          colorScheme={pokemonColorDark}
        />
      </>
    );
  }
  
  // Mobile Layout android and stuff
  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: isDark ? '#141415' : '#fafafc' }}>
        {/* Header Navigation */}
        <View style={[styles.mobileHeader, { paddingHorizontal: spacing.padding, paddingTop: spacing.padding }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={fontSizes.subtitle} color="black" />
          </TouchableOpacity>
          <View style={styles.headerSpacer}>
            <View style={[styles.loaderBar, { width: width * 0.1 }]} />
          </View>
          <TouchableOpacity onPress={() => toggleFavorite(pokemonDets.name)}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={fontSizes.subtitle} color={isFavorite ? "#ff3b3b" : "black"} />
          </TouchableOpacity>
        </View>

        {/* Marquee Swatch Card */}
        <View style={[styles.marqueeSwatchContainer, { 
          marginHorizontal: spacing.margin, 
          marginVertical: spacing.margin,
          backgroundColor: isDark ? '#1a1a1c' : '#fafafc',
          borderColor: isDark ? '#333333' : '#e5e1ef'
        }]}>
          {/* Chip Section */}
          <View style={[styles.marqueeChip, { backgroundColor: pokemonColorDark }]}>
            <View style={styles.marqueeStripes} />
            <Image
              source={{ uri: pokemonDets?.sprites.other["official-artwork"].front_default }}
              style={styles.marqueeChipImage}
              resizeMode="contain"
            />
          </View>

          {/* Body Section */}
          <View style={styles.marqueeBody}>
            {/* Head */}
            <View style={styles.marqueeHead}>
              <Text style={[styles.marqueeEyebrow, { color: isDark ? '#9090a0' : '#6b6680' }]}>TYPE · {pokemonDets?.types[0]?.type.name.toUpperCase()}</Text>
              <View style={[styles.marqueeDot, { backgroundColor: pokemonColorDark }]} />
            </View>

            {/* Name */}
            <Text style={[styles.marqueeName, { fontFamily: 'Inter_800Black', color: isDark ? '#ffffff' : '#1a1a2e' }]}>
              {pokemonDets?.name}
            </Text>

            {/* Role/Description */}
            <Text style={[styles.marqueeRole, { color: isDark ? '#b0b0c0' : '#6b6680' }]}>
              #{pokemonDets?.id} • {pokemonDets?.types.map(t => t.type.name).join(', ')}
            </Text>

            {/* Tokens Section */}
            <View style={[styles.marqueeTokens, { borderTopColor: isDark ? '#333333' : '#e5e1ef' }]}>
              <View style={styles.tokenItem}>
                <Text style={[styles.tokenLabel, { color: isDark ? '#9090a0' : '#6b6680' }]}>HEIGHT</Text>
                <Text style={[styles.tokenValue, { color: isDark ? '#ffffff' : '#1a1a2e' }]}>{pokemonDets?.height}</Text>
              </View>
              <View style={styles.tokenItem}>
                <Text style={[styles.tokenLabel, { color: isDark ? '#9090a0' : '#6b6680' }]}>WEIGHT</Text>
                <Text style={[styles.tokenValue, { color: isDark ? '#ffffff' : '#1a1a2e' }]}>{pokemonDets?.weight}</Text>
              </View>
              <View style={styles.tokenItem}>
                <Text style={[styles.tokenLabel, { color: isDark ? '#9090a0' : '#6b6680' }]}>EXP</Text>
                <Text style={[styles.tokenValue, { color: isDark ? '#ffffff' : '#1a1a2e' }]}>{pokemonDets?.base_experience}</Text>
              </View>
            </View>
          </View>
        </View>
          {/* Evolution Timeline */}
          <View style={[styles.card, { borderRadius: spacing.cardRadius, margin: spacing.margin, backgroundColor: isDark ? '#1a1a1c' : '#ffffff90', shadowColor: isDark ? '#000000' : '#00000020' }]}>
            <Text style={[styles.sectionTitle, { fontSize: fontSizes.subtitle, fontFamily: 'Inter_700Bold', color: isDark ? '#ffffff' : '#000000' }]}>Evolution Timeline</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.evolutionContainer}>
                {evolutionChain.map((evo, i) => (
                  <React.Fragment key={evo.name}>
                    <TouchableOpacity
                      style={styles.evolutionItem}
                      onPress={() => {
                        router.push({
                          pathname: "/PokemonDetails",
                          params: { name: evo.name },
                        });
                      }}
                    >
                      <Image
                        source={{ uri: evo.sprite }}
                        style={[styles.evolutionImage, { width: imageSizes.evolution, height: imageSizes.evolution }]}
                      />
                      <Text style={[styles.evolutionName, { fontSize: fontSizes.body, fontFamily: 'Inter_600SemiBold', color: isDark ? '#ffffff' : '#000000' }]}>{evo.name}</Text>
                    </TouchableOpacity>
                    {i < evolutionChain.length - 1 && (
                      <Text style={[styles.evolutionArrow, { fontSize: fontSizes.title, fontFamily: 'Inter_700Bold' }]}>→</Text>
                    )}
                  </React.Fragment>
                ))}
              </View>
            </ScrollView>
          </View>
        
        {/* Bottom Sections */}
        <View style={styles.bottomSections}>

          {/* Abilities with Details */}
          <View style={[styles.card, { 
            borderRadius: spacing.cardRadius, 
            margin: spacing.margin,
            backgroundColor: isDark ? '#1a1a1c' : '#ffffff90'
          }]}>
            <Text style={[styles.sectionTitle, { 
              fontSize: fontSizes.subtitle, 
              fontFamily: 'Inter_700Bold',
              color: isDark ? '#ffffff' : '#000000'
            }]}>Abilities</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.abilitiesScrollContainer}>
              <View style={styles.abilitiesRowContainer}>
                {pokemonDets?.abilities.map(ability => {
                  const isSelected = selectedAbility === ability.ability.name;
                  return (
                    <TouchableOpacity 
                      key={ability.ability.name}
                      onPress={() => {
                        if (Platform.OS === 'android') {
                          Vibration.vibrate(8);
                        }
                        setSelectedAbility(isSelected ? null : ability.ability.name)
                      }}
                      style={[styles.abilityBadge, { 
                        backgroundColor: isSelected ? pokemonColorDark : pokemonColorDark + '40',
                        paddingVertical: spacing.padding * 0.6,
                        paddingHorizontal: spacing.padding,
                        borderWidth: isSelected ? 2 : 0,
                        borderColor: pokemonColorDark,
                      }]}
                    >
                      <Text style={[styles.abilityText, { fontSize: fontSizes.body, fontFamily: 'Inter_700Bold', color: isSelected ? '#fff' : '#111' }]}>
                        {ability.ability.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            
            {selectedAbility && (
              <View style={[styles.abilityDescriptionBlock, { marginTop: spacing.margin, padding: spacing.padding, backgroundColor: pokemonColorDark + '10', borderRadius: spacing.cardRadius }]}>
                <Text style={[styles.abilityDescriptionTitle, { fontSize: fontSizes.body, fontFamily: 'Inter_700Bold', marginBottom: spacing.margin / 2, color: isDark ? '#ffffff' : '#333' }]}>
                  {selectedAbility}
                </Text>
                <Text style={[styles.abilityDescription, { fontSize: fontSizes.body - 2, fontFamily: 'Inter_500Medium', lineHeight: 22, color: isDark ? '#b0b0c0' : '#333' }]}>
                  {getEnglishEffect(abilitiesDetails.get(selectedAbility)?.effect_entries || [])}
                </Text>
              </View>
            )}
          </View>
         
        
          
          {/* Moves Block */}
          <View style={[styles.card, { borderRadius: spacing.cardRadius, margin: spacing.margin, backgroundColor: isDark ? '#1a1a1c' : '#ffffff90', shadowColor: isDark ? '#000000' : '#00000020' }]}>
            <Text style={[styles.sectionTitle, { fontSize: fontSizes.subtitle, fontFamily: 'Inter_700Bold', color: isDark ? '#ffffff' : '#000000' }]}>Moves</Text>
            <View style={styles.movesGrid}>
              {pokemonDets.moves.slice(0, 20).map(move => {
                const moveDetail = movesDetails.get(move.move.name);
                return (
                  <TouchableOpacity
                    key={move.move.name}
                    onPress={() => {
                      if (Platform.OS === 'android') {
                        Vibration.vibrate(8);
                      }
                      moveDetail && handleMovePress(moveDetail)
                    }}
                    style={[styles.moveCard, {
                      backgroundColor: pokemonColorDark + '20',
                      borderColor: isDark ? '#444444' : '#ddd'
                    }]}
                  >
                    <Text style={[styles.moveName, { fontSize: fontSizes.body, fontFamily: 'Inter_700Bold', color: isDark ? '#ffffff' : '#000000' }]}>
                      {move.move.name}
                    </Text>
                    {moveDetail && (
                      <Text style={[styles.moveType, { fontSize: fontSizes.body - 3, fontFamily: 'Inter_500Medium', color: isDark ? '#9090a0' : '#666' }]}>
                        {moveDetail.type.name} • {moveDetail.damage_class.name}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            {pokemonDets.moves.length > 20 && (
              <Text style={[styles.moreMovesText, { fontSize: fontSizes.body - 2, fontFamily: 'Inter_500Medium', textAlign: 'center', marginTop: spacing.margin }]}>
                + {pokemonDets.moves.length - 20} more moves
              </Text>
            )}
          </View>
          
        </View>
      </ScrollView>
      
      {/* Modal for Move Details */}
      <MoveDetailsModal 
        visible={modalVisible}
        move={selectedMove}
        onClose={() => setModalVisible(false)}
        styles={styles}
        fontSizes={fontSizes}
        spacing={spacing}
        colorScheme={pokemonColorDark}
      />
    </>
  );
}

const styles = StyleSheet.create({
  // Common styles
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 280,
    height: 280,
  },
  loaderBar: {
    height: 8,
    borderRadius: 22,
    backgroundColor: '#11111160',
  },
  notFoundText: {
    textAlign: 'center',
    marginTop: 21,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 0,
    left: 0,
    alignSelf: 'flex-start',
  },
  favButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  
  // Split screen styles
  splitContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  splitLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderBottomRightRadius: 24,
    borderTopRightRadius: 24,
  },
  splitRight: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainImage: {
    resizeMode: 'contain',
  },
  pokename: {
    textTransform: 'capitalize',
    textShadowColor: '#00000050',
  },
  pokemonNumber: {
    fontWeight: 'bold',
  },
  
  // Details section
  detailsSection: {
    flex: 1,
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-around',
    width:'100%',
    height:150,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    boxShadow: 'none',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  
  // Card styles
  card: {
    padding: 14,
    backgroundColor: '#ffffff90',
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  
  // Abilities
  abilitiesContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  abilitiesScrollContainer: {
    marginVertical: 8,
  },
  abilitiesRowContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 20,
  },
  abilityCard: {
    marginBottom: 8,
  },
  abilityBadge: {
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  abilityText: {
    color: '#111',
    textTransform: 'capitalize',
  },
  abilityDescription: {
    color: '#333',
    marginTop: 4,
  },
  abilityDescriptionBlock: {
    borderLeftWidth: 4,
    borderLeftColor: '#999',
  },
  abilityDescriptionTitle: {
    textTransform: 'capitalize',
    color: '#333',
  },
  
  // Moves Grid
  movesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moveCard: {
    padding: 12,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  moveName: {
    textTransform: 'capitalize',
    marginBottom: 4,
    color: '#000000',
  },
  moveType: {
    textTransform: 'capitalize',
  },
  moreMovesText: {
    color: '#666',
    fontStyle: 'italic',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    textTransform: 'capitalize',
  },
  modalBody: {
    padding: 20,
  },
  moveStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  moveStatItem: {
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  moveStatLabel: {
    color: '#666',
    marginBottom: 4,
  },
  moveStatValue: {
    textTransform: 'capitalize',
  },
  moveDescription: {
    color: '#333',
  },
  
  // Evolution styles
  evolutionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 12,
  },
  evolutionItem: {
    alignItems: "center",
  },
  evolutionImage: {
    resizeMode: 'contain',
  },
  evolutionName: {
    marginTop: 4,
  },
  evolutionArrow: {
    marginHorizontal: 4,
  },
  
  // Mobile specific styles
  mobileContainer: {
    paddingBottom: 20,
  },
  mobileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSpacer: {
    alignItems: 'center',
    flex: 1,
  },
  mobileTitle: {
    textAlign: "center",
  },
  imageSection: {
    borderRadius: 16,
  },
  imageWrapper: {
    alignItems: "center",
  },
  mobilePokemonNumber: {
    fontWeight: 'bold',
  },
  mobileStats: {
    marginVertical: 12,
  },
  mobileStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  mobileStatLabel: {
    marginBottom: 4,
  },
  mobileStatValue: {
    fontWeight: 'bold',
  },
  
  // Marquee Swatch Card styles
  marqueeSwatchContainer: {
    backgroundColor: '#fafafc',
    borderWidth: 1,
    borderColor: '#e5e1ef',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: 'rgba(71, 39, 181, 0.22)',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 1,
    shadowRadius: 48,
    elevation: 10,
  },
  marqueeChip: {
    height: 160,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  marqueeStripes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  marqueeChipImage: {
    width: 120,
    height: 120,
    zIndex: 1,
  },
  marqueeBody: {
    padding: 20,
  },
  marqueeHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  marqueeEyebrow: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.12,
    textTransform: 'uppercase',
    color: '#6b6680',
  },

  marqueeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: 'rgba(71, 39, 181, 0.12)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  marqueeName: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    color: '#1a1a2e',
  },
  marqueeRole: {
    fontSize: 13,
    lineHeight: 1.5,
    color: '#6b6680',
    marginBottom: 14,
  },
  marqueeTokens: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#e5e1ef',
  },
  tokenItem: {
    flexDirection: 'column',
    gap: 2,
  },
  tokenLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
    letterSpacing: 0.12,
    textTransform: 'uppercase',
    color: '#6b6680',
  },
  tokenValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#1a1a2e',
  },
  bottomSections: {
    paddingBottom: 20,
  },

});