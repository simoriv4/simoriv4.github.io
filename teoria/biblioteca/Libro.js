class Libro {

    // costruttore parametrico
    constructor(titolo, autore,casaEditrice, annoPubblicazione, IsNoleggiato, dataNoleggio, immagine, nomeLettore ) {
        this.titolo = titolo;
        this.autore = autore;
        this.dataNoleggio = dataNoleggio; // formato data da input--> aaaa/mm/gg
        // this.dataScadenzaNoleggio = "";
        this.dataScadenzaNoleggio = this.generaData(this.dataNoleggio);
        this.IsNoleggiato = IsNoleggiato;
        this.casaEditrice = casaEditrice;
        this.annoDiPubblicazione = annoPubblicazione;
        this.immagine = immagine;
        this.nomeLettore = nomeLettore;
    }

    generaData(dataNoleggio) {
        let data = new Date(dataNoleggio);
        data.setDate(data.getDate() +  30);
        let anno = data.getFullYear();
        let mese = (data.getMonth() + 1).toString().padStart(2, '0');
        let giorno = data.getDate().toString().padStart(2, '0'); 
        return `${anno}/${mese}/${giorno}`;
      
        return data;
    }
    posticipaConsegna() {
        // posticipa di un mese la consegna
        //        this.dataNoleggio
    }

    visualizza()
    {
        return `${this.titolo};${this.autore};${this.casaEditrice};${this.annoDiPubblicazione};${this.IsNoleggiato};${this.dataNoleggio};${this.dataScadenzaNoleggio};${this.immagine}`;    }


}