import { Link } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View, useWindowDimensions } from "react-native";
import GlassSurface from "./GlassSurface";


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

const firstIncrement = 60;
const INCREMENT = 20;

const Color_By_Type = {
  normal: "#D3D3C8",
  fire: "#FFB6A5",
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

  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [submittedText,setText]=useState('')
  const [LoaderData,setLoader]=useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePokemon, setHasMorePokemon] = useState(true);

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
  

useEffect (() => {

  fetchPokemon();
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
        // Initial load
        setPokemonData(DetailedPokemon);
      } else {
        // Append more data
        setPokemonData(prev => [...prev, ...DetailedPokemon]);
      }

      setOffset(newOffset + INCREMENT);
      setIsLoadingMore(false);
      
      // Check if there are more pokemon to load
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
            style={{ width: 380, height: 380,marginTop:0 }}
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
                      // @ts-ignore
                      backgroundColor:Color_By_Type[item.types[0].type.name]+86,
                      borderRadius:24,
                      height: cardHeight,
                      
                      overflow: "hidden",
                      width: itemWidth,
                  }}
                  onPress={V}
         
       
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
           <Text style={styles.name}>{item.name}</Text>

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
              backgroundColor: 'rgba(175, 127, 127, 0.15)',

            }}
              >
                <Text
                
                style={{
                  margin:1.3,
                  textAlign:"center",
                  fontSize:12
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
    backgroundColor: isDarkMode ? '#000000b8' : '#FFFFFF',
   }}
   
   >

  

    
   <View>

    <Text 
    
    style={{
      fontSize:25,
      fontWeight:800,
       marginLeft:10,
       color: isDarkMode ? '#FFFFFF' : '#000000',

    }}
    >
      Hi Welcome To Philodex
      <TouchableOpacity>
       
      </TouchableOpacity>

    </Text>
   
    <Text
    style={{
      fontSize:15,
      fontWeight:800,
      marginLeft:10,
      color: isDarkMode ? '#FFFFFF' : '#000000',

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
              color: isDarkMode ? '#FFFFFF' : '#000000',
              borderColor: isDarkMode ? '#FFFFFF' : '#000000',
              backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
            }]}
            placeholder="Please enter Pokemon name "
            placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
            maxLength={32} 
            value={submittedText}
            onChangeText={setText}
          >
          </TextInput>
         
            

            
           <View
             style={styles.SubmitButton}


           >
             {submittedText.trim().length > 0 ? (
               <Link
                href={{pathname:"/PokemonDetails",params:{ name : submittedText .toLowerCase()},}}

              >
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
   <FlatList
   data={Types}
   keyExtractor={item=>item}
   horizontal
   
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
      //@ts-ignore
      backgroundColor: Color_By_Type[item]+86,
      justifyContent:"center",
      
    }}
    onPress={filterByType.bind(null,item)}
    >
      <Text
      style={{
        textAlign:"center",
        fontSize:12,
        color: isDarkMode ? '#FFFFFF' : '#000000',
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

<View style={styles.floatingGlassContainer}>
  <GlassSurface/>
</View>

<View>
  {/**Basically will place my nav bar somewhere here  */}
  <View>
    

  </View>
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