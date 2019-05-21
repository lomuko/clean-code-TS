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

- _Reducir_ el numero de líneas por bloque
- _Reducir_ el anidamiento
- _Reducir_ la complejidad ciclomática (4 - 8)

> Afecta a los `if/else` a los `for` a los `switch`...

---

### Reglas

--

#### Extrema

- Implementar e invocar **una función para cada bloque**.
- _Podría_ dar lugar a funciones de una sola instrucción.

--

#### Razonable

- Una función para cada bloque **si hay más de una instrucción**.
- _Daría_ lugar a bloques de una sola instrucción.

--

#### Mínima

- Una función para cada bloque **si hay más de 4 instrucciones**.
- _Daría_ lugar a bloques pequeños.

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

- [Repo](https://github.com/AcademiaBinaria/CleanCode)

- [Fuente](https://github.com/AcademiaBinaria/CleanCode/tree/master/4-blocks)

- [Game Of Life](./4-blocks/)
