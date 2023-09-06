class Tesserati {

    constructor() {
        this.array = []; // array contenente i tesserati
        //this.salvaDaFile();
    }

    infoTesserato(nome, cognome, dataNascita) {
        let isPresente = this.isPresente(nome, cognome, dataNascita);
        if (isPresente !== -1) {
            // visualizzo le info di quell'utente
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Utente non presente nel sistema!',
            })
        }
    }

    isPresente(nome, cognome, dataNascita) {
        for (let i = 0; i < this.array.length; i++) {
            if (nome === this.array[i].nome && cognome === this.array[i].cognome && dataNascita === this.array[i].dataNascita)
                return i;
        }
        return -1;
    }

    aggiungiTesserato(nome, cognome, dataNascita) {
        let tesserato = new Tesserato(nome, cognome, dataNascita, []);
        this.array.push(tesserato);
        this.aggiungiRiga(this.array.length - 1);
        this.salvaSuFile();

    }

    salvaSuFile() {
        this.clearFile();
        //salvo in una stringa gli elementi
        for (let i = 0; i < this.array.length; i++) {
            localStorage.setItem('Tesserato' + (i + 1), this.array[i].visualizza());
        }
    }

    aggiungiRiga(index) {
        var table = $("#myDataTable").DataTable();
        let rowData = [this.array[index].nome, this.array[index].cognome, this.array[index].dataNascita, '<i class="fa-solid fa-trash"></i>'];
        // aggiungo la riga alla tabella
        table.row.add(rowData).draw();
    }
    visualizza() {
        for (let i = 0; i < this.array.length; i++) {

        }
        //elimino le eventuali righe che non servono negli eventi urgenti
        if (this.array.length > this.array.length)
            this.nascondiRigheVuote(array);
    }

    salvaDaFile() {
        this.array = [];
        let i = 0;
        let tmp = localStorage.getItem('Tesserato' + (i + 1));

        while (tmp != undefined) {
            tmp = localStorage.getItem('Tesserato' + (i + 1));
            let vett = tmp.split(';');
            let temp = new Tesserato(vett[0], vett[1], vett[2], vett[3]);
            this.array[i] = temp;
            i++;
            tmp = localStorage.getItem('Tesserato' + (i + 1));
        }

        for (let i = 0; i < this.array.length; i++)
            this.aggiungiRiga(i);

    }

    clearFile() {
        localStorage.clear();
    }




}