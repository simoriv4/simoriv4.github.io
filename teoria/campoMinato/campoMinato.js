class campoMinato {

    constructor(numBombe) {
        this.campo = [[]]; // matrice---> 10x10
        this.numBombe = numBombe; // numero di mine totale contenute nel campo
        this.RIGHE = 10;
        this.COLONNE = 10;
        this.MAXBOMBEINTORNO = 8; // massimo numero di bombe intorno ad una cella--> 8 celle        b b b
                                  //                                                                b x b
                                  //                                                                b b b
    }
    generaCampo() {
        // Inizializza la griglia con oggetti vuoti
        for (let r = 0; r < this.RIGHE; r++) 
        {
            for (let c = 0; c < this.COLONNE; c++) 
            {
                this.celle[r][c] = new cella(false, false, 0); // assegno alla posizione una cella vuota 
            }
        }
    }

    generaBombe() {
        // genera in posizioni casuli le bombe
        for (let i = 0; i < this.numBombe; i++)
        {
            // ripeto l'operazione per il numero di bombe
            // genero un numero casuale sia per righe che per colonne
            let randr = Math.floor(Math.random() * this.RIGHE);
            let randc = Math.floor(Math.random() * this.COLONNE);
            // controllo se la posizione non fosse già estratta
            if (!this.campo[randr][randc].isBomba)
                this.campo[randr][randc].setBomba(true);
            else
                i--;
        }
    }

    setBombeAdiacenti() // setto il numero di bombe adiacenti ad ogni cella
    {
        for (let r = 0; r < this.RIGHE; r++) 
        {
            for (let c = 0; c < this.COLONNE; c++) 
            {
                let contBombe= 0; // contatore bombe intorno ad una cella

                // se non è una bomba
                if(!this.campo[r][c].isBomba)
                {
                    // ciclo intorno alla cella per vedere quante bombe ci sono--> 8 celle      b b b
                    //                                                                          b x b
                    //                                                                          b b b
                    let rtemp = 0;
                    let ctemp = 0;
                    if(r>0)
                        rtemp = r-1; // inizia dalla riga precedente
                    if(c>0)
                        ctemp = c-1; // inizia dalla colonna precedente
                        
                    for(let i = 0; i < this.MAXBOMBEINTORNO+1; i++)
                    {
                        if(this.campo[rtemp][ctemp].isBomba && c !== ctemp && r !== rtmp)
                            contBombe++;
                    }
                    this.campo[r][c].setBombeAdiacenti(contBombe); // sbagliato riguarda!!!
                }
            }
        }
    }


}