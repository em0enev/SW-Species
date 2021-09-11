import  EventEmitter  from "eventemitter3";
import Species from "./Species";

export default class StarWarsUniverse extends EventEmitter{
    constructor(maxSpecies){
        super();
        this.species = [];
        this._maxSpecies = maxSpecies;
    }
    
    static get events(){
        return {
            "MAX_SPECIES_REACHED" : "max_species_reached",
            "SPECIES_CREATED": "species_created"
        }
    }

    get speciesCount(){
        return this.species.length
    }

    async createSpecies(){
        let index = 1;
        let isReached = false
        let speciesUrl = "https://swapi.boom.dev/api/species/"

        while(!isReached){
            const specie = new Species();

            specie.on(StarWarsUniverse.events.SPECIES_CREATED, () => this._onSpeciesCreated(specie))

            this.on(StarWarsUniverse.events.SPECIES_CREATED, function(data) {
                if(data.speciesCount === this._maxSpecies){
                    this.emit(StarWarsUniverse.events.MAX_SPECIES_REACHED)
                }
            })
            
            this.on(StarWarsUniverse.events.MAX_SPECIES_REACHED, () => isReached = true)
            
            await specie.init(speciesUrl + index);
            index++;
        }
    }
  
    _onSpeciesCreated(species) {
        this.species.push(species)
        this.emit(StarWarsUniverse.events.SPECIES_CREATED, { speciesCount: this.speciesCount })
    }

}