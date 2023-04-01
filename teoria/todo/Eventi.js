class Eventi{

    constructor()
    {
        this.array = []; // array contenente gli eventi
        this.maxEventi = 3;
    }

    addEvento(nome, data)
    {
        let evento = new Evento(nome, data);
        // aggiungo l'evento alla lista fino a maxEventi
        if(this.array.length < this.maxEventi)
        {
            this.array.push(evento);
            // faccio comparire la riga
            document.getElementById("r"+ (this.array.length)).hidden =false;
        }
        else
            alert("numero eventi massimo raggiunto. Completa gli eventi che hai per aggiungerne altri.");
        
        //alert(evento.getNome() + " " + evento.getData());
        this.viusalizza();
    }
    viusalizza()
    {
        for(let i = 0; i<this.array.length; i++)
        {
            document.getElementById("evento"+ (i+1)).value = this.array[i].getNome() + " " + this.array[i].getData();
            if(!this.array[i].getComplete())
            {
                document.getElementById("evento"+ (i + 1)).style ="";
                if(i< (this.array.length-1))
                    document.getElementById("evento"+ (i + 2)).style ="";
            }
            else
            {
                document.getElementById("evento"+ (i + 1)).style ="text-decoration: line-through;";
                if(i< (this.array.length-1))
                    document.getElementById("evento"+ (i + 2)).style ="";
            }



        }
    }
    sortData(evento1, evento2)
    {
        //riordino la lista in base alla data
        let dataA = new Date(evento1.getData()), dataB = new Date(evento2.getData());
        return dataA - dataB;   // < 0 --> a < b        > 0 --> b < a
    }

    visualizzaPerData()
    {
        // scorro l'array di eventi
        for(let i = 0; i<this.array.length; i++)
        {
            for(let j = 1; j<this.array.length-1; j++)
            {
                let tmp = this.sort(this.array[i], this.array[j]);
                if(tmp > 0) // inverto le date
                {
                    let tmp2 = this.array[j];
                    this.array[j] = this.array[i];
                    this.array[i] = tmp2;
                }

            }
        }
        // l'array è+ ordinato  
        this.viusalizza();  
    }


    remove(pos)
    {
        this.array.splice(pos, 1); // rimuove un elemento alla posizione pos
        // nella textbox in quella posizione setto il valore su vuoto
        document.getElementById("evento"+ (this.array.length + 1)).value ="";
        // visualizzo la lista senza quell'elemento
        this.viusalizza();
        this.nascondiRigheVuote(); // nascondo le righe eliminate
    }
    complete(pos)
    {
        // cambio il font della textbox mettendolo barrato
        if(!this.array[pos].getComplete())
        {
            document.getElementById("evento"+ (pos + 1)).style ="text-decoration: line-through;";
            this.array[pos].setComplete(true); // setto su completato
        }
        else
        {
            // cambio il font della textbox togliendolo dal barrato
            document.getElementById("evento"+ (pos + 1)).style ="";
            this.array[pos].setComplete(false); // setto su non completato
        }

    }

    nascondiRigheVuote()
    {
        // nasconde le righe della tabella che sono vuote
        for(let i = this.array.length; i< this.maxEventi; i++) // inizio dalla lunghezza dell'array perchè le righe vuote sono maggiori o uguali alla lunghezza
        {
            document.getElementById("r"+ (i+1)).hidden =true; // nascondo la riga corrente
        }

    }

    visualizzaPerStato()
    {
        // ordino la lista in base allo stato
        let listatmp = []; // per gli eventi completati
        let cont = 0;
        for(let i = 0; i<this.array.length; i++)
        {
            if(this.array[i].getComplete())
            {
                listatmp.push(this.array[i]);
                this.array.splice(i,1);
                i--;
            }
        }
        // rimetto gli eventi non completati nella lista principale
        for(let i = 0; i<listatmp.length; i++)
        {
            this.array.push(listatmp[i]);
        }

        this.viusalizza(); // visualizzo normalmente la lista

    }





}