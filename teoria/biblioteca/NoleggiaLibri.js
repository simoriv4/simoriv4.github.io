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
        let table = $("#myDataTable").DataTable();
        //associo all'URL un parametro in modo da accedere alle informazioni in un'altra scheda
        let isDisponibile = "";

        if (this.libriArray[index].IsNoleggiato === true)
            isDisponibile = `<i class="fa-solid fa-square-xmark" style="color: #ff0000;" id="${index}"></i>`;
        else
            isDisponibile = `<i class="fa-solid fa-square-check" style="color: #00ad14;" id="${index}" class="disponibilita"></i>`;

        let rowData = [`<a href ='dettagliLibro.html?parametro=${index}'>${this.libriArray[index].titolo}</a>`, this.libriArray[index].autore, this.libriArray[index].casaEditrice, this.libriArray[index].annoDiPubblicazione, isDisponibile, this.libriArray[index].dataScadenzaNoleggio]; // al cestino corrisponde l'id del tesserato
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
    }

    fromJSON() {
        let self = this;
        $.getJSON('catalogo.json', function (json) {
            self.inizializzaLibriArray(json);

            for (let i = 0; i < self.libriArray.length; i++)
                self.aggiungiRiga(i);
        });

    }
    inizializzaLibriArray(json)
    {
        for (let key in json) {
            if (json.hasOwnProperty(key)) {
                let item = json[key];
                let libro = new Libro(item.Titolo, item.Autore, item.CasaEditrice, item.AnnoDiPubblicazione, item.IsNoleggiato, item.DataNoleggio, item.Immagine);
                this.libriArray.push(libro);
            }
        }
    }

    salvaSuFile() {
        this.clearFile();
        //salvo in una stringa gli elementi
        for (let i = 0; i < this.array.length; i++) {
            localStorage.setItem('Tesserato' + (i + 1), this.array[i].visualizza());
        }
    }

    noleggiaLibro(idLibro) {
        console.log("qui");
        let tesserato = this.array[this.getParametro()];
        let libro = this.libriArray[idLibro];
        libro.IsNoleggiato = true;
        console.log(libro);
        tesserato.noleggiaLibro(libro);

        this.salvaSuFile();

        $(idLibro).removeClass("fa-square-check");

        $(idLibro).addClass("fa-square-xmark");
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500
        });
    }

    clearFile() {
        localStorage.clear();
    }
}