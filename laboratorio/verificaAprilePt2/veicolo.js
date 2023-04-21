class veicolo{
    constructor(tipologia, telaio, carburante, potenza){
        // costruttore parametrico
        this.tipologia =tipologia;
        if(telaio != 0)
        {
            let sommaTelaio = parseInt(telaio[0]) +  parseInt(telaio[1]) +  parseInt(telaio[2]) +  parseInt(telaio[3]) +  parseInt(telaio[4]) +  parseInt(telaio[5]) +  parseInt(telaio[6]) +  parseInt(telaio[7]);
            if(sommaTelaio != 40 ||(potenza<= 7 && potenza >=1000))
            {
                document.getElementById("img").hidden = false; // mostro l'errore
                alert("errore nell'inserimento del numero di telaio o dei cavalli! Reinserisci il/i campo/i e riprova.");
                return;
            }
            else
            {
                document.getElementById("img").hidden = true; // nascondo l'errore
            }
        }
        
        this.telaio = telaio;
        this.carburante = carburante;
        this.potenza = potenza;
        this.bollo = 0;
    }

    calcola()
    {
        if(this.potenza >280)
            this.carburante*=2; // se supera i 280 cavalli il carburante raddoppia
        document.getElementById("bollo").innerHTML = this.bollo =parseInt(this.tipologia)+(this.carburante*this.potenza) + " €"; //calcolo il bollo in base alla formula data
    }
}