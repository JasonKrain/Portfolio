var menuState = 0;

function Menu() {
    if(menuState == 0) {
        document.getElementById("menu").innerHTML = `
        arrow_forward
        `;
        menuState = 1;
        if(document.getElementById("nav-bar").classList = "") {
          console.log("1");
          document.getElementById("nav-bar").classList.add("nav-button-animation");
        }
        else {
          console.log("2");
          document.getElementById("nav-bar").classList.remove("nav-bar-animation-reverse");
          document.getElementById("nav-bar").classList.add("nav-bar-animation");
        }
    }
    else {
        document.getElementById("menu").innerHTML = `
        menu
        `;
        menuState = 0;
        document.getElementById("nav-bar").classList.remove("nav-bar-animation");
          document.getElementById("nav-bar").classList.add("nav-bar-animation-reverse");
    }
}


document.addEventListener("scroll",function() {
  var height = document.getElementById("intro").scrollHeight;
  // console.log(height);

  var remaining = document.documentElement.scrollTop;
  console.log(remaining);

});