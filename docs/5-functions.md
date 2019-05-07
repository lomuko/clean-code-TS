title: 5 - Functions
class: animation-fade
layout: true

.bottom-bar[

{{title}}

]

---

class: impact

# {{title}}

## Pequeñas piezas para organizar programas

> "Una función debería hacer una sola cosa, hacerla bien, y hacerla sólo ella".
>
> -- **Ley de Curly**.

---

### Pequeñas y Claras

- Cuanto más pequeñas más reutilizables.
- Con **verbos** en su nombre que indiquen propósito
- _DRY_: Don´t Repeat yourself.
- ...sin comentarios.

---

### Estilos

- Si NO usas _P.O.O._, entonces usa **funciones puras**:

  - predecibles
  - sin dependencias del entorno
  - sin efectos secundarios en el entorno

--

- Si usas _P.O.O._, entonces cuantos **menos argumentos** mejor.

--

- En todo caso retornando datos; no errores.

  - Si el lenguaje no lo permite, usar convenio.

---

### Objetivo: Muchas Pequeñas Funciones Organizadas

- Una función, un sólo propósito.

  - ... o al menos un mismo nivel de abstracción.

--

> Y ponte **un límite** de instrucciones por función.

--

- Sin comentarios.
  - ¿Me repito?. MAL!!!

---

> "Una función debería hacer una sola cosa, hacerla bien, y hacerla sólo ella".
>
> -- **Ley de Curly**

---

![Don´t repeat Yourself](./assets/dry.jpg)

---

> "La duplicidad es el principal enemigo de un sistema bien diseñado"
>
> -- **Robert C. Martin**

- [Siguiente ->](./6-data.html)

- [<- Vuelta al índice ](./)

- [Repo](https://github.com/AcademiaBinaria/CleanCode)

- [Fuente](https://github.com/AcademiaBinaria/CleanCode/tree/master/5-functions)

- [Game Of Life](./5-functions/)
