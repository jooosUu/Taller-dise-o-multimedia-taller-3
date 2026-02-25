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
