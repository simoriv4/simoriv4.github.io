class InfoTesserato{

    constructor() {
        this.array = []; // array contenente i tesserati
    }


    getParametro()
    {
        // trovo il parametro contenuto nell'url e lo ritorno
        return new URLSearchParams(window.location.search).get("parametro");
    }

    mostraInfo()
    {
        // trovo il tesserato
        let tesserato = this.array[this.getParametro()];
        let libriNoleggiati = tesserato.libriNoleggiati;

        let informazioni = $(`<li> Data di Nascita: ${tesserato.dataNascita}</li><li>Luogo di Nascita: ${tesserato.luogoDiNascita}</li><li> Residenza: ${tesserato.residenza}</li><li>Domicilio: ${tesserato.domicilio}</li>`);
        let libri = "";
        for(let i = 0; i < libriNoleggiati.lentgth; i++)
        {
            libri+="<li>" + libriNoleggiati[i]+"</i>";
        }
        $("#nomeTesserato").html(tesserato.nome + " " + tesserato.cognome);
        $("#Informazioni").append(informazioni);
        $("#LibriInNoleggio").append(libri);


    }

    rimuoviTesserato()
    {
        this.array.splice(this.getParametro(), 1);

        this.salvaSuFile();
            window.location.href = `index.html?parametro=${true}`;
    }

    salvaSuFile() {
        this.clearFile();
        //salvo in una stringa gli elementi
        for (let i = 0; i < this.array.length; i++) {
            localStorage.setItem('Tesserato' + (i + 1), this.array[i].visualizza());
        }
    }


    salvaDaFile() {
        this.array = [];
        let i = 0;
        let tmp = localStorage.getItem('Tesserato' + (i + 1));

        while (tmp != undefined) {
            tmp = localStorage.getItem('Tesserato' + (i + 1));
            let vett = tmp.split(';');
            let temp = new Tesserato(vett[0], vett[1], vett[2], vett[3], vett[4], vett[5], vett[6], vett[7]);
            this.array[i] = temp;
            i++;
            tmp = localStorage.getItem('Tesserato' + (i + 1));
        }

        this.mostraInfo();

    }

    clearFile() {
        localStorage.clear();
    }



}