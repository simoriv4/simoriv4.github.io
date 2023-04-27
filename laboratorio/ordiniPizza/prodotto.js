class prodotto{
    constructor(nome)
    {
        this.prodotto = nome;
        this.numProdotto = 1;
    }

    aggiungiProdotto()
    {
        this.numProdotto++; // incremento il numero dello stesso prodotto
    }

    visualizza()
    {
        return this.prodotto + " " + this.numProdotto;
    }

    getProdotto()
    {
        return this.prodotto;
    }

    getNumProdotto()
    {
        return this.numProdotto;
    }
}