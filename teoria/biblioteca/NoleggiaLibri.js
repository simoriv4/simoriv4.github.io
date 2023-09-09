class NoleggiaLibri {
    constructor() {
        this.array = []; // array contenente i tesserati
        this.libriArray = [];
    }
    getParametro() {
        // trovo il parametro contenuto nell'url e lo ritorno
        return new URLSearchParams(window.location.search).get("parametro");
    }
    aggiungiRiga(index) {
        var table = $("#myDataTable").DataTable();
        //associo all'URL un parametro in modo da accedere alle informazioni in un'altra scheda
        let isNoleggiato = "";
        alert(this.libriArray[index].titolo);

        if (this.libriArray[index].IsNoleggiato === false)
            isNoleggiato = '<i class="fa-solid fa-square-xmark" style="color: #ff0000;"></i>';
        else
            isNoleggiato = '<i class="fa-solid fa-square-check" style="color: #00ad14;"></i>';

        let rowData = [`<a href ='dettagliLibro.html?parametro=${index}'>${this.libriArray[index].titolo}</a>`, this.libriArray[index].autore, this.libriArray[index].casaEditrice, this.libriArray[index].annoDiPubblicazione, IsNoleggiato, this.libriArray[index].dataScadenzaNoleggio]; // al cestino corrisponde l'id del tesserato
        // aggiungo la riga alla tabella
        table.row.add(rowData).draw();
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
        this.fromJSON();

        for (let i = 0; i < this.array.length; i++)
            this.aggiungiRiga(i);
    }

    fromJSON() {
        $.getJSON('catalogo.json', function (json) {
            for (let key in json) {
                if (json.hasOwnProperty(key)) {
                    let item = json[key];
                    let libro = new Libro(item.Titolo, item.Autore, item.CasaEditrice, item.AnnoDiPubblicazione, item.IsNoleggiato, item.DataNoleggio, item.Immagine)
                    this.libriArray.push(libro);
                }
            }
        });
    }

    noleggiaLibro() {
        let tesserato = this.array[this.getParametro()];
        tesserato.noleggiaLibro()

    }
}