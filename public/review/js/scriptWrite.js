function displayLetter(letterCore,greetingCore,signatureCore){
  document.getElementById("letterSpan").innerHTML = letterCore;
  document.getElementById("greetingSpan").innerHTML = greetingCore;
  document.getElementById("signatureSpan").innerHTML = signatureCore;
}

function displayImage(imgsrc){
  const elem = document.getElementById("imageLetter");
  document.getElementById("imageLetter").src = imgsrc;
  if(imgsrc.length > 0) {
    elem.style.visibility = 'visible';
  } else {
    elem.style.visibility = 'hidden';
  }

}
