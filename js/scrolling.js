const grafico = document.querySelector(".grafico");
const scroller = scrollama();

// Instruções para quando entrar num step
function entrou(resposta) {
  const ordem = resposta.index + 1;

  // Muda para o gráfico correspondente
  grafico.src = `images/grafico_med${ordem}.svg`;
}

function saiu(resposta) {
  if (resposta.index === 0 && resposta.direction === "up") {
    // Muda para o gráfico original
    grafico.src = `images/grafico_med.svg`;
  }
}

// Configura a instância do scrollama e passa funções
scroller
  .setup({
    step: ".step",
  })
  .onStepEnter(entrou)
  .onStepExit(saiu);


window.onscroll = function() {
  var appear = 20
  if (window.pageYOffset >= appear) {
    document.getElementById("grafico").style.opacity = '1'
    document.getElementById("grafico").style.pointerEvents = 'all'
  } else {
    document.getElementById("grafico").style.opacity = '0'
    document.getElementById("grafico").style.pointerEvents = 'none'
  }
}
const percentage = 0.9; // Define a porcentagem do total da página onde começa a escurecer

        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollY = window.scrollY;
            const scrollPercentage = scrollY / totalHeight;
            if (scrollPercentage >= percentage) {
                const darkeningFactor = Math.min(1, (scrollPercentage - percentage) / (1 - percentage));
                const grayValue = Math.floor(255 * (1 - darkeningFactor));
                document.body.style.backgroundColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
            } else {
                document.body.style.backgroundColor = "white"; 
            }
        };

        // Adiciona o evento de scroll
        window.addEventListener("scroll", handleScroll);