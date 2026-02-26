import { fetchPokemon, fetchPokemonByType, fetchAllPokemonNames } from './services/api.js';
import { renderCarousel, showModal, initModalCloseLogic } from './ui/ui.js';

let currentPokemonId = 25; // Empezar de 25 (Pikachu)
let filteredPokemonList = []; // Si hay filtro activo, guardamos los nombres aquí
let currentFilteredIndex = 0;
let isFiltering = false;
let allPokemonNames = []; // Almacena todos los nombres para busqueda parcial

// Botones y controles UI
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const searchInput = document.getElementById('search-input');
const typeFilter = document.getElementById('type-filter');
const viewAllBtn = document.getElementById('view-all-btn');
const galleryModal = document.getElementById('gallery-modal');
const closeGalleryBtn = document.getElementById('close-gallery-modal');
const galleryGrid = document.getElementById('gallery-grid');

const updateButtonsState = () => {
    if (isFiltering) {
        prevBtn.disabled = currentFilteredIndex <= 0;
        nextBtn.disabled = currentFilteredIndex >= filteredPokemonList.length - 1;
    } else {
        prevBtn.disabled = currentPokemonId <= 1;
        nextBtn.disabled = false;
    }
};

// Cargar Pokémon (Carrusel: Anterior, Actual, Siguiente)
const loadPokemon = async (identifier) => {
    prevBtn.disabled = true;
    nextBtn.disabled = true;

    try {
        const centerPokemon = await fetchPokemon(identifier);
        currentPokemonId = centerPokemon.id;

        // Calcular identifiers vecinos (maneja indices en listas filtradas o IDs secuenciales)
        let leftId = null;
        let rightId = null;

        if (isFiltering) {
            leftId = currentFilteredIndex > 0 ? filteredPokemonList[currentFilteredIndex - 1] : null;
            rightId = currentFilteredIndex < filteredPokemonList.length - 1 ? filteredPokemonList[currentFilteredIndex + 1] : null;
        } else {
            leftId = currentPokemonId > 1 ? currentPokemonId - 1 : null;
            rightId = currentPokemonId + 1;
        }

        // Recuperar en paralelo los lados para agilizar carga (silent errors si fallan)
        const [leftPokemon, rightPokemon] = await Promise.all([
            leftId ? fetchPokemon(leftId).catch(() => null) : Promise.resolve(null),
            rightId ? fetchPokemon(rightId).catch(() => null) : Promise.resolve(null)
        ]);

        renderCarousel(leftPokemon, centerPokemon, rightPokemon);
        updateButtonsState();
    } catch (error) {
        alert("¡Pokémon no encontrado! Revisa el nombre o ID ingresado.");
        updateButtonsState();
    }
};

// Exponer handler de Modal y Navegación hacia window para ser usados en los Onclick del template generado
window.showPokemonModal = async (id) => {
    try {
        const p = await fetchPokemon(id);
        showModal(p);
    } catch (e) { }
};
window.handlePrevClick = () => { if (!prevBtn.disabled) prevBtn.click(); };
window.handleNextClick = () => { if (!nextBtn.disabled) nextBtn.click(); };

// Iniciar aplicación
const initApp = async () => {
    initModalCloseLogic(); // Lógica de cierre del modal

    // Cargar los nombres globalmente al abrir la app para busqueda difusa
    allPokemonNames = await fetchAllPokemonNames();

    // Siguiente pokemon
    nextBtn.addEventListener('click', () => {
        if (isFiltering) {
            if (currentFilteredIndex < filteredPokemonList.length - 1) {
                currentFilteredIndex++;
                loadPokemon(filteredPokemonList[currentFilteredIndex]);
            }
        } else {
            loadPokemon(currentPokemonId + 1);
        }
    });

    // Pokémon anterior
    prevBtn.addEventListener('click', () => {
        if (isFiltering) {
            if (currentFilteredIndex > 0) {
                currentFilteredIndex--;
                loadPokemon(filteredPokemonList[currentFilteredIndex]);
            }
        } else {
            if (currentPokemonId > 1) {
                loadPokemon(currentPokemonId - 1);
            }
        }
    });

    // Búsqueda por entrada textual (Búsqueda parcial / predictiva)
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const term = e.target.value.trim().toLowerCase();

        if (term) {
            // Desactivar filtro de tipo
            typeFilter.value = "";

            searchTimeout = setTimeout(() => {
                // Si el término es un número, buscamos por ID directamente
                if (!isNaN(term)) {
                    isFiltering = false;
                    filteredPokemonList = [];
                    loadPokemon(term);
                    return;
                }

                // Filtrar coincidencias parciales si tenemos la lista global
                if (allPokemonNames.length > 0) {
                    const matches = allPokemonNames.filter(name => name.includes(term));
                    if (matches.length > 0) {
                        filteredPokemonList = matches;
                        isFiltering = true;
                        currentFilteredIndex = 0;
                        loadPokemon(filteredPokemonList[currentFilteredIndex]);
                    } else {
                        // Si no hay coincidencias locales, intentar cargar lo que escribió
                        loadPokemon(term);
                    }
                } else {
                    // Fallback si no cargó la lista global
                    loadPokemon(term);
                }
            }, 500); // 500ms de debounce
        } else {
            isFiltering = false;
            filteredPokemonList = [];
            loadPokemon(currentPokemonId);
        }
    });

    // Filtro por tipo desde el select
    typeFilter.addEventListener('change', async (e) => {
        const type = e.target.value;
        searchInput.value = ""; // Limpiar la búsqueda de texto si aplica filtro

        if (type) {
            try {
                const list = await fetchPokemonByType(type);
                if (list && list.length > 0) {
                    filteredPokemonList = list;
                    isFiltering = true;
                    currentFilteredIndex = 0;
                    loadPokemon(filteredPokemonList[currentFilteredIndex]);
                } else {
                    alert("No se encontraron Pokémon de este tipo.");
                }
            } catch (err) {
                alert("Error al obtener los Pokémon del tipo seleccionado.");
            }
        } else {
            isFiltering = false;
            filteredPokemonList = [];
            loadPokemon(currentPokemonId);
        }
    });

    // Cargar Pokémon predeterminado
    loadPokemon(currentPokemonId);

    // Lógica para la galería
    viewAllBtn.addEventListener('click', () => {
        galleryGrid.innerHTML = '';
        const namesToShow = allPokemonNames.length > 0 ? allPokemonNames.slice(0, 151) : [];

        namesToShow.forEach((name, index) => {
            const id = index + 1;
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="${name}" loading="lazy">
                <span>${name}</span>
                <span style="font-size:0.6rem; color:#aaa">#${String(id).padStart(3, '0')}</span>
            `;
            div.addEventListener('click', () => {
                galleryModal.classList.add('hidden');
                // reset filter
                isFiltering = false;
                filteredPokemonList = [];
                typeFilter.value = "";
                searchInput.value = "";
                loadPokemon(id);
            });
            galleryGrid.appendChild(div);
        });

        galleryModal.classList.remove('hidden');
    });

    closeGalleryBtn.addEventListener('click', () => {
        galleryModal.classList.add('hidden');
    });

    // Cerrar el modal de galería si se hace clic fuera del contenido
    galleryModal.addEventListener('click', (event) => {
        if (event.target === galleryModal) {
            galleryModal.classList.add('hidden');
        }
    });
};



document.addEventListener('DOMContentLoaded', initApp);
