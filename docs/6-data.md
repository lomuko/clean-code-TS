title: 6 - Data
class: animation-fade
layout: true

.bottom-bar[

{{title}}

]

---

class: impact

# {{title}}

## Abstracciones de información

> "Los malos programadores se preocupan por el código.

> Los buenos se preocupan por las estructuras de datos y sus relaciones".
>
> -- **Linus Torvalds**.

---

### Estructuras de DATOS

- Sin comportamiento de negocio
- ## Poca o ninguna función

--

- **Cohesionan** variables relacionadas
- ## Reducen argumentos en funciones

--

- ### Suelen tener nombres de **Entidades**

--

# _Composición_ mejor que ~~herencia~~

---

```typescript
class Client{
  private name: string;
  private address: Address;
  private legalAdress: Address;
  constructor (){}
}
class Provider{
  private name: string;
  private address: Address;
  private legalAdress: Address;
  private paymentInfo: Payment;
  constructor (){}
}
class Employee{
  private name: string;
  private address: Address;
  private paymentInfo: Payment;
  constructor (){}
}
```

---

## Usar estructuras para evitar _if_ y _switch_

- [Contra el switch](https://dev.to/jckuhl/a-case-against-switches-13pd)

---

```typescript
function getClientIcon(client){
  if(client.isVIP){
    return 'vip.jpg';
  } else {
    return 'standard.jpg';
  }
}

const clientIcons = {
  'true': 'vip.jpg',
  'false': 'standard.jpg'
}
function getClientIcon(client){
  return clientIcons[client.isVIP];
}
```

---


```typescript
function getClientDiscount(client, amount){
  if( amount > 50){
    return amount * 2;
  } else {
    return amount + 3;
  }
}

const clientDiscount = {
  'true': x => x * 2,
  'false': x => x + 3
}
function getClientDiscount(client, amount){
  return clientDiscount[amount>50](amount);
}
```

---

![Estructuras de datos por todas partes](./assets/data-everywhere.jpg)

---

> "La estructura de datos expone sus propiedades y no tiene funciones significativas"
>
> -- **Robert C. Martin**

- [Siguiente ->](./7-objects.html)

- [<- Vuelta al índice ](./)

