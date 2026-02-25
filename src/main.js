import { fetchPokemon } from './services/api.js';
import { showPokemon, initModalCloseLogic } from './ui/ui.js';

let currentPokemonId = 25; // Empezar de 25 (Pikachu)

// Botones UI
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

// Cargar Pokémon asíncronamente
const loadPokemon = async (id) => {
    prevBtn.disabled = true;
    nextBtn.disabled = true;

    try {
        const pokemon = await fetchPokemon(id);

        showPokemon(pokemon);
        currentPokemonId = pokemon.id;

        // Regla para botón anterior
        if (currentPokemonId > 1) {
            prevBtn.disabled = false;
        }
        nextBtn.disabled = false;

    } catch (error) {
        alert("¡Pokémon no encontrado! Hay problemas de conexión.");
        prevBtn.disabled = (currentPokemonId <= 1);
        nextBtn.disabled = false;
    }
};

// Iniciar aplicación
const initApp = () => {
    initModalCloseLogic(); // Lógica de cierre del modal

    // Siguiente pokemon
    nextBtn.addEventListener('click', () => {
        loadPokemon(currentPokemonId + 1);
    });

    // Pokémon anterior
    prevBtn.addEventListener('click', () => {
        if (currentPokemonId > 1) {
            loadPokemon(currentPokemonId - 1);
        }
    });

    // Cargar Pokémon predeterminado
    loadPokemon(currentPokemonId);
};

document.addEventListener('DOMContentLoaded', initApp);
