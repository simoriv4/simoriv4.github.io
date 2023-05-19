class Evento{

    // costruttore parametrico
    constructor(nomeEvento, dataEvento, iscomplete)
    {
        this.nomeEvento = nomeEvento;
        this.dataEvento = dataEvento; // formato data da input--> aaaa/mm/gg
        this.IsComplete = iscomplete;
    }

    visualizza()
    {
        return this.nomeEvento+";"+this.dataEvento + ";" + this.IsComplete;
    }
    
}