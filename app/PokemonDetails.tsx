import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View,Image,StyleSheet,Animated } from "react-native";
import { Link } from "expo-router";
import Svg, { Circle, Rect } from 'react-native-svg';

import LottieView from "lottie-react-native";


//I will use this for the background 
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

//Complimentary colors for design and stuff
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
  dark: "#0d0325ff",
  dragon: "#836FFF",
  steel: "#B0C4DE",
  fairy: "#FFB7C5"
};


//this will be an iterface for the pokemon detailed stuff
interface Pokemon 
{
  name: string;
  id:number;
  base_experience:number;
  height:number;
  weight:number;
  abilities:PokeAbilities[];
  //This hsould send me back an array or the defdrent types
  types:PokemonType[];
  sprites:PokeSprites;

}
interface EvolutionNode {
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionNode[]
}


interface PokemonType
{

  
  slot: number
  type: {
    name: string
    url: string
  }
}
    
  

interface PokeAbilities
{
    ability:
    {
        name:string;
        url:string;
    }
}
interface PokeSprites
{

    //finna only use only 2 sprites cos well some pokemon have shiny some dont so yeah 
    back_default:string;
    front_default:string;
    

    
}
interface Evolutions 
{

    evolution_details:
    {
     base_form_id:number;
     gender:string;
     held_item:string;
     known_move:string;
     known_move_type:string;
     location:string;
     min_affection:null;
     min_beauty:string;
     min_happiness:string;
     min_level:10,
     
    }


}


   
//On this page i wanna look at the pokemons stuff like evolutions and stuff 

export default function PokemonDetails() {
    //finna use a hook here RRRRRR MIHARTIES
    const params = useLocalSearchParams<{ name?: string | string[] }>()
    const name = Array.isArray(params.name) ? params.name[0] : params.name
    
    const [pokemonDets, setPokemonDets] = useState<Pokemon|null>(null);
    const [evolutionChain, setEvolutionChain] = useState<{ name: string; sprite: string }[]>([])
    const [loading, setLoading] = useState(true);
     const [notFound, setNotFound] = useState(false);





///Proper loading structure
let content


 if (loading) {
     content= (
      <View>
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
                borderRadius:22,
                backgroundColor:'#11111160',
            }}
            >
                

            </View>

            </View>

      <View style={styles.center}>
        <LottieView
          source={require("../assets/Searching.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
      </View>

    );
  }
  
    else if (notFound) {
      content= (
        <View>
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
                borderRadius:22,
                backgroundColor:'#11111160',
            }}
            >
                

            </View>

            </View>

        <View style={styles.center}>
          <LottieView
            source={require("../assets/No data Found.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
            <Text
            
            style={{
                textAlign:'center',
                fontSize:34,
                marginTop:21,
                fontWeight:'900'
            }}>
                sorry That Pokemon kinda doesnt exist lol
            </Text>
         </View>

      );
    }
    else
        {



              content= (
                <View>
                <View
        style={{
                  //@ts-ignore

                  backgroundColor:Color_By_Type[ pokemonDets?.types[0]?.type.name],

          }}
        >
            
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
                borderRadius:22,
                backgroundColor:'#11111160',
            }}
            >
                

            </View>

            </View>
            <Text
            
            style={{
                fontSize:33,
                marginTop:7,
                fontWeight:"bold",
                textAlign:"center"
            }}
            >
                {pokemonDets?.name}
            </Text>
            {/*Image view thingy */}
            <View
                        style={{
                        borderRadius: 16,
                      padding: 9,
                            // @ts-ignore
                            //Imma abuse this ts command 
                            //Ts is bullshit 
                 backgroundColor:Color_By_Type[ pokemonDets?.types[0]?.type.name],
                
                        }}

            >
                <View
                
                style={{
               alignItems:"center"

                }}
                >

                <Image
                
                source={{
                    uri:pokemonDets?.sprites.front_default
                }}
                 style={{
              width:250,
              height:250,
            }}
                >
               
                
                </Image>
            </View>

                <Text
                style={{
                    textAlign:"left",
                    fontSize:48,
                    fontWeight:'900',
                    color:"black"+67,
                    fontFamily:"sans"

                }}
                >
                    
                    #{pokemonDets?.id}

                </Text>
                {/**First the basics  */}
            <View
            style={{
                flexDirection:'row',
                justifyContent:'space-around'
            }}
            >
                        <Text>
                            height:
                            <Text
                            style={{
                                //@ts-ignore
                                color:Color_By_Type_C2[pokemonDets?.types[0]?.type.name],
                                fontSize:35,
                                fontWeight:'bold',
                            }}
                           >{pokemonDets?.height}


                            </Text>
                        </Text>
                        <Text>
                            Base Exp:
                             <Text
                            style={{
                                //@ts-ignore
                                color:Color_By_Type_C2[pokemonDets?.types[0]?.type.name],
                                fontSize:35,
                                fontWeight:'bold',
                            }}
                            >
                              {pokemonDets?.base_experience}


                            </Text>
                        </Text>
                             <Text>
                            weight:
                             <Text
                            style={{
                                //@ts-ignore
                                color:Color_By_Type_C2[pokemonDets?.types[0]?.type.name],
                                fontSize:35,
                                fontWeight:'bold',
                            }}
                            >
                              {pokemonDets?.weight}


                            </Text>
                            </Text>
                           
                

            </View>

            </View>

            <View>
               
            </View>

        </View>
        {/**here i can try adding out some things
         * about the pokemon more infor and stuff
         * I would Like to have some kind of gauge of stats and a varience section
         */}
         <ScrollView
         >
           
            
                 <View style={styles.card}>
                 <Text style={styles.sectionTitle}>
                      Abilites


                    </Text>

      <View
      
      style={{
        justifyContent:'space-around',
      }}
      >

        {
            pokemonDets?.abilities.map(m=>
                <View
                  key={m.ability.name}
                  
                  style={{
                    left:5,
                    height:27,
                    //@ts-ignore
                     backgroundColor:Color_By_Type_C2[pokemonDets?.types[0]?.type.name],
                     borderRadius:16,
                     margin:4,
                     width:'50%',
                     


                  }}
                  >
                    <Text
                    style={{
                        textAlign:'center'
                    }}>

                        {m.ability.name}
                    </Text>

                </View>
            )

            
         }
               </View>


         </View>





            
      
            
           

         </ScrollView>
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Evolution Timeline</Text>

            <View style=
            {{
                 flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, 
                 marginBottom:90
                 }}>
                {evolutionChain.map((evo, i) => (
                <View key={evo.name} style={{ alignItems: "center" }}>
                    <Image
                    source={{ uri: evo.sprite }}
                    style={{ width: 80, height: 80 }}
                    />
                    <Text style=
                    {{ fontWeight: "bold" }}>
                        {evo.name}</Text>
                        
                    {i < evolutionChain.length - 1 }
                </View>
                ))}
            </View>
            </View>
            </View>

              )
        }






   
