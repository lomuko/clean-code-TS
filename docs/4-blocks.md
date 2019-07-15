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

- _Reducir_ el numero de instrucciones por bloque a 4
- _Reducir_ el anidamiento a 2 niveles
- _Reducir_ la complejidad ciclomática (ideal: 4 - máxima:8)

> Afecta a los `if/else` a los `for` a los `switch`...

---

### Reglas

--

#### Absurda

- Implementar e invocar **una función para cada bloque**.
- _Podría_ dar lugar a funciones de una sola instrucción.

--

#### Extrema

- Una función para cada bloque **si hay más de una instrucción**.
- _Daría_ lugar a bloques de una sola instrucción.

--

#### Razonable

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
