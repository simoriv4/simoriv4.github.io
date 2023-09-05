class Tesserati{

    constructor()
    {
        this.array = []; // array contenente i tesserati
        //this.salvaDaFile();
    }

    infoTesserato(nome, cognome, dataNascita)
    {
        alert("qui");
        isPresente = this.isPresente(nome, cognome, dataNascita);
        if(isPresente !== -1)
        {

        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              })
        }
    }

    isPresente(nome, cognome, dataNascita)
    {
        for(let i = 0; i< this.array.length; i++)
        {
            if (nome === this.array[i].nome && cognome === this.array[i].cognome && dataNascita === this.array[i].dataNascita )
                return i;
        }
        return -1;
    }

    aggiungiTesserato(nome, cognome, dataNascita)
    {
        let tesserato = new Tesserato(nome, cognome, dataNascita);
        this.array.append(tesserato);
    }
    /*visualizza(array)
    {
        for(let i = 0; i<array.length; i++)
        {
            document.getElementById("r"+ (i+1)).hidden =false;
            document.getElementById("evento"+ (i+1)).value = array[i].nomeEvento + " " + array[i].dataEvento;
            if(!array[i].IsComplete)
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
    }*/

    salvaDaFile()
    {
        this.array = [];
        let i = 0;
        let tmp = localStorage.getItem('evento'+(i+1));

        while(tmp != undefined)
        {
            tmp = localStorage.getItem('evento'+(i+1));
            let vett = tmp.split(';');
            let temp = new Libro(vett[0],vett[1],vett[3]);
          this.array[i] = temp;
          i++;
          tmp = localStorage.getItem('evento'+(i+1));
        }
        // this.visualizza(this.array);

    }

    clearFile()
    {
        localStorage.clear();
    }




}