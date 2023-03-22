class CCalcolatrice{
    constructor ()
    {
        this.parziale = '0'; // si aggiorna ad ogni operazione e corrisponde al risultato finale
        this.numeroCorrente = '0'; // numero che si aggioorna ogni volta che si schiaccia un tasto
    }

    Somma() {
        let tmp = parseFloat(this.parziale); // converto in intero per fare la somma
        let tmp2 = parseFloat(this.numeroCorrente) // converto in intero per fare la somma
        tmp+=tmp2; // sommo il parziale con il numero passato
        this.parziale = tmp.toString(); // riconverto in stringa
        // ogni volta che eseguo un operazione  il numeroCorrente si azzera
        this.numeroCorrente ='0';
        return true;
    }

    Differenza() {
        this.parziale-=this.numeroCorrente; // sottraggo il parziale con il numero passato
        // ogni volta che eseguo un operazione  il numeroCorrente si azzera
        this.numeroCorrente ='0';
        return true;
    }

    Prodotto() {
        this.parziale*=this.numeroCorrente; // moltiplico il parziale con il numero passato
        // ogni volta che eseguo un operazione  il numeroCorrente si azzera
        this.numeroCorrente ='0';
        return true;
    }

    Quoziente() {
        this.parziale/=this.numeroCorrente; // divido il parziale con il numero passato
        // ogni volta che eseguo un operazione  il numeroCorrente si azzera
        this.numeroCorrente ='0';
        return true;
    }

    Risultato()
    {
        // ogni volta che eseguo un operazione  il numeroCorrente si azzera
        this.numeroCorrente ='0';
        return this.parziale; // ritorno il parziale che corrisponde al risultato
    }

    AggiornaNumCorrente(numero)
    {
        if(this.numeroCorrente.length == 1 && this.numeroCorrente == '0')
            this.numeroCorrente = numero; // sovrascrivo il primo 0
        else
            this.numeroCorrente+=numero; // numero è un carattere
        return this.numeroCorrente; // ritrno il numero corrente che apparirà sul display
    }




}