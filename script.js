var menuState = 0;

function Menu() {
    let elem = document.getElementById("nav-button");
    let pos = 0;
    if(menuState == 0) {
        document.getElementById("menu").innerHTML = `
        arrow_forward
        `;
        menuState = 1;
        clearInterval(id);
        id = setInterval(frame(), 10);
    }
    else {
        document.getElementById("menu").innerHTML = `
        menu
        `;
        menuState = 0;
        clearInterval(id);
        id = setInterval(frame(), 10);
    }
}

function frame() {
    if (pos == -300) {
      clearInterval(id);
    } else {
      pos--; 
      elem.style.top = pos + 'px'; 
      elem.style.left = pos + 'px'; 
    }
}