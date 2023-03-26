class tabella{
    
    conferma()
    {
        if(document.getElementById("scelta").value == "verdure")
            document.getElementById("tabella").rows[0].innerHTML = '<td><a href="https://wips.plug.it/cips/buonissimo.org/cms/2013/04/insalate.jpg?w=713&a=c&h=407" target="_blank"><img src="immagini/insalata.png" alt="insalata"></a></td>'+'<td><a href="https://www.my-personaltrainer.it/2022/09/26/peperoni-2_900x760.jpeg" target="_blank"><img src="immagini/peperone.png" alt="peperone"></td>'+'<td><a href="https://www.donnamoderna.com/content/uploads/2018/10/carote-2.jpg" target="_blank"><img src="immagini/carota.png" alt="carota"></a></td>';
        else if(document.getElementById("scelta").value == "pizze")
            document.getElementById("tabella").rows[0].innerHTML = '<td><a href="https://garage.pizza/wp-content/uploads/2020/12/DSCF4572-570x570.jpg" target="_blank"><img src="immagini/pizza1.png" alt="pizza1"></a></td>'+'<td><a href="https://garage.pizza/wp-content/uploads/2020/10/DSCF6160-2560x2560.jpeg" target="_blank"><img src="immagini/pizza2.png" alt="pizza2"></a></td>'+'<td><a href="https://i0.wp.com/www.50toppizza.it/wp-content/uploads/2022/03/Baest-Copenhagen-copia-e1647855168785.jpg?resize=330%2C347&ssl=1" target="_blank"><img src="immagini/pizza3.png" alt="pizza3"></a></td>';
        else if(document.getElementById("scelta").value == "hamburger")
            document.getElementById("tabella").rows[0].innerHTML = '<td><a href="https://www.todis.it/wp-content/uploads/2020/05/giornata-mondiale-dell-hamburger-.jpg" target="_blank"><img src="immagini/h1.png" alt="h1"></a></td>'+'<td><a href="https://cdn.ilclubdellericette.it/wp-content/uploads/2018/02/ricetta-hamburger-640x480.jpg" target="_blank"><img src="immagini/h2.png" alt="h2"></a></td>'+'<td><a href="https://bakeitwithlove.com/wp-content/uploads/2022/01/what-to-serve-with-burgers-sq.jpg" target="_blank"><img src="immagini/h3.png" alt="h3"></a></td>';

        document.getElementById("tabella").hidden = false;
    }   
}