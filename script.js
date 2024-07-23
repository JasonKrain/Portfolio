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


// Scroll listener for scroll tied animations + effects

document.addEventListener("scroll",function() {
  // console.log(height);

  var remaining = document.documentElement.scrollTop;
  // console.log(remaining);
  
  var introHeight = document.getElementById("intro").scrollHeight;  
  var transitionHeight = document.getElementById("transition-section").scrollHeight;
  var height = remaining - introHeight;
  var opacity = (height / transitionHeight) * 1;

// test
  console.log("-------------------------------------------------")
  console.log("introHeight:" , introHeight);
  console.log("transitionHeight:", transitionHeight);
  console.log("heigh:", height);
  console.log("opacity:", opacity);
  
  if(opacity < 0) {
    opacity = 0;
  }



  // var transitionImage = document.getElementById("transition-image");
  // var transitionImageOpacity = window.getComputedStyle(transitionImage).getPropertyValue("opacity")
  // var transitionImageOpacity = document.getElementById("transition-image").style.opacity;

  // console.log("transitionImageOpacity:", transitionImageOpacity);

  if(!(height< 0)){
    document.getElementById("transition-image").style.opacity = opacity;
  }
});