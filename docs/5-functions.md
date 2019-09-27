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

## Estilo funcional:

- predecibles
- sin dependencias del entorno
- sin efectos secundarios en el entorno

```javascript
var theString = 'gloabal dependency';
function appendStringGlobal(toBeAdded){
    return theString + toBeAdded;
}
function appendStringMutation(toBeAdded){
    original = original + toBeAdded;
}
function appendStringPlus(original, toBeAdded){
    conole.log('I need a console to work');
    return original + toBeAdded;
}
function appendString(original, toBeAdded){
    return original + toBeAdded;
}
```


---

## Métodos en _P.O.O._:

- ### cuantos menos argumentos mejor.

    - especialmente evita argumentos _flag_ usando múltiples funciones específicas

- ### delega en funciones privadas

    - las instrucciones de las funciones públicas deberían ser llamadas a funciones privadas

- ### retornando datos; nunca errores.

    - los errores tienen su propio flujo mediante `try-catch throw`
    - Si el lenguaje no lo permite, usar convenio tipo `(err, data)`.
---

```typescript
class InvoiceGenerator{
    private client;
    private paymentMethod;

    constructor (client){}

    public addLine(line){}
    public addPaymentMethod(paymentMethod){}

    private validateUnits(lineUnits){}
    private validatePaymentMethod(){}
}
```

---

### Objetivo: Muchas Pequeñas Funciones Organizadas

- Una función,

    - ## un sólo propósito.

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
