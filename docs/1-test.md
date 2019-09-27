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


[Adding a feature to a legacy codebase](https://twitter.com/cassidoo/status/1151265157709889536)

- Necesitamos pruebas para limpiar **tranquilos**.
- Haz algún tipo de prueba, pero **¡haz pruebas!**.
- En _front_, mejor empieza por **integración**.

>"[Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)"
>
> -- **Kent C. Dodds**

--

- Los tests **son automáticos**.
- Los tests **deben estar limpios**.

---

## Método RITE

- **R**eadable : legible
- **I**solated/Integrated : aislado/integrado
- **T**horough: completo
- **E**xplicit: explícito


```javascript
describe('sum()', async assert => {
  assert({
    given: 'no arguments',
    should: 'return 0',
    expected: 0,
    actual: sum()
  });
});
```

---

### Si funciona...


![No siempre pruebo mi código... pero cuando lo hago, es en producción](./assets/test-production.jpeg)

![Los hombres de verdad prueban en producción](./assets/real-test.jpg)


---

> - ¿Por qué los desarrolladores temen cambiar su código?
>
> + Porque ¡Tienen miedo a que se rompa!
>
> - ¿Por qué tienen miedo de romperlo?
>
> + Porque no tienen pruebas.
>
> - Si funciona, y tienes pruebas, tócalo.
>
> -- **Robert C. Martin**

- [Siguiente ->](./2-format.html)

- [<- Vuelta al índice ](./)

