title: 4 - Blocks
class: animation-fade
layout: true

.bottom-bar[

{{title}}

]

---

class: impact

# {{title}}

## Estructuras de control

> "El buen código es su mejor documentación"
>
> -- **Steve McConnell**

---

### Objetivo

- _Reducir_ a **2 o menos niveles de anidamiento**
- _Reducir_ a **4 o menos instrucciones por bloque**
- _Reducir_ a **8 o menos la complejidad ciclomática**

---

```javascript
// life init grid
function life() {
  // touch each grid coord
  for (var x = 0; x < gridWidth; x++) {
    for (var y = 0; y < gridHeight; y++) {
      // counts alive or dead for neighbours
      var count = countNearby(x, y);
      if (grid[x][y] == 0) {
        if (count == 3) {
          // life is born
          gridNext[x][y] = 1;
        }
      } else {
        if (count < 2 || count > 3) {
          // underpopulation & overpopulation
          gridNext[x][y] = 0;
        } else {
          gridNext[x][y] = 1;
        }
      }
    }
  }
  // replace old grid with new population grid
  grid = gridNext;
}
```
---

> Afecta a los `if/else` a los `for` a los `switch`...


> Obliga a extraer código a funciones


> Obliga a nombrar las nuevas funciones


---
``` javascript
function generateNextCellState() {
  for (let column = INIT_COLUMN; column < COLUMNS; column++) {
    for (let row = INIT_ROW; row < ROWS; row++) {
      generateFromCell(column, row);
    }
  }
  cloneToCurrentBoard(board, nextStateBoard);
}
function generateFromCell(column, row) {
  const lifeAround = countLifeAround(column, row);
  if (board[column][row] == DEAD) {
    generateFromDeadCell(lifeAround, column, row);
  } else {
    generateFromLivingCell(lifeAround, column, row);
  }
}
function generateFromDeadCell(lifeAround, column, row) {
  if (lifeAround == REPRODUCTION_POPULATION) {
    nextStateBoard[column][row] = ALIVE;
  }
}
...
```

---

### Consecuencias

- Más **reglas de negocio**
- Menos anidamiento
- **Cero** comentarios

#### Muchas más funciones... y muchos menos comentarios

> Sin comentarios dentro de bloques

---

> "Cada vez que escribas un comentario, debes sentirlo como un fallo de tu capacidad de expresión"
>
> -- **Robert C. Martin**

- [Siguiente ->](./5-functions.html)

- [<- Vuelta al índice ](./)
