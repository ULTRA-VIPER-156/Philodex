
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function Profile() 
{
    
 class PokemonNode {
    constructor(
        public pokemonId: number,
        public next: PokemonNode | null = null
    ) {}
}

class PokemonLinkedList {
    private head: PokemonNode | null = null;
    private size = 0;

    add(pokemonId: number): void {
        const node = new PokemonNode(pokemonId);

        if (!this.head) {
            this.head = node;
        } else {
            let current = this.head;

            while (current.next) {
                current = current.next;
            }

            current.next = node;
        }

        this.size++;
    }

    getAll(): number[] {
        const pokemon: number[] = [];
        let current = this.head;

        while (current) {
            pokemon.push(current.pokemonId);
            current = current.next;
        }

        return pokemon;
    }

    count(): number {
        return this.size;
    }
}

class User {
    private name: string;
    private userId: number;
    private rank: string;
    private score: number;
    private capturedPokemon: PokemonLinkedList;

    constructor(username: string, userId: number) {
        this.name = username;
        this.userId = userId;
        this.rank = "Unranked";
        this.score = 0;
        this.capturedPokemon = new PokemonLinkedList();
    }

    get Name(): string {
        return this.name;
    }

    set Name(value: string) {
        this.name = value;
    }

    get UserId(): number {
        return this.userId;
    }

    set UserId(value: number) {
        this.userId = value;
    }

    get Rank(): string {
        return this.rank;
    }

    set Rank(value: string) {
        this.rank = value;
    }

    get Score(): number {
        return this.score;
    }

    set Score(value: number) {
        this.score = value;
    }

    get CapturedPokemonNumber(): number {
        return this.capturedPokemon.count();
    }

    capturePokemon(id: number): void {
        this.capturedPokemon.add(id);
    }

    getCapturedPokemon(): number[] {
        return this.capturedPokemon.getAll();
    }
}

//So first of alll we kinda need to check if the user is logged in or not, if they are not logged in we can just show a login screen, if they are logged in we can show their profile, for now we will just create a user and show their profile

const user = new User("Ash Ketchum", 1);
user.capturePokemon(25);


  return (
    <View>

    <View>
        <Text style={styles.text}>Username: {user.Name}</Text>
        <Text style={styles.text}>User ID: {user.UserId}</Text>
        <Text style={styles.text}>Rank: {user.Rank}</Text>
        <Text style={styles.text}>Score: {user.Score}</Text>
        <Text style={styles.text}>Captured Pokemon Count: {user.CapturedPokemonNumber}</Text>
        <Text style={styles.text}>Captured Pokemon IDs: {user.getCapturedPokemon().join(", ")}</Text>
    </View>
        </View>
        

    
   
  );
}
const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 10,
    },
});
