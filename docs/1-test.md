title: 1-Test
class: animation-fade
layout: true

.bottom-bar[

{{title}}

]

---

class: impact

# {{title}}

## Software que funciona

> "Codifica como si la persona que mantendrá tu código fuera un psicópata violento que sabe dónde vives."
>
> -- **Martin Golding**

---

### Limpiar requiere cambiar por dentro sin cambiar por fuera

- Necesitamos **pruebas** para limpiar tranquilos.
- Haz algún tipo de prueba, pero hazla!.
- En _front_, mejor pruebas de **integración**.

>"[Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)"
>
> -- **Kent C. Dodds**

--

- Los tests **son automáticos**.
- Los tests **deben estar limpios**.

---

## Método RITE

- Readable : legible
- Isolated/Integrated : aislado/integrado
- Thorough: completo
- Explicit: explícito


```javascript
describe('sum()', async assert => {
  assert({
    given: 'no arguments',
    should: 'return 0',
    actual: sum(),
    expected: 0
  });
});
```

---

### Si funciona, y tienes pruebas, tócalo

![No siempre pruebo mi código... pero cuando lo hago, es en producción](./assets/test-production.jpeg)

---

> - ¿Por qué los desarrolladores temen cambiar su código?
>
> + Porque ¡Tienen miedo a que se rompa!
>
> - ¿Por qué tienen miedo de romperlo?
>
> + Porque no tienen pruebas.
>
> -- **Robert C. Martin**

- [Siguiente ->](./2-format.html)

- [<- Vuelta al índice ](./)

