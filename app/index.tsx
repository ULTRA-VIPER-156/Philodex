import { useEffect, useState } from "react";
import { ScrollView, Text, View,Image,StyleSheet,TextInput,FlatList, Touchable, TouchableOpacity,Vibration } from "react-native";
import { Link } from "expo-router";
import { Button } from "@react-navigation/elements";
import LottieView from "lottie-react-native";

import { Platform } from "react-native"


//So typescript needs us to define the type for type safety 
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
//This is what i like to call being a genuis haha 
//OkAY I KNOW IM NERDING OUT BUT BRUHHH
const firstIncrement =250;

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


export default function Index() {

  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [submittedText,setText]=useState('')
  const [LoaderData,setLoader]=useState(true)


  const ONE_SECOND_IN_MS = 10;
  const V=()=>
    {
      if (Platform.OS !== "web") {
     Vibration.vibrate(ONE_SECOND_IN_MS)
   }

    }



useEffect (() => {

  fetchPokemon();
}, []);


  async function fetchPokemon() 
  {

try {

const response =await fetch ("https://pokeapi.co/api/v2/pokemon/?limit="+firstIncrement);
const data = await response.json();



const DetailedPokemon=await Promise.all(
  data.results.map(async (pokemon:any)=>
  {
    const res =await fetch(pokemon.url);
    const details=await res.json();
    return{
      name:pokemon.name,
      image:details.sprites.front_default,
      imageBack:details.sprites.back_default,
      types:details.types
    }
  }


)
)



setPokemonData (DetailedPokemon);
 setLoader(false)

}
catch (error) 
{
  console.error("Error fetching pokemon data:", error);
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
            style={{ width: 280, height: 280,marginTop:'130%' }}
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
              style={{ width: 280, height: 280,marginTop:'130%' }}
            />
          </View>
        )
      }
    else
      {
        content=(


<FlatList
data={pokemonData}
keyExtractor={item=>item.name}
numColumns={2}

contentContainerStyle={{
  padding:10,
  gap:10,
}}
columnWrapperStyle={{
  justifyContent:"space-evenly"
}}

renderItem={({item})=>


 <Link
       
         key={item.name}
         href={{pathname:"/PokemonDetails",params:{ name : item.name },}}
          
         style={{
                      // @ts-ignore
                      backgroundColor:Color_By_Type[item.types[0].type.name]+86,
                      borderRadius:24,
                            height:140,
                            width:170,

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
              width:80,
              height:100,
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

}

>

</FlatList>

      )}







  return (
   <View
   
   style={{
    marginTop:60,
   }}
   
   >

  

    
   <View>

    <Image
    >

    </Image>

    <Text 
    
    style={{
      fontSize:25,
      fontWeight:800,
       marginLeft:10

    }}
    >
      Hi Welcome To Philodex

    </Text>
    <Text
    style={{
      fontSize:15,
      fontWeight:800,
      marginLeft:10

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
            style={styles.input}
            placeholder="Please enter Pokemon name "
            maxLength={32} 
            value={submittedText}
            onChangeText={setText}
          >
          </TextInput>
          <Link
            href={{pathname:"/PokemonDetails",params:{ name : submittedText .toLowerCase()},}}

           style={styles.SubmitButton}
          >
            <Text
            style={{
              textAlign:'center',
              color:"white",
              marginTop:5

            }}
            >
             search
            </Text>

            
           </Link>
           
          </View>

   </View>




<View>
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
    textAlign:"center"
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
        
  },

})
