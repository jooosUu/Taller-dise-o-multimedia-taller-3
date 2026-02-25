// Renderiza el Pokémon en la tarjeta
export const showPokemon = (pokemon) => {
    const nameEl = document.getElementById('pokemon-name');
    const idEl = document.getElementById('pokemon-id');
    const imgEl = document.getElementById('pokemon-img');
    const typesContainer = document.getElementById('pokemon-types');

    // Asignar datos básicos
    nameEl.textContent = pokemon.name;
    idEl.textContent = `#${String(pokemon.id).padStart(3, '0')}`;
    imgEl.src = pokemon.sprite;
    imgEl.alt = pokemon.name;

    // Limpiar tipos anteriores y agregarlos dinámicamente
    typesContainer.innerHTML = '';
    pokemon.types.forEach(typeString => {
        const span = document.createElement('span');
        span.classList.add('type', typeString); // Ej: .type.fire
        span.textContent = typeString;
        typesContainer.appendChild(span);
    });

    // Reto: Mostrar modal al dar clic a la imagen
    imgEl.onclick = () => showModal(pokemon);
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
