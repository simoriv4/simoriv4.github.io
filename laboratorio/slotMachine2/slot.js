class SlotMachine{

    constructor()
    {
        this.credito = 10;
        this.slot = new Slot();
    }

    myTimeoutVisualizza;
    spin()
    {
        if(this.credito < 0) // se il credito è maggiore di 0 si può spinnare
        {
            alert("credito insufficiente");
            return;
        }
        setTimeout(this.visualizza(),500);
         setTimeout(this.stopTimeout(),4000);
        this.credito--;
    }

    visualizza()
    {
        // genero un numero rando e visualizzo in quella posizione l'immagine
        let rand1 = Math.round(Math.random() * 9)+1;
        let rand2 = Math.round(Math.random() * 9)+1;
        let rand3 = Math.round(Math.random() * 9)+1;

        document.getElementById("img1").src = this.slot.elementAt(rand1);
        document.getElementById("img2").src = this.slot.elementAt(rand2);
        document.getElementById("img3").src = this.slot.elementAt(rand3);
    }
    stopTimeout()
    {
        //termina le timeout
        //clearTimeout(myTimeoutVisualizza);
        //clearTimeout(myTimeoutTermina);

        this.controllaVincita();
        document.getElementById("crediti").innerHTML = "crediti: " + this.credito;

    }

    reset()
    {
        document.getElementById("img1").src = this.slot.elementAt(0);
        document.getElementById("img2").src = this.slot.elementAt(0);
        document.getElementById("img3").src = this.slot.elementAt(0);
        this.credito = 10;
        document.getElementById("crediti").innerHTML = "crediti: " + this.credito;

    }

    controllaVincita()
    {
        // vincite possibili        111     101     110     011
        // 111
        if(document.getElementById("img1").src === document.getElementById("img2").src && document.getElementById("img1").src === document.getElementById("img3").src)
        {
            //trovo il numero dell'immagine
            let split1 = document.getElementById("img1").src.split('/');
            let split2 = split1[1].split('.'); // prendo poi la prima posizione che contiene il numero
            let numero = split2[0];

            this.credito += 50*(numero+1);
        }
        // 110      011
        else if(document.getElementById("img1").src === document.getElementById("img2").src || document.getElementById("img2").src === document.getElementById("img3").src)
        {
            //trovo il numero dell'immagine
            let split1 = document.getElementById("img2").src.split('/'); // usop img2 perchè in ogni caso viene presa in considerazione nel confronto
            let split2 = split1[1].split('.'); // prendo poi la prima posizione che contiene il numero
            let numero = split2[0];

            this.credito += 20*(numero+1);
        }
        // 101
        else if(document.getElementById("img1").src === document.getElementById("img3").src)
        {
            //trovo il numero dell'immagine
            let split1 = document.getElementById("img1").src.split('/'); 
            let split2 = split1[1].split("."); // prendo poi la prima posizione che contiene il numero
            let numero = split2[0];
        
            this.credito += 5*(numero+1);
        } 
    }
    incassa()
    {
        alert("hai incassato " + this.credito +" crediti");
    }
}