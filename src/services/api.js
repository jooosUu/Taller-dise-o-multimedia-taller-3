import Pokemon from '../models/Pokemon.js';

// Retorna un Pokémon desde la PokéAPI
export const fetchPokemon = async (id) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

        if (!response.ok) {
            throw new Error(`Pokemon no encontrado.`);
        }

        const data = await response.json();

        // Mapeo de tipos, habilidades y stats
        const types = data.types.map(typeInfo => typeInfo.type.name);
        const abilities = data.abilities.map(abilityInfo => abilityInfo.ability.name);
        const stats = data.stats.map(statInfo => ({
            name: statInfo.stat.name,
            base_stat: statInfo.base_stat
        }));

        // Artwork oficial o sprite normal
        const sprite = data.sprites?.other?.["official-artwork"]?.front_default
            || data.sprites?.front_default;

        // Altura y peso a metros y kilos
        const heightMeters = data.height / 10;
        const weightKg = data.weight / 10;

        // Retornamos instancia de la clase Pokemon
        return new Pokemon({
            id: data.id,
            name: data.name,
            types,
            sprite,
            height: heightMeters,
            weight: weightKg,
            abilities,
            stats
        });

    } catch (error) {
        console.error("Error en fetch:", error);
        throw error;
    }
};

// Retorna una lista de nombres de Pokémon según su tipo
export const fetchPokemonByType = async (type) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);

        if (!response.ok) {
            throw new Error(`Tipo no encontrado.`);
        }

        const data = await response.json();
        // Devuelve un arreglo con los nombres de los pokemon de este tipo
        return data.pokemon.map(p => p.pokemon.name);
    } catch (error) {
        console.error("Error en fetch tipo:", error);
        throw error;
    }
};

// Trae una lista grande de Pokémon para poder hacer búsqueda por coincidencias parciales
export const fetchAllPokemonNames = async () => {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        if (!response.ok) throw new Error("No se pudo obtener la lista.");

        const data = await response.json();
        return data.results.map(p => p.name);
    } catch (error) {
        console.error("Error obteniendo todos los nombres:", error);
        return [];
    }
};
