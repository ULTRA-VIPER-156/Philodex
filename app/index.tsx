import { Audio } from 'expo-av';
import { Link } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View, useWindowDimensions } from "react-native";
import { getPokemonTypeColor, getThemeColors } from './Artifacts/Colors';
import { useTheme } from "./ThemeContext";


interface Pokemon 
{
  name: string;
  image:string;
  imageBack:string;
  types:PokemonType[];
}


interface PokemonType
{
  slot:number;
  type:
  {
    name:string
    url:string
  }
}

const firstIncrement = 220;
const INCREMENT = 300;

const Types=[
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dark",
  "dragon",
  "steel",
  "fairy"
]

export default function Index() {
  const { isDark } = useTheme();
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [submittedText, setText] = useState('')
  const [LoaderData, setLoader] = useState(true)
  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePokemon, setHasMorePokemon] = useState(true);
  const [keystrokeSound, setKeystrokeSound] = useState<Audio.Sound | null>(null);
  const [backspaceSound, setBackspaceSound] = useState<Audio.Sound | null>(null);

  const themeColors = getThemeColors(isDark);
  const { width: screenWidth } = useWindowDimensions();
  const itemMinWidth = 160;
  const containerPadding = 20;
  const gap = 10;
  //dawg i saw this online not reallwy sure what does what but it seems to work so im not gonna question it
  const Rendered_columsn = Math.max(1, Math.floor((screenWidth - containerPadding) / (itemMinWidth + gap)));
  const itemWidth = Math.max(120, (screenWidth - containerPadding - (Rendered_columsn - 1) * gap) / Rendered_columsn);
  const cardHeight = itemWidth * 0.8;


  const ONE_SECOND_IN_MS = 10;
  const V=()=>
    {
      if (Platform.OS === "android") {
        Vibration.vibrate(ONE_SECOND_IN_MS)
      }
    }


    async function filterByType(type:string)
    {
      if (Platform.OS === 'android') {
        Vibration.vibrate(8);
      }
      setLoader(true);
      setOffset(0);
      setHasMorePokemon(true);
      
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const data = await response.json();

        const DetailedPokemon = await Promise.all(
          data.pokemon.map(async (poke:any) => {
            const res = await fetch(poke.pokemon.url);
            const details = await res.json();
            return {
              name: poke.pokemon.name,
              image: details.sprites.front_default,
              imageBack: details.sprites.back_default,
              types: details.types
            };
          })
        );

        setPokemonData(DetailedPokemon);
        setOffset(DetailedPokemon.length);
        setHasMorePokemon(false);
        setLoader(false);

       
    }
    catch (error) {
      console.error("Error fetching pokemon data:", error);
      setLoader(false);
    }
  }
  

