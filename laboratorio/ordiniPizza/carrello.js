class carrello{

    constructor()
    {
        this.carrello = []; // creo l'array di ordini
    }


    addPizza(nome)
    {
        let tmp= this.findProdotto(nome);
        // se il prodotto è già esistente incremento la quantità
        if(tmp === -1)
            this.carrello.push(new prodotto(nome));
        else
            this.carrello[tmp].aggiungiProdotto(); // incremento il numero del prodotto    
        // trovo le pizze e setto la quantita
        let margherita = this.findProdotto("margherita");
        let prosciutto = this.findProdotto("prosciutto");
        let patatine = this.findProdotto("patatine");
        let wurstel = this.findProdotto("wurstel");
        let rucola = this.findProdotto("rucola");
        let salamePic = this.findProdotto("salame piccante");
        if(margherita !== -1)
            document.getElementById("numPizza1").innerHTML = this.carrello[margherita].getNumProdotto();
        if(prosciutto !== -1)
            document.getElementById("numPizza2").innerHTML = this.carrello[prosciutto].getNumProdotto();
        if(patatine !== -1)
            document.getElementById("numPizza3").innerHTML = this.carrello[patatine].getNumProdotto();
        if(wurstel !== -1)
            document.getElementById("numPizza4").innerHTML = this.carrello[wurstel].getNumProdotto();
        if(rucola !== -1)
            document.getElementById("numPizza5").innerHTML = this.carrello[rucola].getNumProdotto();
        if(salamePic !== -1)
            document.getElementById("numPizza6").innerHTML = this.carrello[salamePic].getNumProdotto();
    }

    // trovo il prodotto in base al nome
    findProdotto(nome)
    {
        for(let i = 0; i < this.carrello.length; i++)
        {
            if(this.carrello[i].getProdotto() === nome)
                return i;
        }
        return -1; // non è presente il prodotto
    }

}