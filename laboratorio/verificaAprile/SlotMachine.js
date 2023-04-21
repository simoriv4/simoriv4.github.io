class SlotMachine{

    constructor()
    {
        this.slot1 = new slot();
        this.slot2 = new slot();
        this.slot3 = new slot();
        this.slot4 = new slot();

        this.crediti= 100;
    }

    spin(puntata)
    {
        this.gira(puntata)

    }
    gira(puntata)
    {
        this.slot1.gira();
        this.slot2.gira();
        this.slot3.gira();
        this.slot4.gira();

        document.getElementById("img1").src= this.slot1.ElementAt(0);
        document.getElementById("img2").src= this.slot2.ElementAt(0);
        document.getElementById("img3").src= this.slot3.ElementAt(0);
        document.getElementById("img4").src= this.slot4.ElementAt(0);

        this.calcola(puntata);
        document.getElementById("crediti").innerHTML = "crediti: " + this.crediti;

    }
    calcola(puntata)
    {
        if(document.getElementById("img1").src == document.getElementById("img2").src && document.getElementById("img1").src == document.getElementById("img3").src && document.getElementById("img1").src ==document.getElementById("img4").src)
        {
            this.crediti += puntata*10;
        }
        if((document.getElementById("img1").src == document.getElementById("img2").src && document.getElementById("img1").src == document.getElementById("img3").src && document.getElementById("img1").src !=document.getElementById("img4").src) || (document.getElementById("img1").src != document.getElementById("img2").src && document.getElementById("img2").src == document.getElementById("img3").src && document.getElementById("img2").src ==document.getElementById("img4").src)||(document.getElementById("img1").src != document.getElementById("img2").src && document.getElementById("img1").src == document.getElementById("img3").src && document.getElementById("img1").src ==document.getElementById("img4").src) ||(document.getElementById("img1").src == document.getElementById("img2").src && document.getElementById("img1").src != document.getElementById("img3").src && document.getElementById("img1").src ==document.getElementById("img4").src))
        {
            this.crediti += puntata*5;
        }
    }

    reset()
    {
        document.getElementById("img1").src= "immagini/1.PNG";
        document.getElementById("img2").src= "immagini/1.PNG";
        document.getElementById("img3").src= "immagini/1.PNG";
        document.getElementById("img4").src= "immagini/1.PNG";

        this.crediti = 100;
    }
}