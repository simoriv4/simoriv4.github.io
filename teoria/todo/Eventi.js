class Eventi{

    constructor()
    {
        this.array = []; // array contenente gli eventi
        this.maxEventi = 10;
        this.GIORNIURGENTI = 3;
        this.IsUrgenti = false;
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
        this.visualizza(this.array);
    }
    visualizza(array)
    {
        for(let i = 0; i<array.length; i++)
        {
            document.getElementById("r"+ (i+1)).hidden =false;
            document.getElementById("evento"+ (i+1)).value = array[i].getNome() + " " + array[i].getData();
            if(!array[i].getComplete())
            {
                document.getElementById("evento"+ (i + 1)).style ="";
                if(i< (array.length-1))
                    document.getElementById("evento"+ (i + 2)).style ="";
            }
            else
            {
                document.getElementById("evento"+ (i + 1)).style ="text-decoration: line-through;";
                if(i< (array.length-1))
                    document.getElementById("evento"+ (i + 2)).style ="";
            }
            this.setColore(array[i],i);

        }
        //elimino le eventuali righe che non servono negli eventi urgenti
        if(this.array.length > array.length)
            this.nascondiRigheVuote(array);
    }
    sortData(evento1, evento2)
    {
        //riordino la lista in base alla data
        let dataA = new Date(evento1.getData()), dataB = new Date(evento2.getData());
        return dataA - dataB;   // < 0 --> a < b        > 0 --> b < a
    }

    visualizzaPerData()
    {
        let completati = [];
        // scorro l'array di eventi
        for(let i = 0; i<this.array.length-1; i++)
        {
            if(!this.array[i].getComplete())
            {
                for(let j = 1; j<this.array.length; j++)
                {
                    let tmp = this.sortData(this.array[i], this.array[j]);
                    if(tmp > 0) // inverto le date
                    {
                        let tmp2 = this.array[j];
                        this.array[j] = this.array[i];
                        this.array[i] = tmp2;
                    }
    
                }
            }
            else{
                completati.push(this.array.splice(i,1)); // aggiungo al vettore temporaneo l'evento completato che poi aggiungerò in fondo al principale
            }
        }
        // unisco in fondo
        for(let i = 0; i< completati.length; i++)
        {
            this.array.push(completati.pop());
        }
        // l'array è+ ordinato 
        this.visualizza(this.array);  
    }


    remove(pos)
    {
        this.array.splice(pos, 1); // rimuove un elemento alla posizione pos
        // nella textbox in quella posizione setto il valore su vuoto
        document.getElementById("evento"+ (this.array.length + 1)).value ="";
        // visualizzo la lista senza quell'elemento
        this.visualizza(this.array);
        this.nascondiRigheVuote(this.array); // nascondo le righe eliminate
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
            this.setColore(this.array[pos], pos);
        }

    }

    nascondiRigheVuote(array)
    {
        // nasconde le righe della tabella che sono vuote
        for(let i = array.length; i< this.maxEventi; i++) // inizio dalla lunghezza dell'array perchè le righe vuote sono maggiori o uguali alla lunghezza
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

        this.visualizza(this.array); // visualizzo normalmente la lista

    }
    clearAll()
    {
        this.array.splice(0, this.array.length); // elimino gli elementi dalla posizione 0 fino alla lunghezza dell'array--> fino alla fine--> svuoto l'array
        this.visualizza(this.array);
        this.nascondiRigheVuote(); // nascondo le righe eliminate
    }

    modifica(pos) // modifico il contenuto dell'evento
    {
        // rendo visibile il bottone conferma modifica
        document.getElementById("ConfermaMod"+(pos+1)).hidden = false;
        
        let tmp = document.getElementById("evento"+(pos+1)).value;
        document.getElementById("evento"+(pos+1)).hidden = true;
        document.getElementById("eventoTxt"+(pos+1)).value = tmp;
        document.getElementById("eventoTxt"+(pos+1)).hidden = false;
    }

    confermaModifica(pos)
    {
        document.getElementById("evento"+(pos+1)).value = document.getElementById("eventoTxt"+(pos+1)).value;
        let content = document.getElementById("evento"+(pos+1)).value;
        //splitto l'evento e lo creo
        let vett = content.split(" ");
        let tmp  = new Evento(vett[0], vett[1]);

        //salvo le modifiche
        this.array[pos] = tmp;
        this.visualizza(this.array);
        // nascondo e mostro i componenti opportuni
        document.getElementById("eventoTxt"+(pos+1)).hidden = true;
        document.getElementById("evento"+(pos+1)).hidden = false;
        document.getElementById("ConfermaMod"+(pos+1)).hidden = true;

        this.setColore(this.array[pos], pos);
    }
    urgenti()
    {
        if(!this.IsUrgenti) // prima volta che si clicca
        {
            //trova gli eventi che avverranno entro 3 giorni e li visualizza
            let urgenti = [];
            for(let i = 0; i< this.array.length;i++)
            {
                let g = this.giorniMancanti(this.array[i].getData());
                if(g <= this.GIORNIURGENTI)
                {
                    urgenti.push(this.array[i]); // aggiungo all'array l'evento urgente
                }
            }

            // visualizzo gli urgenti
            this.visualizza(urgenti);

            this.IsUrgenti = true; // per la seconda volta entrerà nell'altro if
        }
        else
        {
            this.visualizza(this.array);
            this.setColore(this.array);
            this.IsUrgenti = false;
        }
        
    }

    setColore(evento, pos)
    {
        // ciclo e guardo i giorni--> se mancano 3 gionri dalla dataAttuale
        //3 giorni --> rosso        7 giorni --> giallo     > 7 giorni --> verde
        for(let i = 0; i< this.array.length;i++)
        {
            if(!this.array[i].getComplete())// se non è stato completato assegno il colore
            {
                let differenzaGiorni = this.giorniMancanti(this.array[i].getData()); // salvo quanti giorni mancano all'evento
                if(differenzaGiorni <=3) // colore rosso
                    document.getElementById("evento"+ (i + 1)).style ="background-color: rgb(190, 0, 0);";
                else if(differenzaGiorni >3 && differenzaGiorni <=7)
                    document.getElementById("evento"+ (i + 1)).style ="background-color: rgb(251, 255, 0);";
                else if(differenzaGiorni > 7)
                    document.getElementById("evento"+ (i + 1)).style ="background-color: green;";
            }
            
        }

    }

    giorniMancanti(data)
    {
        let oggi = new Date();
        let dataInserita = new Date(data); // converto in oggetto data la data passata --> formato data --> aaaa/mm/gg
        let differenzaTempo = dataInserita.getTime() - oggi.getTime();
        let differenzaGiorni = Math.ceil(differenzaTempo / (1000 * 60 * 60 * 24));
        return differenzaGiorni;
    }






}