if ("geolocation" in navigator) {
    console.log('geolocation avaliable');
    navigator.geolocation.getCurrentPosition(position => {
        let lat, lon; 
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log(lat);
            let link = "/mensen/"+lat+"/"+lon
            document.getElementById("getMensenInRadius").href=link; 
        }); } else {
            console.log('geolocation not avaliable');
        } 
//GO-TO-TOP BUTTON, SRC: https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}