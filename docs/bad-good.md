title: Bad Good
class: animation-fade
layout: true

.bottom-bar[

{{title}}

]

---

class: impact

# {{title}}

## Malos olores y Buenas prácticas

> "El código huele.".
>
> -- **Martin Fowler**.

---

##  Huele a humo

### Método largo.

- Los métodos pequeños siempre son mejores (nombres fáciles, comprensión, menos código duplicado).

### Clase grande.

- Demasiadas variables de instancia o métodos. Viola el principio de "responsabilidad única".

### Obsesión por los primitivos.

- Uso excesivo de valores primitivos en lugar de una mejor abstracción en una clase, una interfaz o una estructura separada.

---

### Lista larga de parámetros ( in / out / ref).

- Propio del estilo procedimental en lugar de orientado a objetos. Puede ser que el método haga **demasiadas** cosas.

### Grupos de datos no agrupados.

- Un conjunto de datos que siempre aparecen juntos... pero que no se organizan juntos en ninguna clase o estructura.

---

## Abusones de objetos

### Switch statements.

- Se puede sustituir mediante datos de configuración y polimorfismo.

### Campos temporales.

- Sólo tienen valor en determinadas circunstancias.

### Renuncio a la herencia.

- Las subclases tienen muy poco en común.

### Clases duplicadas.

- Dos clases hacen lo mismo... sin que seamos conscientes.

---

## Obstáculos del cambio

### Cambio divergente.

- Una clase se cambia comúnmente de diferentes maneras o por diferentes razones.

### Cirugía con escopeta

- Un cambio requiere cambios en muchas clases. Difícil encontrarlos, fácil perderse.

### Complejidad ciclomática.

- Número de rutas únicas que aumenta con el anidamiento, los _switches_ y las condiciones complejas.

---

## Acoplamiento indecente

### Envidia de funcionalidades.

- Método que parece más interesado en una clase distinta de la suya.

### Intimidad inapropiada

- Clases que se conocen demasiado.

### Mensajes encadenados

- Something.Another().SomeOther().Other.YetAnother();

### Intermediario

- Si una clase delega todo su trabajo a otra clase, ¿por qué existe?.


---


## Otros principios para un final feliz

###  POLA: Principle Of Least Astonishment.

- No me sorprendas, no me hagas pensar.

###  YAGNI: You aren't gonna need it.

- Implementa cosas cuando las necesites, no cuando preveas que las necesitas.

### HP: Hollywood principle.

- No nos llames, ya te llamaremos. Inversión del control.

### TDA: Tell don’t ask principle.

- Decirle a los objetos lo que quieres que hagan (método con datos propios), no consultarles y actuar con sus datos después.

---

### CQS: Command–query separation.

- Cada método debe ser o un comando que realice una acción o una consulta que devuelva datos; **pero no ambos**.

### CoC: Convention over configuration.

- Establecer y cumplir convenios que minimicen la cantidad de decisiones necesarias.

### La Ley de Demeter (LoD)

- Un objeto debe asumir lo menos posible acerca de cualquier otro.

### Composite reuse principle

- Mejor componer que heredar.

---

### DRY: Don't repeat yourself.

- Cada regla o atributo debe tener **una representación única e inequívoca** dentro de un sistema.

### KISS: Keep it simple, Stupid!

- La simplicidad es un objetivo para evitar la complejidad **innecesaria**.


- [<- Vuelta al índice ](./)

- [Repo](https://github.com/AcademiaBinaria/CleanCode)
