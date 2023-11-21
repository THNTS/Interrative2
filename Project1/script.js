let colorButton = document.getElementById("colorChange");
// let body = document.getElementsByClassName("body")

// function colorSwap () {
    
// }

document.onkeydown = function (event) {
    if (event.key === "Escape") {
        colorButton.click();
    }
  };

colorButton.addEventListener('click', (event) => {
    if (colorButton.classList.contains("hotpink")) {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        colorButton.classList.remove("hotpink");
        document.body.style.backgroundColor = "#" + randomColor;
        colorButton.textContent = "Don't have one"
    } else {
        document.body.style.backgroundColor = "hotpink"; 
        colorButton.classList.add("hotpink");
        colorButton.textContent = "What's my favorite colour?"
    }
});

