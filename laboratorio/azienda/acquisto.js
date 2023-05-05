class acquisto{
    constructor(azienda, prodotto, giorno, mese, anno, numProdotti, prezzo, tempoConsegna)
    {
        if((azienda === "" && prodotto === "") || (azienda.includes("1") || azienda.includes("2")|| azienda.includes("2")|| azienda.includes("3")|| azienda.includes("4")|| azienda.includes("5")|| azienda.includes("6")|| azienda.includes("7")|| azienda.includes("8")|| azienda.includes("9")))
        {
            alert("nome azienda e/o nome prodotto mancante/i o errati. Inserire i campi e riprovare.");
            return;
        }
        if(giorno > 31)
        {
            alert("Giorno errato. Reinserire il campo e riprovare.");
            return;
        }
        if(mese === "null")
        {
            alert("Mese errato. Reinserire il campo e riprovare.");
            return;
        }
        if(anno< 2000 || anno > 2017)
        {
            alert("Anno errato. Reinserire il campo e riprovare.");
            return;
        }
        if(numProdott<1 || numProdotti > 99)
        {
            alert("Numero prodotti errato. Reinserire il campo e riprovare.");
            return;
        }
        if(prezzo<1 || prezzo > 999)
        {
            alert("Prezzo errato. Reinserire il campo e riprovare.");
            return;
        }
        this.nomeAzienda = azienda;
        this.prodotto = prodotto;
        this.giorno = giorno;
        this.mese = mese;
        this.anno = anno;
        this.numProdotti = numProdotti;
        this.prezzo = prezzo;
        this.tempoConsegna = tempoConsegna;
        this.codiceAcquisto();
    }

    codiceAcquisto()
    {
        return this.nomeAzienda[0] + this.nomeAzienda[1]+this.nomeAzienda[2]+this.nomeAzienda[3]+this.prodotto[0]+this.prodotto[1]+this.prodotto[2]+this.giorno+this.mese+(this.anno.split("/")[2])+this.prezzo;
    }
}