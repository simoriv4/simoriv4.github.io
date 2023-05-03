class cella{
    constructor(isBomba, isAperta, numBombe)
    {
        this.isBomba = isBomba;
        this.isAperta = isAperta;
        this.numBombe = numBombe;
        this.isRivelato = false;
    }

    setBomba(set)
    {
        this.isBomba += set;
    }

    setNumBombe(set)
    {
        this.numBombe = set;
    }
    
    getNumBombe()
    {
        return this.numBombe;
    }

    getBomba()
    {
        // ritorna se è una bomba o meno
        return this.isBomba;
    }

    setRivelata(set)
    {
        this.isRivelato = set;
    }
    getRivelato()
    {
        return this.isRivelato;
    }
}