# SRP

## WarehouseAdministrator

- extraer responsabilidad de procesar pedidos a OrderProcessor

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

## Logger