useEffect(() => {
  const loadSound = async () => {
    try {
      const { sound: keystroke } = await Audio.Sound.createAsync(
        require('../assets/Artifacts/Sounds/keystroke.mp3')
      );
      setKeystrokeSound(keystroke);

      const { sound: backspace } = await Audio.Sound.createAsync(
        require('../assets/Artifacts/Sounds/backspace.mp3')
      );
      setBackspaceSound(backspace);
    } catch (error) {
      console.log('Error loading sounds:', error);
    }
  };

  loadSound();
  fetchPokemon();

  return () => {
    if (keystrokeSound) {
      keystrokeSound.unloadAsync();
    }
    if (backspaceSound) {
      backspaceSound.unloadAsync();
    }
  };
}, []);


  async function fetchPokemon(newOffset: number = 0) 
  {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${INCREMENT}&offset=${newOffset}`);
      const data = await response.json();

      const DetailedPokemon = await Promise.all(
        data.results.map(async (pokemon:any)=>{
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return{
            name:pokemon.name,
            image:details.sprites.front_default,
            imageBack:details.sprites.back_default,
            types:details.types
          }
        })
      );

      if (newOffset === 0) {
        setPokemonData(DetailedPokemon);
      } else {
        setPokemonData(prev => [...prev, ...DetailedPokemon]);
      }
      //So this kinda means check if there is still more stuff to fetch from the spi
      setOffset(newOffset + INCREMENT);
      setIsLoadingMore(false);
      
      if (data.next) {
        setHasMorePokemon(true);
      } else {
        setHasMorePokemon(false);
      }

      if (newOffset === 0) {
        setLoader(false);
      }

    } catch (error) {
      console.error("Error fetching pokemon data:", error);
      setIsLoadingMore(false);
      if (newOffset === 0) {
        setLoader(false);
      }
    }
  }

  //Wanna build a text flipper thingy 
const TextFlipper = ({
  textSequence,
  interval = 500, // Default interval of 0.5 seconds
}:
 {
  textSequence: string[];
  interval?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (textSequence.length === 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % textSequence.length);
    }, interval);

    return () => clearInterval(timer);
  }, [textSequence, interval]);

  return (
    <Text style={{ color: themeColors.textPrimary }}>
      {textSequence[currentIndex]}
    </Text>
  );
};


  const notFound = !LoaderData && pokemonData.length === 0

  let content

  if(LoaderData)
    {
      content = (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <LottieView
            source={require("../assets/Spinner.json")}
            autoPlay
            loop
            style={{ width: 280, height: 280,marginTop:0 }}
          />
                  <TextFlipper
          textSequence={[
            "Looking for Pokeballs....",
            "beating up team rocket...",
            "Collectring a few badges....",
            "Catching some pokemon....",
            "still busy ....",
            "Some stuff is happening...",
            "Almost there..",
            "Just a few more seconds.....",
            "Loading the pokemon data....",
            "Getting the pokemon details....",
            "Fetching the sprites....",
            "Almost done...",
            "Just a few more seconds.....",
          ]}
          interval={500}
        />
        </View>
       
      )
    }
    else if(notFound)
      {
        content = (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <LottieView
              source={require("../assets/Spinner.json")}
              autoPlay
              loop
              style={{ width: 280, height: 280,marginTop:'0%' }}
            />
           
          </View>
        )
      }
    else
      {
        content=(
          <View style={{ flex: 1 }}>

<FlatList
style={{ flex: 1 }}
data={pokemonData}
keyExtractor={item=>item.name}
showsVerticalScrollIndicator={false}
numColumns={Rendered_columsn}

contentContainerStyle={{
  padding:10,
  gap:10,
  flexGrow: 1
}}
columnWrapperStyle={{
  justifyContent:"space-evenly"
}}
ListFooterComponent={<View style={{ height: 100 }} />}
onEndReached={() => {
  if (hasMorePokemon && !isLoadingMore) {
    setIsLoadingMore(true);
    fetchPokemon(offset);
  }
}}
onEndReachedThreshold={0.5}
renderItem={({item})=>
  //Basically render if there is data specifically image cos the api is weird and sometimes gives null for the image so yeah

{
  if (item.image==null) 
    {
    return null;
}

return (
 <Link
       
         key={item.name}
         href={{pathname:"/PokemonDetails",params:{ name : item.name },}}
          
         style={{
                      backgroundColor: getPokemonTypeColor(item.types[0].type.name, isDark, true),
                      borderRadius:24,
                      height: cardHeight,
                      
                      overflow: "hidden",
                      width: itemWidth,
                  }}
                  onPress={() => {
                    V();
                    if (Platform.OS === 'android') {
                      Vibration.vibrate(10);
                    }
                  }}
         
       
       >
         

          <View
             style={{
              flexDirection:"row",
              
              
            }}
          >

            <View
              style={{
              flexDirection:"column",
              marginTop:10,
              marginLeft:12,
              

              
              
            }}>
           <Text 
           style={{
              fontSize:18,
              fontWeight:"bold",
                overflow: "hidden",
                color: themeColors.textPrimary,
              textAlign:"center",
              marginBottom:4,
              width: itemWidth * 0.9,
              maxHeight: 40,
            }}
           >{item.name}</Text>

           <View
             style={{
              flexDirection:"row",
              
              
            }}>


              <Image 
            source ={{
              uri:item.image
              
            }}
            style={{
              width: itemWidth * 0.48,
              height: itemWidth * 0.55,
            }}
            />

            <View>


          {
            
            item.types.map(t => (
              
              <View
              key={t.slot}
              
              style={{
              borderRadius:20,
              width:47,
              height:20,
              margin:1.2,
              backgroundColor: themeColors.badgeBackground,
              

            }}
              >
                <Text
                
                style={{
                  margin:1.3,
                  textAlign:"center",
                  fontSize:12,
                 color: themeColors.textPrimary,

                }}
                >
                  {t.type.name}
                </Text>
                </View>
            ))

          }

          </View>

          </View>
         
              
            </View>
       
           </View>
 </Link>

)
}

}
>

</FlatList>

        </View>

      
)}


  return (
   <View
   
   style={{
    marginTop:0,
    paddingTop:30,
    flex:1,
    backgroundColor: themeColors.background,
   }}
   
   >

  

    
   <View>
    <Text 
    
    style={{
      fontSize:20,
      fontWeight:'bold',
      marginLeft:24,
      paddingTop:20,
      color: themeColors.textPrimary,

    }}
    >
      Hi,Welcome Trainer to Philodex
      

    </Text>
   
    <Text
    style={{
      fontSize:15,
      fontWeight:800,
      marginLeft:24,
      color: themeColors.textSecondary,

    }}>
      use the not so advanced search bar to look for a pokemon 
    </Text>
       


       <View
       style={{
            flexDirection: 'row', 
            alignItems:'center',
            justifyContent: 'space-around', 

       }}
       >

        <TextInput
            style={[styles.input, { 
              color: themeColors.inputText,
              borderColor: themeColors.inputBorder,
              backgroundColor: themeColors.inputBackground,
            }]}
            placeholder="Please enter Pokemon name "
            placeholderTextColor={themeColors.inputPlaceholder}
            maxLength={32} 
            value={submittedText}
            onChangeText={(text) => {
              //This is gonna be so annoying lol

              setText(text);
              if (text.length > submittedText.length) {
                if (keystrokeSound) {
                  //Forward keypress 
                  keystrokeSound.replayAsync();
                }
              } else if (text.length < submittedText.length) {
                if (backspaceSound) {
                  //Bcckawards duhhhh

                  backspaceSound.replayAsync();
                }
              }
            }}
          >
          </TextInput>
         
            

            
           <View
             style={styles.SubmitButton}


           >
             {submittedText.trim().length > 0 ? (
               <Link
                href={{pathname:"/PokemonDetails",params:{ name : submittedText .toLowerCase()},}}
                asChild
              >
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                  if (Platform.OS === 'android') {
                    Vibration.vibrate(8);
                  }
                }}>
                  <Text
                    style={{
                      textAlign:'center',
                      color:"white",
                      alignContent:"center",
                      fontSize:15,
                      fontWeight:800,
                    }}
                  >
                    search
                  </Text>
                </TouchableOpacity>
               </Link>
             ) : (
               <Text
               style={{
                 textAlign:'center',
                 color:"white",
                 marginTop:5,
                 alignContent:"center",
                 fontSize:15,
                 fontWeight:800,

               }}
               >
                search
               </Text>
             )}

           </View>
           
          </View>

   </View>
   {/**This would be a speacific type section  */}
   <View
   testID="TypeSection"
   
   style={{
    width:'95%',
    marginLeft:10,
   
    borderRadius:20,
   }}>
     <Text
     
   style={{
      fontSize:18,
      fontWeight:800,
      marginBottom:10,
      marginTop:20,
      marginLeft:10,
      color: themeColors.textPrimary,

     }}
     

     >
      The Pokemon List 

    </Text>
   {/**This is basically the type filter section  */}
   <FlatList
   data={Types}
   keyExtractor={item=>item}
   horizontal
   showsHorizontalScrollIndicator={false}
   
   contentContainerStyle={{
    padding:10,
    gap:10,
    height:60,
    borderRadius:70,
    top:0,
   }}
   renderItem={({item})=>(
    <TouchableOpacity
    style={{
      borderRadius:20,
      width:80,
      height:30,
      backgroundColor: getPokemonTypeColor(item, isDark, true),
      justifyContent:"center",
      
    }}
    onPress={() => {
      filterByType(item);
    }}
    >
      <Text
      style={{
        textAlign:"center",
        fontSize:12,
        color: themeColors.textPrimary,
      }}
      >
        {item}
      </Text>
    </TouchableOpacity>
   )}

    >
      </FlatList>
      

    
    <View>
      {
        Types.map(t=>(
          
          <View
          key={t}
          >
           
          </View>
        ))
      }
    </View>



   </View>




<View style={{flex:1}}>
  {content}
</View>

</View>

  );
}


const styles=StyleSheet.create({


  name:
  {
    fontSize:18,
    fontWeight:"bold",
      overflow: "hidden",

    textAlign:"center",
    

     

  },
    type:
  {
    fontSize:12,
    fontWeight:"bold",
    color:"grey",
    textAlign:"center"


  },
   input: {
    height: 40,
    width:'69%',
    marginTop: 12,
    marginLeft:12,
    marginBottom:12,

    borderWidth: 1,
    borderRadius:20,
    padding: 10,
  },
  SubmitButton:{
    width:'25%',
    height:38,
    backgroundColor:'black',
    color:'white',
    borderRadius:20,
    textAlign:'center',
    alignContent:"center",
    alignItems:"center",
        
  },
    floatingGlassContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 999,
    elevation: 999, 
    shadowColor: "#e9e4e4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,}

})