class Tesserati {

    constructor() {
        this.array = []; // array contenente i tesserati
        this.catalogoLibri = [];
    }

    salvaSuFile() {
        this.clearFile();
        //salvo in una stringa gli elementi
        for (let i = 0; i < this.array.length; i++) {
            localStorage.setItem('Tesserato' + (i + 1), this.array[i].visualizza());
        }
        for (let i = 0; i < this.catalogoLibri.length; i++) {
            localStorage.setItem('Libro' + (i + 1), this.catalogoLibri[i].visualizza());
        }

    }

    aggiungiRiga(index) {
        var table = $("#myDataTable").DataTable();
        //associo all'URL un parametro in modo da accedere alle informazioni in un'altra scheda
        let rowData = [`<a href ='infoTesserato.html?parametro=${index}'>${this.array[index].nome}</a>`, this.array[index].cognome, this.array[index].dataNascita, `<a href ="noleggiaLibri.html?parametro=${index}"><i class="fa-solid fa-square-plus"></i></a>`]; // al cestino corrisponde l'id del tesserato
        // aggiungo la riga alla tabella
        table.row.add(rowData).draw();
    }

    getParametro() {
        // trovo il parametro contenuto nell'url e lo ritorno
        return new URLSearchParams(window.location.search).get("parametro");
    }

    salvaDaFile() {
        if (this.getParametro() === "true") {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1500
            });
        }
        this.array = [];
        let i = 0;
        let tmp = localStorage.getItem('Tesserato' + (i + 1));
        
        while (tmp != undefined) {
            tmp = localStorage.getItem('Tesserato' + (i + 1));
            let vett = tmp.split(';');
            // console.log(vett);
            let arrayNoleggio = [];
            if (vett[3] !== "")
                arrayNoleggio = vett[3].split(',');

            let temp = new Tesserato(vett[0], vett[1], vett[2], arrayNoleggio, vett[4], vett[5], vett[6], vett[7]);
            this.array[i] = temp;
            i++;
            tmp = localStorage.getItem('Tesserato' + (i + 1));
        }

        if (localStorage.getItem(`Libro${1}`) !== null) {
            this.catalogoLibri = [];
            let i = 0;
            let tmp = localStorage.getItem('Libro' + (i + 1));
            while (tmp != undefined) {
                tmp = localStorage.getItem('Libro' + (i + 1));
                let vett = tmp.split(';');

                let temp = new Libro(vett[0], vett[1], vett[2], vett[3], vett[4], vett[5], vett[7]);
                this.catalogoLibri[i] = temp;
                i++;
                tmp = localStorage.getItem('Libro' + (i + 1));
            }
            console.log(this.catalogoLibri);

        }
        else
            this.fromJSON();
        for (let i = 0; i < this.array.length; i++)
            this.aggiungiRiga(i);

    }

    clearFile() {
        localStorage.clear();
    }

    fromJSON() {
        let self = this;
        $.getJSON('catalogo.json', function (json) {
            self.inizializzaLibriArray(json);
        });
    }

    inizializzaLibriArray(json) {
        for (let key in json) {
            if (json.hasOwnProperty(key)) {
                let item = json[key];
                let libro = new Libro(item.Titolo, item.Autore, item.CasaEditrice, item.AnnoDiPubblicazione, item.IsNoleggiato, item.DataNoleggio, item.Immagine, item.NomeLettore);
                this.catalogoLibri.push(libro);
            }
        }
        this.salvaSuFile();
    }





}