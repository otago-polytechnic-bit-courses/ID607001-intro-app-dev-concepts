let clicks = 0

const onClick = () => {
  clicks += 1;
  document.getElementById("clickCount").innerHTML = `You clicked ${clicks} times`;
}