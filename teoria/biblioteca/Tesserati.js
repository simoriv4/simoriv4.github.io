class Tesserati {

    constructor() {
        this.array = []; // array contenente i tesserati
    }

    isPresente(nome, cognome, dataNascita) {
        for (let i = 0; i < this.array.length; i++) {
            if (nome === this.array[i].nome && cognome === this.array[i].cognome && dataNascita === this.array[i].dataNascita)
                return i;
        }
        return -1;
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
        //associo all'URL un parametro in modo da accedere alle informazioni in un'altra scheda
        let rowData = ["<a href ='infoTesserato.html?parametro=" + index + "'>" + this.array[index].nome + "</a>", this.array[index].cognome, this.array[index].dataNascita, '<a href ="noleggiaLibri.html?parametro=' + index + '"><i class="fa-solid fa-square-plus"></i></a>', '<i class="fa-solid fa-trash"></i>']; // al cestino corrisponde l'id del tesserato
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