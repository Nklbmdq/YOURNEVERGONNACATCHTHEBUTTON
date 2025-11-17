const button = document.getElementById('runaway');

// Place button randomly initially
button.style.top = `${window.innerHeight/2}px`;
button.style.left = `${window.innerWidth/2}px`;

// Determine button color based on background brightness
function setButtonColor(){
  const bg = window.getComputedStyle(document.body).backgroundColor;
  // convert rgb to brightness
  const rgb = bg.match(/\d+/g).map(Number);
  const brightness = (rgb[0]*299 + rgb[1]*587 + rgb[2]*114)/1000;
  if(brightness > 128){
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
  } else {
    button.style.backgroundColor = 'white';
    button.style.color = 'black';
  }
}
setButtonColor();

// Runaway logic
document.addEventListener('mousemove', e => {
  const rect = button.getBoundingClientRect();
  const distanceX = e.clientX - (rect.left + rect.width/2);
  const distanceY = e.clientY - (rect.top + rect.height/2);
  const distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);

  // If cursor is close, move button away
  if(distance < 150){
    button.classList.add('legs'); // grow legs

    let newX = rect.left - distanceX/2;
    let newY = rect.top - distanceY/2;

    // keep inside viewport
    newX = Math.max(0, Math.min(window.innerWidth - rect.width, newX));
    newY = Math.max(0, Math.min(window.innerHeight - rect.height, newY));

    button.style.left = `${newX}px`;
    button.style.top = `${newY}px`;
  } else {
    button.classList.remove('legs'); // shrink legs
  }
});

// Optional: resize window safety
window.addEventListener('resize', setButtonColor);
