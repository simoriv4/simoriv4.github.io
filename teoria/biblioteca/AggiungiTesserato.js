class AggiungiTesserato{

    constructor() {
        this.array = []; // array contenente i tesserati
    }

    aggiungiTesserato(nome, cognome, dataNascita, luogoDiNascita, residenza, domicilio) {
        let dataIscrizione = this.getDataCorrente();
        let tesserato = new Tesserato(nome, cognome, dataNascita, [], dataIscrizione, luogoDiNascita, residenza, domicilio);
        alert($("#cognomeTesserato").val() === "");
        // controllo che non esista già
        if ($("#nomeTesserato").val() === "" || $("#cognomeTesserato").val() === "" || $("#dataNascitaTesserato").val() === "" || $("#LuogoNascitaTesserato").val() === "" || $("#residenzaTesserato").val() === "" || $("#domicilioTesserato").val() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Compilare tutti i campi prima di procedere!',
            });
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1500
            });
            this.array.push(tesserato);
            this.salvaSuFile();
        }
    }
    getDataCorrente() {
        let dataAttuale = new Date();
        let anno = dataAttuale.getFullYear();
        let mese = (dataAttuale.getMonth() + 1).toString().padStart(2, '0'); // aggiungo lo zero iniziale se necessario
        let giorno = dataAttuale.getDate().toString().padStart(2, '0'); // aggiungo lo zero iniziale se necessario
        return giorno + '/' + mese + '/' + anno;
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
            let temp = new Tesserato(vett[0], vett[1], vett[2], vett[3]);
            this.array[i] = temp;
            i++;
            tmp = localStorage.getItem('Tesserato' + (i + 1));
        }
    }

    clearFile() {
        localStorage.clear();
    }

}