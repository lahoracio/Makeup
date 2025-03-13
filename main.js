'use strict'

const maquiagens = [
    {nome: 'batom', icon: 'icone batom.png', cor: 'pink'},
    {nome: 'blush', icon: 'icone blush.png', cor: 'salmon'},
    {nome: 'creme', icon: 'creme.png', cor: 'orange'},
]

function criarMenu(maquiagem){
    const novoItem = document.createElement('li');
    const novaImagem = document.createElement('img');
    const novoSpan = document.createElement('span');
    const lista = document.getElementById('menu');

    novaImagem.src = `./img/${maquiagem.icon}`;
    novoSpan.textContent = maquiagem.nome;

    novoItem.appendChild(novaImagem);
    novoItem.appendChild(novoSpan);
    novoItem.style = `--cor-hover:${maquiagem.cor}`;
    lista.appendChild(novoItem);
}

maquiagens.forEach(criarMenu);

const maquiagens1 = [
    {
        nome: "ILLUMINATOR - NYX",
        descricao: "Ilumine sua pele! O brilho radiante deste iluminador difunde a luz para que sua pele pareça vibrante e revigorada!",
        imagem: "iluminador.webp"
    },
    {
        nome: "BLUSH PALLETE - NYX",
        descricao: "Esta coleção apresenta oito cores pigmentadas e suaves que combinam perfeitamente com qualquer tom de pele!",
        imagem: "blush.webp"
    },
];

function criarCard(maquiagem){
    const sitemaquiagens = document.getElementById('produtos');

    //estrutura do card
    const maquiagemWrapper = document.createElement('div');
    maquiagemWrapper.classList.add('wrapper');

    const maquiagemDiv = document.createElement('div');
    maquiagemDiv.classList.add('Card');

    // Imagem
    const imagemMaquiagem = document.createElement('img');
    imagemMaquiagem.src = `./img/${maquiagem.imagem}`;
    imagemMaquiagem.alt = maquiagem.nome;

    //container de informações
    const maquiagemInfoDiv = document.createElement('div');

    const nomeMaquiagem = document.createElement('h2');
    nomeMaquiagem.textContent = maquiagem.nome;

    const descricaoMaquiagem = document.createElement('p');
    descricaoMaquiagem.textContent = maquiagem.descricao;

    //botão de compra
    const botaoComprar = document.createElement('button');
    botaoComprar.classList.add('compras');
    botaoComprar.textContent = 'COMPRAR';

  //estrutura do card
    maquiagemInfoDiv.appendChild(nomeMaquiagem);
    maquiagemInfoDiv.appendChild(descricaoMaquiagem);
    maquiagemInfoDiv.appendChild(botaoComprar);

    maquiagemDiv.appendChild(imagemMaquiagem);
    maquiagemDiv.appendChild(maquiagemInfoDiv);

    maquiagemWrapper.appendChild(maquiagemDiv);
    sitemaquiagens.appendChild(maquiagemWrapper);
}


maquiagens1.forEach(criarCard);


