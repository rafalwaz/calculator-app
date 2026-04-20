const display = document.querySelector(".display")
const btn = document.querySelectorAll(".btn")

btn.forEach(button => {
    button.addEventListener("click", function (event) {

        const value = event.target.innerText;

        if (value === "C") {
            display.innerText = "";
            document.getElementById("historia-pasek").classList.remove("aktywna");
        } else if (value === "⌫") {
            display.innerText = display.innerText.slice(0, -1);
        } else if (value === "=") {

            let textToCalulate = display.innerText;

            textToCalulate = textToCalulate.replace(/÷/g, "/");
            textToCalulate = textToCalulate.replace(/×/g, "*");

            const wynik = eval(textToCalulate);
            display.innerText = wynik;

            fetch('/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    expression: textToCalulate,
                    result: wynik
                })
            }).then(() => {
                zaktualizujHistorie();
                document.getElementById("historia-pasek").classList.add("aktywna");
            });
        } else {
            const ostatniZnak = display.innerText.slice(-1);
            const operatory = ["+", "-", "×", "÷", "."];
            if (operatory.includes(value) && operatory.includes(ostatniZnak)) {
                display.innerText = display.innerText.slice(0, -1) + value;
            } else {
                display.innerText += value;
            }
        }
    })
});

function zaktualizujHistorie() {
    fetch('/history')
        .then(response => response.json())
        .then(dane => {
            const lista = document.getElementById("history-list");
            lista.innerHTML = "";

            dane.forEach(wiersz => {
                const element_listy = document.createElement("li");
                element_listy.innerText = wiersz.expression + " = " + wiersz.result;
                lista.appendChild(element_listy);
            });
        });
}
zaktualizujHistorie();