# SRP

## WarehouseAdministrator

- extraer responsabilidad de procesar pedidos a OrderProcessor
- _shopping cart saver... sin invoiceNumber read write_

# OCP

## DocumentManager

- Prepararse para la posibilidad de nuevos tipos sin modificar la clase
- OrderSender InvoiceSender leídos desde DOCUMENT_TYPES

# LSP

- CountryTaxNode, RegionTaxNode extienden a LocalTaxNode y se usan en TaxCalculator

##

# ISP

## Checker

- Podemos tener una clase que implementa varias interfaces, mientras permitimos que otros obtengan sólo lo que necesitan con implementaciones granulares

# DIP

## CheckOutCalculator

- La factoría puede darnos distintas calculadoras según varíen las funcionalidades y tengamos más implementaciones

# SOLID

## ShoppingCartSaver

