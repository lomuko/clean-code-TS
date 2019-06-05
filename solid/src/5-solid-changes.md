# SRP

## `WarehouseAdministrator`

- Extraer responsabilidad de procesar pedidos a `OrderProcessor`


# OCP

## `DocumentManager`

- Prepararse para la posibilidad de nuevos tipos sin modificar la clase
- `OrderSender` `InvoiceSender` leídos desde `DOCUMENT_TYPES`

# LSP

## `TaxCalculator`

- `CountryTaxNode`, `RegionTaxNode` extienden a `LocalTaxNode` y se usan en `TaxCalculator`


# ISP

## `Checker`

- Podemos tener una clase que implementa varias interfaces (`IFindSafe`, `IHasContent` ), mientras permitimos que otros(`ShoppingCartSaver`) obtengan sólo lo que necesitan con implementaciones granulares.

# DIP

## `CheckOutCalculator`

- La factoría `CalculateCheckOutFactory` puede darnos distintas calculadoras según varíen las funcionalidades y tengamos más implementaciones

- `ShoppingCartManager` depende ahora de una abstracción (`ICalculateCheckOut`), y no de una implementación de menor nivel


# SOLID

_Caso de estudio completo para resolver como práctica_

## `ShoppingCartSaver`