// Funciones Auxiliares de UI

// Generador de partículas de fondo según el tipo elemental
export const generateParticles = (type) => {
    const container = document.getElementById('particles-container');
    if (!container) return;

    container.innerHTML = ''; // Limpiar anteriores

    // Mapeo básico de partículas
    const particleTypesMap = {
        fire: 'particle-fire',
        water: 'particle-water',
        grass: 'particle-grass',
        electric: 'particle-electric',
        poison: 'particle-poison',
    };

    const pClass = particleTypesMap[type] || 'particle-default';
    const numParticles = type === 'fire' || type === 'electric' ? 25 : 15;

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle', pClass);

        // Tamaños, velocidades y posiciones aleatorias para un efecto natural
        const size = Math.random() * 15 + 5 + 'px';
        const left = Math.random() * 100 + 'vw';
        const duration = Math.random() * 3 + 2 + 's';
        const delay = Math.random() * 2 + 's';

        particle.style.width = size;
        particle.style.height = size;
        particle.style.left = left;
        particle.style.animationDuration = duration;
        particle.style.animationDelay = delay;

        container.appendChild(particle);
    }
};

const typeIcons = {
    fire: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>`,
    water: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>`,
    grass: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    electric: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    flying: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3-9L9 3v2l-3 5H2v4h4l3 5v2l6-9h4z"/></svg>`,
    poison: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
    ground: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/></svg>`,
    bug: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18"/><path d="M12 4v16"/></svg>`,
    default: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`
};

// Construye el HTML de una tarjeta TCG
export const createTcgCardHtml = (pokemon, positionClass = 'center') => {
    if (!pokemon) return '';
    const primaryType = pokemon.types.length > 0 ? pokemon.types[0] : 'normal';
    const hpStat = pokemon.stats.find(s => s.name === 'hp');
    const hp = hpStat ? hpStat.base_stat : 60;
    const typeIconHtml = typeIcons[primaryType] || typeIcons.default;

    let attacksHtml = '';
    pokemon.abilities.forEach((ability, index) => {
        let energies = '';
        const costCount = index === 0 ? 1 : 2;
        for (let i = 0; i < costCount; i++) {
            energies += `<div class="tcg-energy" style="color:var(--type-${primaryType})">${typeIconHtml}</div>`;
        }
        if (index > 0) {
            energies += `<div class="tcg-energy" style="color:#777">${typeIcons.default}</div>`;
        }
        attacksHtml += `
            <div class="tcg-attack">
                <div class="tcg-attack-cost">${energies}</div>
                <span class="tcg-attack-name">${ability.replace('-', ' ')}</span>
                <span class="tcg-attack-damage">${(index + 1) * 30}</span>
            </div>
        `;
    });

    const isCenter = positionClass === 'center';

    return `
        <div class="tcg-card carousel-card ${positionClass}" 
            data-id="${pokemon.id}" 
            style="--current-type-color: var(--type-${primaryType});"
            onclick="if(this.classList.contains('center')) window.showPokemonModal(${pokemon.id});">
            <div class="tcg-inner">
                <div class="tcg-card-content">
                    <header class="tcg-header">
                        <span class="tcg-stage">BÁSICO</span>
                        <h1 class="tcg-name">${pokemon.name}</h1>
                        <div class="tcg-hp-container">
                            <span class="tcg-hp-label">PS</span>
                            <span class="tcg-hp-value">${hp}</span>
                            <span class="tcg-type-icon">${typeIconHtml}</span>
                        </div>
                    </header>
                    <figure class="tcg-illustration-frame">
                        <img src="${pokemon.sprite}" alt="${pokemon.name}" loading="lazy">
                    </figure>
                    <div class="tcg-flavor-bar">
                        N.º ${String(pokemon.id).padStart(3, '0')} Altura: ${pokemon.height} m Peso: ${pokemon.weight} kg
                    </div>
                    <div class="tcg-attacks">${attacksHtml}</div>
                    <footer class="tcg-footer">
                        <div class="tcg-stats-row">
                            <div class="tcg-stat-box">
                                <span class="tcg-stat-label">Debilidad</span>
                                <span class="tcg-stat-value">x2</span>
                            </div>
                            <div class="tcg-stat-box">
                                <span class="tcg-stat-label">Resistencia</span>
                                <span class="tcg-stat-value"></span>
                            </div>
                            <div class="tcg-stat-box">
                                <span class="tcg-stat-label">Retirada</span>
                                <span class="tcg-stat-value">**</span>
                            </div>
                        </div>
                        <div class="tcg-bottom-info">
                            <span class="tcg-set-number">${String(pokemon.id).padStart(3, '0')}/159 ◆</span>
                            <span class="tcg-copyright">©2026 Pokémon</span>
                        </div>
                    </footer>
                </div>
            </div>
            <div class="tcg-glare"></div>
        </div>
    `;
};

// Renderiza todas las tarjetas del carrusel y aplica el fondo
export const renderCarousel = (pokemonLeft, pokemonCenter, pokemonRight) => {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    let html = '';
    if (pokemonLeft) html += createTcgCardHtml(pokemonLeft, 'left');
    if (pokemonCenter) html += createTcgCardHtml(pokemonCenter, 'center');
    if (pokemonRight) html += createTcgCardHtml(pokemonRight, 'right');

    track.innerHTML = html;

    // Cambiar color de fondo dinámicamente según el Pokémon central
    if (pokemonCenter && pokemonCenter.types.length > 0) {
        const primaryType = pokemonCenter.types[0];
        const root = document.documentElement;

        // El navegador evaluará esta variable y la aplicará al fondo general si se usa allí
        root.style.setProperty('--current-type-color', `var(--type-${primaryType})`);

        // Poner partículas
        generateParticles(primaryType);
    }

    // Configurar onclick en las laterales para ir a prev/next llamando func globales
    requestAnimationFrame(() => {
        const leftCard = track.querySelector('.carousel-card.left');
        const rightCard = track.querySelector('.carousel-card.right');

        if (leftCard) leftCard.addEventListener('click', () => window.handlePrevClick());
        if (rightCard) rightCard.addEventListener('click', () => window.handleNextClick());
    });
};

// Muestra el modal con la información y estadísticas
export const showModal = (pokemon) => {
    const modalOverlay = document.getElementById('modal-overlay');

    // Llenar datos en el modal
    document.getElementById('modal-name').textContent = pokemon.name;
    document.getElementById('modal-id').textContent = `#${String(pokemon.id).padStart(3, '0')}`;
    document.getElementById('modal-img').src = pokemon.sprite;
    document.getElementById('modal-height').textContent = `${pokemon.height} m`;
    document.getElementById('modal-weight').textContent = `${pokemon.weight} kg`;
    document.getElementById('modal-abilities').textContent = pokemon.abilities.join(', ');

    // Contenedor de estadísticas
    const statsContainer = document.getElementById('modal-stats');
    statsContainer.innerHTML = '';

    // Generar barras iterativamente
    pokemon.stats.forEach(stat => {
        const row = document.createElement('div');
        row.classList.add('stat-row');

        // Base 255 (valor común maximo de estadísticas en Pokémon)
        const widthPercentage = Math.min((stat.base_stat / 255) * 100, 100);

        let colorClass = 'mid';
        if (widthPercentage < 25) colorClass = 'low';
        else if (widthPercentage > 45) colorClass = 'high';

        const statName = stat.name.replace('-', ' ');

        row.innerHTML = `
            <span class="stat-name">${statName}</span>
            <span class="stat-value">${stat.base_stat}</span>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" data-val="${colorClass}" style="width: 0%"></div>
            </div>
        `;
        statsContainer.appendChild(row);

        // Animamos llenado de la barra base_stat
        setTimeout(() => {
            const fillEl = row.querySelector('.stat-bar-fill');
            fillEl.style.width = `${widthPercentage}%`;
        }, 50);
    });

    // Quitar la clase oculta
    modalOverlay.classList.remove('hidden');
};

// Cerrar el modal logic
export const initModalCloseLogic = () => {
    const modalOverlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-modal');

    // Función para añadir la clase oculta
    const closeModal = () => modalOverlay.classList.add('hidden');

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) closeModal();
    });
};
