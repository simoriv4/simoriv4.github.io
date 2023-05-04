class campoMinato {

    constructor() {
        this.numBombe = 0;
        this.campo = []; // matrice
        this.RIGHE = 10;
        this.COLONNE = 10;
        this.MAXBOMBEINTORNO = 8; // massimo numero di bombe intorno ad una cella--> 8 celle        b b b
        //                                                                                          b x b
        //                                                                                          b b b
        this.MAXRIGHEBOMBE = 3;
        this.MAXCOLONNEBOMBE = 3;
        this.numBandiere = 0; // quande bandiere sono state usate
        this.isVinto = false;
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
                document.getElementById("numBombe").innerHTML = "NUMERO BOMBE: 8";
                break;
            case '2':
                // difficolta 2 = campo 20x20   15 bombe
                this.setNumBombe(15);
                this.RIGHE = 20;
                this.COLONNE = 20;
                //modifico la grid in css
                document.getElementById("grid").style.gridTemplateColumns = "auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto"; // 20 colonne
                document.getElementById("numBombe").innerHTML = "NUMERO BOMBE: 15";
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

    setBombeAdiacenti() { // setto il numero di bombe adiacenti ad ogni cella
        for (let r = 0; r < this.RIGHE; r++) {
            for (let c = 0; c < this.COLONNE; c++) {
                let numBombeAdiacenti = 0;
    
                // controlla le celle adiacenti --> max 8
                for (let r2 = r - 1; r2 <= r + 1; r2++) {
                    for (let c2 = c - 1; c2 <= c + 1; c2++) {
                        // controllo che la cella adiacente sia all'interno del campo
                        if (r2 >= 0 && r2 < this.RIGHE && c2 >= 0 && c2 < this.COLONNE) {
                            if (this.campo[r2][c2].getBomba()) {
                                numBombeAdiacenti++;
                            }
                        }
                    }
                }
    
                // imposto il numero di bombe adiacenti alla cella corrente
                this.campo[r][c].setNumBombe(numBombeAdiacenti);
            }
        }
    }

    

    clickCella(cella) {
        if(!this.isVinto) // se non si ha vinto si può cliccare, altrimenti non succede nulla
        {
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
                    // cambio su cella numero
                    let cella = this.getCella(riga, colonna);
                    $(cella[0]).removeClass("cellaCoperta");
                    $(cella[0]).addClass("cellaNumero");
                    // mostro il numero 
                    let tmp = this.getCella(riga, colonna);
                    $(tmp[0]).text(this.campo[riga][colonna].getNumBombe());
                }
                else if (this.campo[riga][colonna].getNumBombe() === 0) {
                    // faccio apparire tutte le celle vuote contenute nel "muro"
                    this.apriCelleVuoteAdiacenti(riga, colonna);
                }
            }
            this.controllaVincita();
        }

    }

    apriCelleVuoteAdiacenti(riga, colonna) {
        // apro la cella corrente
        let cella = this.getCella(riga, colonna);
        $(cella[0]).removeClass("cellaCoperta");
        $(cella[0]).addClass("cellaAperta");

    
        // controlla le celle adiacenti --> max 8
        for (let r = riga - 1; r <= riga + 1; r++) {
            for (let c = colonna - 1; c <= colonna + 1; c++) {
                // Ccntrollo che la cella sia all'interno del campo
                if (r >= 0 && r < this.RIGHE && c >= 0 && c < this.COLONNE) {
                    let cellaAdiacente = this.getCella(r, c);
    
                    // Rivela la cella adiacente se non è già stata rivela o è una bomba
                    if (cellaAdiacente[0].getAttribute("class") === "cellaCoperta" && !this.campo[r][c].getBomba()) {

                        if (this.campo[r][c].getNumBombe() === 0){ // se la cella non è adiacente ad una bomba allora richiama il metodo per rivelare la successiva
                            $(cellaAdiacente[0]).removeClass("cellaCoperta");
                            $(cellaAdiacente[0]).addClass("cellaAperta");
                            this.apriCelleVuoteAdiacenti(r, c);
                        }
                        else
                        {
                            // se è adiacente ad una bomba cambio la classe della cella e scrivo il numero di bombe
                            $(cellaAdiacente[0]).removeClass("cellaCoperta");
                            $(cellaAdiacente[0]).addClass("cellaNumero");
                            $(cellaAdiacente[0]).text(this.campo[r][c].getNumBombe());

                        }
                    }
                }
            }
        }
    }

    getCella(r, c) {
        // ritorna un vettore con un solo elemento-> la cella che si trova alle coordinate specificate
        return $("div[data-row='" + r + "'][data-col='" + c + "']");
    }

    controllaVincita()
    {
        let celleScoperte = 0;
        for(let r = 0; r < this.RIGHE; r++)
        {
            for(let c= 0; c<this.COLONNE; c++)
            {
                let tmp = this.getCella(r, c);
                let classe = tmp[0].getAttribute("class");
                if(!this.campo[r][c].getBomba() && (classe !== "cellaCoperta" && classe !== "cellaBandiera"))
                {
                    celleScoperte++;
                }
            }
        }
        if(((this.RIGHE*this.COLONNE)-celleScoperte) === this.numBombe) // deve essere uguale al     totale delle celle - numero delle bombe
        {
            $("#risultato").text("VITTORIA!");
            $(document).ready(function(){
                $("#risultato").slideDown("slow");
            });
            this.isVinto = true; // imposto la booleana su true in modo da non poter cliccare più nulla
        }
    }
    reset() {
        this.setDifficolta(); // resetto la partita
        this.numBandiere = 0;
        this.isVinto = false;
    }


}