//So this function will fetch the evo chain 
async function fetchEvolutionChain(pokemon: Pokemon)
 {
  const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
  const speciesData = await speciesRes.json()
 

  const evoRes = await fetch(speciesData.evolution_chain.url)
  const evoData = await evoRes.json()

  const names: string[] = []
  function traverse(node: any) {
    names.push(node.species.name)
    if (node.evolves_to.length > 0) traverse(node.evolves_to[0])
  }
 


  traverse(evoData.chain)
   const detailed = await Promise.all(
    names.map(async n => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${n}`)
      const data = await res.json()
      return {
        name: n,
        sprite: data.sprites.front_default
      }
    })
  )

  setEvolutionChain(detailed)
}


    



    //So the idea here is that we are going to have a callback for the name 
   useEffect(() => {
  if (!name) return
  fetchDetailsFromName(name)
}, [name])

useEffect(() => {
  if (!pokemonDets) return
  fetchEvolutionChain(pokemonDets)
}, [pokemonDets])






    //Okay now that we have the name time to do some work 

    async function fetchDetailsFromName(name:string)
    {



        try {
            //initally loading and well since we havent looke dwe cant say our pokemon was not found
               setLoading(true)
                setNotFound(false)
                setPokemonDets(null)

                const response=await fetch("https://pokeapi.co/api/v2/pokemon/"+name)
               
                if(!response.ok)
                    {
                        setNotFound(true)
                        return
                    }
              const results=await response.json()

                setPokemonDets(results)
        
               
            }
            //The idea is that if an errro occurs then its due tof the pokemon not being found 
             catch
                {
                    //So not found kinda will be tru 
                    setNotFound(true)

                }
                //Finnally is basically like yeah eafter everything else do this 
                finally
                {
                 setLoading(false)


                }
        
        }
            
        
        
    
  
  return (
    


    <View>
        {content}
    
   
        
    <Text
    style={{
        margin:20,
        bottom:0
    }}
    >
    </Text>

      </View>

  );
}

const styles=StyleSheet.create(
{
    
    card: {
    margin: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#ffffff90"
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8
  },
   center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent:'center'
  },
   lottie: {
    top:400,
    width: 280,
    height: 280
  },
})
