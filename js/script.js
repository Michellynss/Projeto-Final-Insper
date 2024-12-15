document.addEventListener('DOMContentLoaded', () => {
    const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Vertices = Matter.Vertices,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint,
        Events = Matter.Events; 

    const engine = Engine.create();
    const world = engine.world;
    const renderWidth = 250;
    const renderHeight = 400;

    // Selecionando o SVG
    const svg = document.getElementById('package-svg');

    // Criando o renderizador
    const render = Render.create({
        element: svg.parentElement,
        engine: engine,
        options: {
            width: renderWidth,
            height: renderHeight,
            wireframes: false,
            background: 'transparent',
        }
    });

    render.canvas.classList.add('matter-canvas');
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);
    runner.isFixed = true;
    runner.delta = 1000 / 120;

    // Criando as paredes arredondadas
    const createRoundedBoundary = (x, y, width, height, cornerRadius, options) => {
        const boundary = Composite.create();
        const center = Bodies.rectangle(x, y, width - 2 * cornerRadius, height, options);
        const topLeft = Bodies.circle(x - (width - 2 * cornerRadius) / 2, y - height / 2, cornerRadius, options);
        const topRight = Bodies.circle(x + (width - 2 * cornerRadius) / 2, y - height / 2, cornerRadius, options);
        const bottomLeft = Bodies.circle(x - (width - 2 * cornerRadius) / 2, y + height / 2, cornerRadius, options);
        const bottomRight = Bodies.circle(x + (width - 2 * cornerRadius) / 2, y + height / 2, cornerRadius, options);
        Composite.add(boundary, [center, topLeft, topRight, bottomLeft, bottomRight]);
        return boundary;
    };

    // Criando as paredes do pote
    const boundaries = [
        createRoundedBoundary(renderWidth / 2, 5, renderWidth + 60, 200, 30, { isStatic: true, render: { visible: false } }), // Superior
        createRoundedBoundary(renderWidth / 2, renderHeight + 10, renderWidth, 60, 20, { isStatic: true, render: { visible: false } }), // Inferior
        createRoundedBoundary(-10, renderHeight / 2, 75, renderHeight, 15, { isStatic: true, render: { visible: false } }),  // Esquerda
        createRoundedBoundary(renderWidth + 10, renderHeight / 2, 75, renderHeight, 15, { isStatic: true, render: { visible: false } })  // Direita
    ];

    Composite.add(world, boundaries);

    // Função para criar as bolinhas
    function createCircle(x, y, radius, color, pillClass) {
        const circle = Bodies.circle(x, y, radius, {
            restitution: 0.5,
            friction: 0.3,
            frictionStatic: 1,
            density: 0.001,
            render: {
                fillStyle: color, 
                strokeStyle: 'white', 
                lineWidth: 1, 
            },
            label: pillClass,
            sleepThreshold: 60,
        });

        Composite.add(world, circle);
        return circle;
    }

    // De a linha da pilula
    Events.on(render, 'afterRender', function () {
        const context = render.context;
        for (const body of Composite.allBodies(world)) {
            if (body.circleRadius) {
                const { x, y } = body.position;
                const angle = body.angle;
                const r = body.circleRadius;
                context.save();
                context.translate(x, y);
                context.rotate(angle);
                context.beginPath();
                context.moveTo(-r + 2, 0); // Início da linha
                context.lineTo(r - 2, 0); // Fim da linha
                context.lineWidth =0.9;
                context.strokeStyle = 'wite';
                context.stroke();
                context.restore();
            }
        }
    });

    // Função para gerar bolinhas de várias cores
    function generatePillsByColor(color, pillClass, count, radius) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * (renderWidth - 50) + 25;
            const y = Math.random() * (renderHeight - 200) + 100;
            createCircle(x, y, radius, color, pillClass);
        }
    }
    generatePillsByColor('#83CD20', 'pill1', 46, 10);
    generatePillsByColor('#FFAE00', 'pill2', 37, 10);
    generatePillsByColor('#3AD4FF', 'pill3', 23, 10);
    generatePillsByColor('#FF7A59', 'pill4', 18, 10);


    // Controle de mouse
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false },
        },
    });
    Composite.add(world, mouseConstraint);

    render.mouse = mouse;

    // Ajustando visualização
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: renderWidth, y: renderHeight },
    });

    // Função para filtrar as bolinhas no Matter.js
let activeButton = null; 

function filterPills(pillClass) {
    if (activeButton === pillClass) {
        Composite.allBodies(world).forEach(body => {
            if (body.label.startsWith('pill')) {
                body.render.opacity = 1;
            }
        });
        activeButton = null; 
    } else {
       
        Composite.allBodies(world).forEach(body => {
            if (body.label === pillClass) {
                body.render.opacity = 1; 
            } else if (body.label.startsWith('pill')) {
                body.render.opacity = 0; 
            }
        });
        activeButton = pillClass;
    }
}

    // Eventos de Botões
document.getElementById('btn-pills1').addEventListener('click', function() {
    if (activeButton === 'pill1') {
        filterPills('pill1'); 
    } else {
        filterPills('pill1');
        showMessage('text-pills1');
        this.style.backgroundColor = "#83CD20";
        this.style.border = "#83CD20";
    }
});

document.getElementById('btn-pills2').addEventListener('click', function() {
    if (activeButton === 'pill2') {
        filterPills('pill2');
    } else {
        filterPills('pill2');
        showMessage('text-pills2');
        this.style.backgroundColor = "#FFAE00";
        this.style.border = "#FFAE00";
    }
});

document.getElementById('btn-pills3').addEventListener('click', function() {
    if (activeButton === 'pill3') {
        filterPills('pill3');
    } else {
        filterPills('pill3');
        showMessage('text-pills3');
        this.style.backgroundColor = "#3AD4FF";
        this.style.border = "#3AD4FF";
    }
});

document.getElementById('btn-pills4').addEventListener('click', function() {
    if (activeButton === 'pill4') {
        filterPills('pill4');
    } else {
        filterPills('pill4');
        showMessage('text-pills4');
        this.style.backgroundColor = "#FF7A59";
        this.style.border = "#FF7A59";
    }
});

});
const buttons = document.querySelectorAll('.filter-btn');


function resetAllButtons() {
            buttons.forEach(button => {
                button.classList.remove('active');
                button.style.backgroundColor = '#FFFFFF';
                button.style.border = '2px solid #012D20';
                button.style.color = '#012D20'
			});}

buttons.forEach(button => {
    button.addEventListener('click', function() {
    resetAllButtons();
    this.classList.add('active');
    hideAllMessages(); 
    
const correspondingMessage = document.getElementById(`text-${this.id}`);
    if (correspondingMessage) {correspondingMessage.style.display = 'block'; }});});

function hideAllMessages() {const messages = document.querySelectorAll('.message');
    messages.forEach(message => message.style.display = 'none');}
            
function showMessage(messageId) {hideAllMessages();
        document.getElementById(messageId).style.display = 'block';}
