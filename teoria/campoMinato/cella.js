class cella{
    constructor(isBomba, isRivelata, numBombe)
    {
        this.isBomba = isBomba;
        this.isRivelata = isRivelata;
        this.numBombe = numBombe;
        this.car = " "; // carattere visibile
    }

    setBomba(set)
    {
        this.isBomba = set;
        this.car = "BOOM!";
    }

    setNumBombe(set)
    {
        this.numBombe = set; // MODIFICARE!!!
    }
}