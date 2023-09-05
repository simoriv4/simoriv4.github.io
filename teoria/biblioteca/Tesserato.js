class Libro{

    // costruttore parametrico
    constructor(titolo, dataNoleggio, iscomplete)
    {
        this.titolo = titolo;
        this.dataNoleggio = dataNoleggio; // formato data da input--> aaaa/mm/gg
        this.IsComplete = iscomplete;
        this.dataConsegna = generateDate(dataNoleggio);
    }

    generateDate(dataNoleggio)
    {
        let data = new Date(dataNoleggio);
       // data.setDate(data.getDate() +  30)
    }
    posticipaConsegna()
    {
        // posticipa di un mese la consegna
//        this.dataNoleggio
    }

    visualizza()
    {
        return this.titolo+";"+this.dataNoleggio + ";" + this.IsComplete;
    }
    
}