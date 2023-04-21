class slot{

    constructor()
    {
        this.slot = ["immagini/1.PNG","immagini/2.PNG","immagini/3.PNG"];
    }

    gira()
    {
        for(let i = 0; i < this.slot.length; i++)
        {
            let random = parseInt(Math.random()*3);
            let random2 = parseInt(Math.random()*3);

            let tmp = this.slot[random];

            this.slot[random] = this.slot[random2];
            this.slot[random2] = tmp;
        }
    }

    ElementAt(index)
    {
        return this.slot[index];
    }
}