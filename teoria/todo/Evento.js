class Evento{

    // costruttore parametrico
    constructor(nomeEvento, dataEvento)
    {
        this.nomeEvento = nomeEvento;
        this.dataEvento = dataEvento;
        this.IsComplete = false;
    }

    getNome()
    {
        return this.nomeEvento;
    }
    getData()
    {
        return this.dataEvento;
    }
    setComplete(c)
    {
        this.IsComplete = c;
    }
    getComplete()
    {
        return this.IsComplete;
    }
    
}