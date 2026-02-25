// Clase base para crear los Pokémon
export default class Pokemon {
    constructor({ id, name, types, sprite, height, weight, abilities, stats }) {
        this.id = id;
        this.name = name;
        this.types = types;
        this.sprite = sprite;
        this.height = height;
        this.weight = weight;
        this.abilities = abilities;
        this.stats = stats;
    }
}
