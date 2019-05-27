title: 7 - Objects
class: animation-fade
layout: true

.bottom-bar[

{{title}}

]

---

class: impact

# {{title}}

## Abstracciones de lógica

> "La encapsulación es importante.

> Pero la razón por la cual es importante es aún más importante.

> La encapsulación nos ayuda a razonar sobre nuestro código".
>
> -- **Michael C. Feathers**.

---

## Las clases, como las funciones: Pequeñas y Claras

- Los objetos encapsulan la **lógica**.

  - Usan estructuras de datos.

--

- Suelen representar **Actores**.

  - Relacionan unas entidades con otras.

--

# _Interfaces_ mejor que herencia

---

## El tamaño y el pudor


- Reduce la cantidad de métodos públicos

- Decanta métodos privados hacia clases de capas inferiores

- Haz que tus métodos usen tus propiedades, no las de otros

- Haz que tus propiedades sean usadas por tus métodos, no por otros

---

> "Los objetos protegen sus datos detrás de abstracciones y exponen las funciones que operan con esos datos."
>
> -- **Robert C. Martin**

- [Siguiente ->](./8-components.html)

- [<- Vuelta al índice ](./)
