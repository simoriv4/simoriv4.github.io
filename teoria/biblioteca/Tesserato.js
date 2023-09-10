class Tesserato {

    // costruttore parametrico
    constructor(nome, cognome, dataNascita, libriNoleggiati, dataIscrizione, luogoDiNascita, residenza, domicilio) {
        this.nome = nome;
        this.cognome = cognome; // formato data da input--> aaaa/mm/gg
        this.dataNascita = dataNascita;
        this.luogoDiNascita = luogoDiNascita;
        this.dataIscrizione = dataIscrizione;
        this.residenza = residenza;
        this.domicilio = domicilio;
        this.libriNoleggiati = libriNoleggiati || []; // se non viene passato alcun valore gli assegna un array vuoto

    }

    noleggiaLibro(libro)
    {
        console.log(libro);

        console.log(this.libriNoleggiati);
        this.libriNoleggiati.push(libro.titolo);
        console.log(this.libriNoleggiati[0].titolo);
    }

    consegnaLibro(libro)
    {
        console.log(libro);

        console.log(this.libriNoleggiati);
        let index = this.libriNoleggiati.indexOf(libro.titolo);
        this.libriNoleggiati.splice(index, 1);
    }


    visualizza() {
        return `${this.nome};${this.cognome};${this.dataNascita};${this.libriNoleggiati};${this.dataIscrizione};${this.luogoDiNascita};${this.residenza};${this.domicilio}`; // la join divide gli elementi di un array separandoli con il carattere specificato
    }
}