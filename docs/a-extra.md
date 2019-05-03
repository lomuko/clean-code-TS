title: a - Extra
class: animation-fade
layout: true

.bottom-bar[

{{title}}

]

---

class: impact

# {{title}}

## Errores, excepciones, usuarios y programadores

> "Si la depuración es el proceso de eliminar errores, entonces la programación debe ser el proceso de ponerlos".
>
> -- **E. W. Dijkstra**.

---

### Código excepcionalmente robusto

#### En desarrollo

- **Detección** temprana de errores con herramientas y tests.
- Diferenciar entre lo improbable, lo excepcional y lo **incorrecto**.

--

> "Hay dos maneras de escribir programas sin fallos; sólo funciona la tercera.".
>
> -- **Alan Perlis**.

--

#### En ejecución

- Recuperar mucha información técnica para el **diagnóstico**.
- Pero informar al **usuario** en el tono adecuado.
- Dar una pista para la siguiente **acción**.

---

> [Como escribir buenos mensajes de error](https://uxplanet.org/how-to-write-good-error-messages-858e4551cd4)

![No veo errores](./assets/no-bug.jpg)

> "El código huele.".
>
> -- **Martin Fowler**.

---

#### Detectar y eliminar los Malos Olores

```javascript
try {
  functionThatMightThrow();
} catch (error) {
  // One option (more noisy than console.log):
  console.error(error);
  // Another option:
  notifyUserOfError(error);
  // Another option:
  reportErrorToService(error);
  // OR do all three!
}
```

---

> "Duplication is the primary enemy of a well-designed system"

> ;-)

> ;-)
>
> -- **Robert C. Martin**

- [Siguiente ->](./b-biblio.html)

- [<- Vuelta al índice ](./)

- [Repo](https://github.com/AcademiaBinaria/CleanCode)
