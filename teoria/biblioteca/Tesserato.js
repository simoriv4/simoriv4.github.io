class Tesserato{

    // costruttore parametrico
    constructor(nome, cognome, dataNascita, libriNoleggiati )
    {
        this.nome = nome;
        this.cognome = cognome; // formato data da input--> aaaa/mm/gg
        this.dataNascita = dataNascita;
        this.libriNoleggiati = []; 
        this.libriNoleggiati = libriNoleggiati; 

    }

    visualizza()
    {
        // let libri = "";
        // for(let i = 0; i < this.libriNoleggiati.length; i++)
        // {
        //     libri+=this.libriNoleggiati[i] +",";
        // }

        return  this.nome + ";" + this.cognome + ";" + this.dataNascita + ";" + this.libriNoleggiati;
    }
}