# Labirinto

Gerador e resolvedor de labirintos em JavaScript puro, com um modo de jogo onde
você compete contra o bot para ver quem chega primeiro ao objetivo.

Abra o `index.html` no navegador — não há build nem dependências.

## Funcionalidades

- **Geração automática** com três algoritmos:
  - Backtracker recursivo (DFS) — labirintos sinuosos, com um único caminho longo.
  - Prim aleatório — labirintos mais ramificados, com vários caminhos curtos.
  - Divisão recursiva — divide a área em salas com paredes e aberturas aleatórias.
- **Edição manual** do labirinto com lápis, borracha e marcadores de início/objetivo.
- **Busca de caminho** com A*, com três heurísticas selecionáveis:
  - Euclidiana, Manhattan ou Dijkstra (sem heurística, busca em custo uniforme).
- **Mapa de calor** opcional mostrando o custo (`g`) de cada célula explorada.
- **Modo jogador**: controle um segundo personagem com as setas do teclado e
  compare seu tempo contra o do bot.

## Controles

| Ferramenta | Efeito |
|---|---|
| Lápis | Pinta parede |
| Borracha | Apaga parede |
| Início (Azul) | Define a célula inicial |
| Objetivo (Verde) | Define a célula objetivo |

O tamanho do labirinto é sempre ímpar (5 a 29), já que os algoritmos de geração
escavam células em passos de 2 a partir do canto superior esquerdo.
