class tabella{
    
    conferma()
    {
        if(document.getElementById("scelta").value == "verdure")
            document.getElementById("tabella").rows[0].innerHTML = '<td><a href="immagini/insalata.png" target="_blank"><img src="immagini/insalata.png" alt="insalata"></a></td>'+'<td><img src="immagini/peperone.png" alt="peperone"></td>'+'<td><img src="immagini/carota.png" alt="carota"></td>';
        else if(document.getElementById("scelta").value == "pizze")
            document.getElementById("tabella").rows[0].innerHTML = '<td><img src="immagini/pizza1.png" alt="pizza1"></td>'+'<td><img src="immagini/pizza2.png" alt="pizza2"></td>'+'<td><img src="immagini/pizza3.png" alt="pizza3"></td>';
        else if(document.getElementById("scelta").value == "hamburger")
            document.getElementById("tabella").rows[0].innerHTML = '<td><img src="immagini/h1.png" alt="h1"></td>'+'<td><img src="immagini/h2.png" alt="h2"></td>'+'<td><img src="immagini/h3.png" alt="h3"></td>';

        document.getElementById("tabella").hidden = false;
    }   
}