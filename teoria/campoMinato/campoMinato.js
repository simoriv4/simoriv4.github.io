class campoMinato {

    constructor() {
        this.numBombe = 0;
        this.campo = []; // matrice
        this.RIGHE = 10;
        this.COLONNE = 10;
        this.MAXBOMBEINTORNO = 8; // massimo numero di bombe intorno ad una cella--> 8 celle        b b b
        //                                                                b x b
        //                                                                b b b
        this.MAXRIGHEBOMBE = 3;
        this.MAXCOLONNEBOMBE = 3;
        this.numBandiere = 0; // quande bandiere sono state usate
    }

    setNumBombe(numBombe) {
        this.numBombe = numBombe;// numero di bombe totale contenute nel campo
    }

    setDifficolta() {
        // leggo la difficolta
        let diff = document.getElementById("difficolta").value;
        switch (diff) {
            case '0':
                return; // termino e non genero nulla
            case '1':
                // difficolta 1 = campo 10x10   8 bombe
                this.setNumBombe(8);
                this.RIGHE = 10;
                this.COLONNE = 10;

                //modifico la grid in css
                document.getElementById("grid").style.gridTemplateColumns = "auto auto auto auto auto auto auto auto auto auto";
                document.getElementById("numBombe").innerHTML = "NUMERO BOMBE: 10";
                break;
            case '2':
                // difficolta 2 = campo 20x20   15 bombe
                this.setNumBombe(15);
                this.RIGHE = 20;
                this.COLONNE = 20;
                //modifico la grid in css
                document.getElementById("grid").style.gridTemplateColumns = "auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto"; // 20 colonne
                document.getElementById("numBombe").innerHTML = "NUMERO BOMBE: 20";
                break;
            case '3':
                // difficolta 3 = campo 30x30   30 bombe
                this.setNumBombe(30);
                this.RIGHE = 30;
                this.COLONNE = 30;
                //modifico la grid in css
                document.getElementById("grid").style.gridTemplateColumns = "auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto"; // 30 colonne
                document.getElementById("numBombe").innerHTML = "NUMERO BOMBE: 30";
                break;
        }
        this.generaCampo();
        this.generaBombe();
        this.setBombeAdiacenti();

    }

    generaCampo() {
        // prima di generare il campo lo svuoto
        document.getElementById("grid").innerHTML = "";
        this.campo = []; // azzero il contenuto
        //$("#risultato").attr( 'style', 'display = none');
        $(document).ready(function () {
            $("#risultato").slideUp("slow");
        });

        // cambio il contenuto della div
        $("#risultato").text("START");

        /*$(document).ready(function(){
            $("#risultato").slideDown("slow");
        });
        */

        // genera matrice
        for (let c = 0; c < this.COLONNE; c++) {
            this.campo[c] = [];
        }

        // Inizializza la griglia con celle coperte
        let contCelle = 0;
        for (let r = 0; r < this.RIGHE; r++) {
            for (let c = 0; c < this.COLONNE; c++) {
                // uso jquery per creare una griglia dinamica
                $(document).ready(function () {

                    $("#grid").append('<div id= "cella' + +contCelle + '" class="cellaCoperta" data-row="' + r + '" data-col="' + c + '" onclick="c.clickCella(this)" oncontextmenu="c.bandiera(this)"></div>'); // passando il this alle funzioni potrò accedere ai campi della cella
                });
                this.campo[r][c] = new cella(false, false, 0); // assegno alla posizione una cella vuota 
                contCelle++;
            }
        }
    }


    bandiera(cel) {
        //imposta la cella come bandiera
        // verifico la classe della cella
        let classeCella = cel.getAttribute("class");
        if (classeCella == "cellaAperta") // non metto la bandiera
            return;
        else {
            if (classeCella == "cellaBandiera") {
                // imposto la classe cellaCoperta--> impostando lo stile css assegnto
                $(cel).removeClass("cellaBandiera");
                $(cel).addClass("cellaCoperta");
                this.numBandiere--;
            }
            else if (classeCella == "cellaCoperta" && this.numBandiere < this.numBombe) {
                // imposto la classe cellaBandiera--> impostando lo stile css assegnto
                $(cel).removeClass("cellaCoperta");
                $(cel).addClass("cellaBandiera");
                this.numBandiere++;
            }

        }

    }
    generaBombe() {

        // l'id corrisponde a bomba o meno

        // genera in posizioni casuli le bombe
        for (let i = 0; i < this.numBombe; i++) {
            // ripeto l'operazione per il numero di bombe
            // genero un numero casuale sia per righe che per colonne
            let randr = Math.floor(Math.random() * this.RIGHE);
            let randc = Math.floor(Math.random() * this.COLONNE);
            // controllo se la posizione non fosse già estratta
            if (!this.campo[randr][randc].isBomba) {
                this.campo[randr][randc].setBomba(true);
                // classe bomba
                let cell = this.getCella(randr, randc);
                $(cell[0]).attr('id', "bomba-" + i)

            }
            else
                i--;
        }
    }

    //ERRATO
    /* getBombeAdiacenti() // setto il numero di bombe adiacenti ad ogni cella
     {
         let nCelle = 0;
         let righecelle = 0;
         let colonneCelle = 0;
         for (let r = 0; r < this.RIGHE; r++) {
             for (let c = 0; c < this.COLONNE; c++) {
                 let contBombe = 0; // contatore bombe intorno ad una cella
 
                 // se non è una bomba
                 if (!this.campo[r][c].getBomba()) {
                     // ciclo intorno alla cella per vedere quante bombe ci sono--> 8 celle      b b b
                     //                                                                          b x b
                     //                                                                          b b b
                     // setto il numero di celle da controllare in base alla posizione
 
                     if ((r !== 0 && c === 0 && r !== this.RIGHE)) {
                         nCelle = 6; // 5 celle da controllare +1 (cella cliccata non da controllare)
                         righecelle = 3;
                         colonneCelle = 2;
                     }
                     else if(r === 0 && c !== 0 && c !== this.COLONNE)
                     {
                         nCelle = 6; // 5 celle da controllare +1 (cella cliccata non da controllare)
                         righecelle = 2;
                         colonneCelle = 3;
                     }
                     else if ((r === 0 && c === 0) || (r === 0 && c === this.COLONNE) || (c === 0 && r === this.RIGHE) || (r === this.RIGHE && c === this.COLONNE)) {
                         nCelle = 4; // 3 celle da controllare +1 (cella cliccata non da controllare)
                         righecelle = 2;
                         colonneCelle = 2;
                     }
                     else {
                         nCelle = this.MAXBOMBEINTORNO + 1; // numero di bombe massimo (8) +1 (cella cliccata non da controllare)
                         righecelle = 3;
                         colonneCelle = 3;
                     }
 
 
                     let rtemp = 0;
                     let ctemp = 0;
                     if (r > 0)
                         rtemp = r - 1; // inizia dalla riga precedente
                     if (c > 0)
                         ctemp = c - 1; // inizia dalla colonna precedente
 
                     for (let r2 = rtemp; r2 < righecelle; r2++) {
                         for (let c2 = ctemp; c2 < colonneCelle; c2++) {
                             if (this.campo[r2][c2].getBomba() && c !== ctemp && r !== rtemp) // salto la cella cliccata
                                 contBombe++;
                         }
                     }
                     this.campo[r][c].setNumBombe(contBombe);
                 }
             }
         }
     }*/

    setBombeAdiacenti() {// setto il numero di bombe adiacenti ad ogni cella
        for (let r = 0; r < this.RIGHE; r++) {
            for (let c = 0; c < this.COLONNE; c++) {
                let contBombe = 0;
                if (!this.campo[r][c].getBomba()) { // controllo che la cella non sia una bomba--> non deve contenere numeri
                    // cicli intorno alla cella da controllare
                    for (let r2 = Math.max(0, r - 1); r2 <= Math.min(r + 1, this.RIGHE - 1); r2++) {// utilizzando Math.max e Math.min evito di uscire dalla matrice--> parto da 0 continuerò con r-1
                        for (let c2 = Math.max(0, c - 1); c2 <= Math.min(c + 1, this.COLONNE - 1); c2++) {
                            if (this.campo[r2][c2].getBomba()) {
                                contBombe++;
                            }
                        }
                    }
                    this.campo[r][c].setNumBombe(contBombe);
                }
            }
        }
    }

    clickCella(cella) {
        // ricavo riga e colonna
        //trovo la riga della cella
        let riga = cella.getAttribute("data-row");

        //trovo la colonna della cella
        let colonna = cella.getAttribute("data-col");

        // se non è un flag bandiera
        if (cella.getAttribute("class") !== "cellaBandiera") {
            if (this.campo[riga][colonna].getBomba()) {
                // rivelo tutte le bombe
                // cambio la classe della div da cellaCoperta in cellaBomba
                $(cella).removeClass("cellaCoperta");
                $(cella).addClass("cellaBomba");

                for (let r = 0; r < this.RIGHE; r++) {
                    for (let c = 0; c < this.COLONNE; c++) {
                        if (this.campo[r][c].getBomba()) {
                            // cambio il contenuto del div risultato
                            $("#risultato").text("GAME OVER");

                            // cella corrente
                            let tmp = this.getCella(r, c);
                            $(tmp[0]).removeClass("cellaCoperta");
                            $(tmp[0]).addClass("cellaBomba");
                        }
                    }
                }
                $(document).ready(function () {
                    $("#risultato").slideDown("slow");
                });
            }
            else if (this.campo[riga][colonna].getNumBombe() !== 0) {
                //alert(this.campo[riga][colonna].getNumBombe());

                // mostro il numero 
                let tmp = this.getCella(riga, colonna);
                $(tmp[0]).text(this.campo[riga][colonna].getNumBombe());
            }
            else if (this.campo[riga][colonna].getNumBombe() === 0) {
                // faccio apparire tutte le celle vuote contenute nel "muro"
                this.celleAperte(riga, colonna);
            }
        }

    }

    celleAperte(r, c) {
        if (!this.campo[r][c].getRivelato()) {
            // Rivelo la cella corrente
            let cella = this.getCella(r, c);
            $(cella[0]).removeClass("cellaCoperta");
            $(cella[0]).addClass("cellaAperta");
            this.campo[r][c].setRivelato(true);
            // Scorro le celle adiacenti

            // controlla le celle sopra alla corrente
            // appena incontra una cella con un numero(adiacente ad una o più bombe) cambia direzione --> destra
            // appena ne incotntra un'altra cambia verso il basso
            // appena ne incotra un'altra cambia verso sinistra
            // controlla che
            
        }
    }
    getCella(r, c) {
        // ritorna un vettore con un solo elemento-> la cella che si trova alle coordinate specificate
        return $("div[data-row='" + r + "'][data-col='" + c + "']");
    }

    reset() {
        this.setDifficolta(); // resetto la partita
        this.numBandiere = 0;
    }


}
