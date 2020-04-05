function displayLetter(letterCore,greetingCore,signatureCore){
  document.getElementById("letterSpan").innerHTML = letterCore;
  document.getElementById("greetingSpan").innerHTML = greetingCore;
  document.getElementById("signatureSpan").innerHTML = signatureCore;
}

function displayImage(imgsrc){
  document.getElementById("imageLetter").src = imgsrc;

}
