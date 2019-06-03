title: Bad smells
class: animation-fade
layout: true

.bottom-bar[

{{title}}

]

---

class: impact

# {{title}}

## Malos olores

> "El código huele.".
>
> -- **Martin Fowler**.

---

##  Huele a humo

### Método largo
Los métodos pequeños siempre son mejores (nombres fáciles, comprensión, menos código duplicado)

### Clase grande
Demasiadas variables de instancia o métodos
Violando el principio de "responsabilidad única"

### Obsesión por los primitivos (campos básicos sobre utilizados)
Uso excesivo de valores primitivos, en lugar de una mejor abstracción
Se puede extraer en clase separada con validación encapsulada.

---

## Lista larga de parámetros ( in / out / ref)
Puede indicar el estilo de procedimental en lugar de orientado a objetos
Puede ser que el método haga demasiadas cosas.

## Grupos de datos no agrupados
Un conjunto de datos que siempre aparecen juntos, pero no se organizan juntos en ninguna clase o estructura.


---

## Abusones de objetos

### Switch Statements
Se puede sustituir mediante configuración y polimorfismo.

### Campos temporales
Sólo tienen valor en determinadas circunstancias

## Renuncio a la herencia
Las subclases tienen muy poco en común.

## Clases duplicadas
Dos clases hacen lo mismo, sin que seamos conscientes

---

## Obstáculos del cambio

### Cambio divergente
Una clase se cambia comúnmente de diferentes maneras / diferentes razones

### Cirugía con escopeta
Un cambio requiere cambios en muchas clases. Difícil encontrarlos, fácil perderse

### Complejidad condicional
Complejidad ciclomática (número de rutas únicas que el código puede ser evaluado)

---

## Acoplamiento indecente

### Envidia de funcionalidades
Método que parece más interesado en una clase distinta de la suya

### Intimidad inapropiada
Clases que se conocen demasiado

### Mensajes encadenados
Something.Another().SomeOther().Other.YetAnother()

### Intermediario
Si una clase delega todo su trabajo a otra clase, ¿por qué existe?

### La Ley de Demeter (LoD)
Un objeto debe asumir lo menos posible acerca de cualquier otro.

---


- [<- Vuelta al índice ](./)

- [Repo](https://github.com/AcademiaBinaria/CleanCode)
