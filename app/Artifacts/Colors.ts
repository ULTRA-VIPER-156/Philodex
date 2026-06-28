import { useColorScheme } from 'react-native';

export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export type ColorScheme = 'light' | 'dark';

export const Colors = {
  background: {
    light: '#FFFFFF',
    dark: '#141415ff',
  },
  text: {
    primary: {
      light: '#000000',
      dark: '#FFFFFF',
    },
    secondary: {
      light: '#0602027b',
      dark: '#b9b9b9',
    },
    button: {
      light: '#FFFFFF',
      dark: '#FFFFFF',
    },
  },
  input: {
    background: {
      light: '#FFFFFF',
      dark: '#333333',
    },
    border: {
      light: '#000000',
      dark: '#FFFFFF',
    },
    placeholder: {
      light: '#666666',
      dark: '#AAAAAA',
    },
    text: {
      light: '#000000',
      dark: '#FFFFFF',
    },
  },
  button: {
    primary: {
      background: '#000000',
      text: '#FFFFFF',
    },
  },
  pokemonType: {
    base: {
      normal: { light: '#e3e396', dark: '#3a3a3a' },
      fire: { light: '#FFB6A5', dark: '#8b3a00' },
      water: { light: '#A6D8FF', dark: '#003d5c' },
      grass: { light: '#B5E7B5', dark: '#2a5a2a' },
      electric: { light: '#FFFACD', dark: '#5a5a00' },
      ice: { light: '#D4F1F9', dark: '#003a5c' },
      fighting: { light: '#FFCCCC', dark: '#5a0000' },
      poison: { light: '#E6CCFF', dark: '#4a0066' },
      ground: { light: '#F0E6D2', dark: '#5a4a2a' },
      flying: { light: '#E0E0FF', dark: '#2a2a5a' },
      psychic: { light: '#FFD6E0', dark: '#5a003a' },
      bug: { light: '#D9F2D9', dark: '#2a5a2a' },
      rock: { light: '#E8DFD0', dark: '#5a4a3a' },
      ghost: { light: '#D8CCEB', dark: '#3a2a5a' },
      dark: { light: '#C0C0C0', dark: '#1a1a1a' },
      dragon: { light: '#D8CCEB', dark: '#3a1a5a' },
      steel: { light: '#E8E8F0', dark: '#3a3a4a' },
      fairy: { light: '#FFE6EE', dark: '#5a2a4a' },
    },
    backgroundOpacity: {
      light: '44', 
      dark: '86', 
    },
    badgeBackground: {
      light: 'rgba(255, 255, 255, 0.45)',
      dark: 'rgba(41, 40, 40, 0.49)',
    },
  },
  card: {
    background: {
      light: '#FFFFFF',
      dark: '#2A2A2A',
    },
    shadow: {
      light: '#000000',
      dark: '#000000',
    },
  },
  glass: {
    background: {
      light: 'rgba(255, 255, 255, 0.7)',
      dark: 'rgba(20, 20, 20, 0.7)',
    },
    border: {
      light: 'rgba(255, 255, 255, 0.2)',
      dark: 'rgba(255, 255, 255, 0.1)',
    },
  },
  navigation: {
    background: {
      light: '#F8F8F8',
      dark: '#1A1A1A',
    },
    tint: {
      light: '#000000',
      dark: '#FFFFFF',
    },
  },
};

export const getThemeColors = (isDark: boolean) => ({
  background: isDark ? Colors.background.dark : Colors.background.light,
  textPrimary: isDark ? Colors.text.primary.dark : Colors.text.primary.light,
  textSecondary: isDark ? Colors.text.secondary.dark : Colors.text.secondary.light,
  textButton: Colors.text.button,
  inputBackground: isDark ? Colors.input.background.dark : Colors.input.background.light,
  inputBorder: isDark ? Colors.input.border.dark : Colors.input.border.light,
  inputPlaceholder: isDark ? Colors.input.placeholder.dark : Colors.input.placeholder.light,
  inputText: isDark ? Colors.input.text.dark : Colors.input.text.light,
  buttonBackground: Colors.button.primary.background,
  buttonText: Colors.button.primary.text,
  cardBackground: isDark ? Colors.card.background.dark : Colors.card.background.light,
  glassBackground: isDark ? Colors.glass.background.dark : Colors.glass.background.light,
  glassBorder: isDark ? Colors.glass.border.dark : Colors.glass.border.light,
  navigationBackground: isDark ? Colors.navigation.background.dark : Colors.navigation.background.light,
  navigationTint: isDark ? Colors.navigation.tint.dark : Colors.navigation.tint.light,
  badgeBackground: isDark ? Colors.pokemonType.badgeBackground.dark : Colors.pokemonType.badgeBackground.light,
  getTypeColor: (type: PokemonTypeName, includeAlpha: boolean = false) => {
    const color = isDark ? Colors.pokemonType.base[type].dark : Colors.pokemonType.base[type].light;
    if (includeAlpha) {
      const alpha = isDark ? Colors.pokemonType.backgroundOpacity.dark : Colors.pokemonType.backgroundOpacity.light;
      return color + alpha;
    }
    return color;
  },
});

export const useThemeColors = () => {
  const colorScheme = useColorScheme() || 'light';
  const isDarkMode = colorScheme === 'dark';

  return {
    isDarkMode,
    colors: getThemeColors(isDarkMode),
  };
};

export const getPokemonTypeColor = (type: string, isDark: boolean, includeAlpha: boolean = false): string => {
  const typedType = type as PokemonTypeName;
  const color = isDark 
    ? Colors.pokemonType.base[typedType]?.dark 
    : Colors.pokemonType.base[typedType]?.light;
  
  if (!color) return isDark ? '#3a3a3a' : '#D3D3C8';
  
  if (includeAlpha) {
    const alpha = isDark 
      ? Colors.pokemonType.backgroundOpacity.dark 
      : Colors.pokemonType.backgroundOpacity.light;
    return color + alpha;
  }
  
  return color;
};

export const Color_By_Type = (isDarkMode: boolean) => {
  const colors: Record<string, string> = {};
  Object.keys(Colors.pokemonType.base).forEach((type) => {
    const typedType = type as PokemonTypeName;
    colors[type] = isDarkMode 
      ? Colors.pokemonType.base[typedType].dark 
      : Colors.pokemonType.base[typedType].light;
  });
  return colors;
};

export default Colors;