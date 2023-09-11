class CatalogoLibri {
    constructor() {
        this.array = []; // array contenente i tesserati
        this.catalogoLibri = [];
    }
    // getParametro() {
    //     // trovo il parametro contenuto nell'url e lo ritorno
    //     return new URLSearchParams(window.location.search).get("parametro");
    // }
    aggiungiRiga(index) {
        let table = $("#myDataTable").DataTable();
        //associo all'URL un parametro in modo da accedere alle informazioni in un'altra scheda
        let isDisponibile = "";
        let dataAttuale = new Date();
        let dataScadenzaNoleggio = new Date(this.catalogoLibri[index].dataScadenzaNoleggio);
        let scadenzaNoleggio = this.catalogoLibri[index].dataScadenzaNoleggio;
        let nomeLettore = "";
        if (this.catalogoLibri[index].IsNoleggiato === "true") {
            isDisponibile = `<i class="fa-solid fa-square-xmark" style="color: #ff0000;" id="${index}"></i>`;
            if (dataAttuale > dataScadenzaNoleggio)
                scadenzaNoleggio = `${this.catalogoLibri[index].dataScadenzaNoleggio} -Libro non ancora consegnato-`;
        }
        else
            isDisponibile = `<i class="fa-solid fa-square-check" style="color: #00ad14;" id="${index}" class="disponibilita"></i>`;

        if (scadenzaNoleggio === "NaN/NaN/NaN")
            scadenzaNoleggio = "";
        if (this.catalogoLibri[index].nomeLettore !== "undefined" && this.catalogoLibri[index].nomeLettore !== "null")
            nomeLettore = this.catalogoLibri[index].nomeLettore;
        let rowData = [`<a href ='dettagliLibro.html?parametro=${index}'>${this.catalogoLibri[index].titolo}</a>`, this.catalogoLibri[index].autore, this.catalogoLibri[index].casaEditrice, this.catalogoLibri[index].annoDiPubblicazione, isDisponibile, scadenzaNoleggio, nomeLettore, `<i class="fa-solid fa-arrow-up" id="${index}"></i>`];
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
            console.log(vett);
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

                let temp = new Libro(vett[0], vett[1], vett[2], vett[3], vett[4], vett[5], vett[7], vett[8]);
                this.catalogoLibri[i] = temp;
                i++;
                tmp = localStorage.getItem('Libro' + (i + 1));
            }
            for (let i = 0; i < this.catalogoLibri.length; i++)
                this.aggiungiRiga(i);
        }
        this.salvaSuFile();


        console.log(this.array);
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

    consegnaLibro(idLibro) {
        let libro = this.catalogoLibri[idLibro];
        console.log(idLibro);
        let nomeLet = libro.nomeLettore;
        let indexTesserato = this.trovaTesserato(nomeLet);

        if (indexTesserato === -1) {
            Swal.fire({
                title: "L'utente non è più presente nel sistema. Procedere lo stesso?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Si',
                denyButtonText: `No`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    this.catalogoLibri[idLibro].consegnaLibro();
                    this.salvaSuFile();
                    Swal.fire('Saved!', '', 'success')
                } else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            })
        }
        else if (indexTesserato === -2) {

        }
        else {
            this.array[indexTesserato].consegnaLibro(libro);
            this.catalogoLibri[idLibro].consegnaLibro();
            this.salvaSuFile();
            Swal.fire({
                title: 'Consegnare questo titolo?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Annulla',
                confirmButtonText: 'Si, consegnalo!'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Consegnato!',
                        "Il libro è nuovamente disponibile nel sistema.",
                        'success'
                    ).then((result) => {
                        if (result.isConfirmed)
                            window.location.href = `catalogoLibri.html`;

                    })
                }
            })
        }

    }

    generaData() {
        let data = new Date();
        let anno = data.getFullYear();
        let mese = (data.getMonth() + 1).toString().padStart(2, '0');
        let giorno = data.getDate().toString().padStart(2, '0');
        return `${anno}/${mese}/${giorno}`;
    }

    trovaTesserato(nomeLettore) {
        for (let i = 0; i < this.array.length; i++) {
            if (`${this.array[i].nome} ${this.array[i].cognome}` === nomeLettore)
                return i;
        }
        if (nomeLettore === "null") {
            return -2;
        }
        return -1;
    }

    clearFile() {
        localStorage.clear();
    }
}