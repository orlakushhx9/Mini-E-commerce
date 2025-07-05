# Mini Ecommerce

Proyecto de Mini Ecommerce para gestión y sorteo de productos, desarrollado por Orlando y Alexis.

---

## Tabla de Actividades y Estado

| Prioridad | Tarea                                                        | Descripción                                                      | Responsable | Estado      |
|-----------|--------------------------------------------------------------|------------------------------------------------------------------|-------------|-------------|
| Alta      | Planeación y organización                                    | Definir actividades, responsables y entregables                  | Orlando     | Completado  |
| Alta      | Definir tecnologías y estructura                             | Elegir stack, estructura de carpetas y dependencias              | Alexis      | Completado  |
| Alta      | Crear y configurar repositorio Git                           | Crear repo, subir archivos iniciales                             | Orlando     | Completado  |
| Alta      | Subir proyecto al repositorio                                | Hacer commit y push de los archivos                              | Orlando     | Completado  |
| Alta      | Desarrollo de funcionalidades principales                    | CRUD productos, carrito, pago, filtros, import/export            | Alexis      | En progreso |
| Media     | Mejorar UI/UX e iconografía                                  | Usar SVGs atractivos, mejorar estilos                            | Alexis      | En progreso |
| Media     | Pruebas y validación                                         | Probar funcionalidades, corregir bugs                            | Ambos       | Pendiente   |
| Media     | Despliegue para presentación                                 | Subir a GitHub Pages o servidor local                            | Orlando     | Pendiente   |
| Baja      | Documentación y README                                       | Redactar README, instrucciones y lista de tareas                 | Orlando     | En progreso |
| Baja      | Video o demo para presentación                               | Grabar o preparar demo para mostrar el proyecto                  | Ambos       | Pendiente   |

---

## Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (puro)
- **Persistencia:** LocalStorage del navegador
- **Sin dependencias externas**

---

## Estructura del Proyecto

```
Mini ecommerce/
  ├── index.html                # Página principal
  ├── pago.html                 # Ventana de pago simulada
  ├── script.js                 # Lógica JS principal
  ├── style.css                 # Estilos CSS
  ├── productos_ejemplo.json    # Archivo de ejemplo para importar productos
  └── README.md                 # Este archivo
```

---

## Funcionalidades Principales

- Registrar, editar y eliminar productos (CRUD)
- Cargar imagen (SVG/base64) y descripción
- Carrito de compras con resumen y total
- Simulación de pago en ventana emergente
- Filtros por categoría, búsqueda y rango de precio
- Exportar/importar productos en formato JSON
- Estadísticas de inventario (total, por categoría, bajo stock, valor total)

---

## Instrucciones de Uso

1. **Clona o descarga el repositorio**
2. Abre `index.html` en tu navegador (no requiere servidor, pero puedes usar Live Server, XAMPP, etc.)
3. Agrega productos, usa el carrito y prueba la simulación de pago
4. Para importar productos, usa el botón de importar y selecciona un archivo JSON (ejemplo: `productos_ejemplo.json`)
5. Para exportar, usa el botón de exportar y descarga el archivo JSON

---

## Validaciones y Mensajes de Error

El sistema muestra mensajes claros al usuario en los siguientes casos:
- Al intentar eliminar un producto: confirmación (`confirm`)
- Al importar productos: alerta si el archivo no es válido o está vacío
- Al intentar pagar con el carrito vacío: alerta
- En el formulario de pago:
  - Número de tarjeta inválido
  - Formato de fecha inválido
  - CVV inválido
  - Nombre del titular inválido
  - No seleccionar tipo de tarjeta
  - Pago exitoso (mensaje de confirmación)
- Al intentar guardar un producto sin completar los campos obligatorios
- Al procesar imágenes con error
- Al importar productos exitosamente o con error de formato

Todos los mensajes se muestran mediante `alert` o `confirm` para asegurar la visibilidad.

---

## Pruebas Sugeridas

- Agregar, editar y eliminar productos
- Agregar productos al carrito y simular pago
- Probar filtros de búsqueda, categoría y precio
- Exportar e importar productos (usando el archivo de ejemplo)
- Validar mensajes de error en los formularios
- Probar en diferentes navegadores (Chrome, Firefox, Edge)

---

## Despliegue para Presentación

- **GitHub Pages:** Sube la carpeta del proyecto y configura la rama principal como página web
- **Servidor local:** Puedes usar XAMPP, Live Server (VSCode) o simplemente abrir `index.html` en el navegador

---

## Demo o Video de Presentación

Para grabar una demo del proyecto, se recomienda:
- Usar [OBS Studio](https://obsproject.com/) (gratis y multiplataforma)
- Alternativas: Screen Recorder de Windows, QuickTime (Mac), extensiones de Chrome
- Mostrar: registro de productos, uso del carrito, simulación de pago, filtros, import/export

---

## Formato de Importación de Productos

El archivo debe ser un array de objetos con la siguiente estructura:

```json
[
  {
    "id": 1,
    "name": "Nombre del producto",
    "price": "Precio",
    "image": "data:image/svg+xml;base64,...",
    "description": "Descripción",
    "stock": 10,
    "category": "Categoría"
  }
]
```
Puedes usar y modificar `productos_ejemplo.json` incluido en el proyecto.

---

## Créditos

- Orlando
- Alexis

---

¡Gracias por usar Mini Ecommerce! Si tienes dudas o sugerencias, abre un issue o contacta a los responsables. 
