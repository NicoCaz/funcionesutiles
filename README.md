# Documentación Detallada de commonUtils.js

## 1. jsBindearTabla(tbodyId, trId, jsonData, options = {})

```javascript
function jsBindearTabla(tbodyId, trId, jsonData, options = {})
```

### Propósito
Vincula (bindea) datos en formato JSON a una tabla HTML, creando filas dinámicamente basadas en un template.

### Parámetros
- `tbodyId`: ID del elemento tbody donde se insertarán las filas
- `trId`: ID de la fila template que se usará como base
- `jsonData`: Datos en formato JSON que se vincularán a la tabla
- `options`: Objeto de configuración opcional (por ejemplo, {saveSource: true})

### Funcionamiento Paso a Paso
1. Obtiene referencias a los elementos DOM necesarios
2. Limpia el contenido existente en la tabla
3. Convierte los datos a array si no lo son
4. Por cada elemento en los datos:
   - Clona la fila template
   - Asigna un ID único
   - Hace visible la fila
   - Vincula los datos a las celdas según el atributo dataFld
5. Opcionalmente guarda los datos fuente en un atributo de la tabla

### Ejemplo de Uso
```javascript
const datos = [
    { nombre: "Juan", edad: 30 },
    { nombre: "María", edad: 25 }
];

jsBindearTabla('tbListado', 'trListado', datos, { saveSource: true });
```

## 2. createTableObserver(tableId, callback)

### Propósito
Crea un observador que detecta cambios en una tabla HTML específica.

### Parámetros
- `tableId`: ID de la tabla a observar
- `callback`: Función que se ejecutará cuando se detecten cambios

### Funcionamiento
1. Obtiene referencia a la tabla
2. Crea un MutationObserver
3. Configura la observación para detectar:
   - Cambios en hijos (childList)
   - Cambios en subárboles (subtree)
   - Cambios en atributos

### Ejemplo de Uso
```javascript
createTableObserver('miTabla', (mutations, table) => {
    console.log('La tabla ha sido modificada');
});
```

## 3. xmlToJson(xmlString) y jsonToXml(jsonObj)

### Propósito
Funciones de conversión entre formatos XML y JSON.

### Parámetros
- `xmlString`: String en formato XML
- `jsonObj`: Objeto JavaScript/JSON

### Funcionamiento
- Utilizan la biblioteca X2JS
- Incluyen manejo de errores
- Retornan null en caso de error

### Ejemplo de Uso
```javascript
const jsonData = xmlToJson('<root><item>valor</item></root>');
const xmlString = jsonToXml({root: {item: 'valor'}});
```

## 4. formatDate(date)

### Propósito
Formatea una fecha al formato dd/MM/yyyy requerido por la aplicación.

### Parámetros
- `date`: Objeto Date o string de fecha

### Funcionamiento
1. Convierte el input a objeto Date
2. Extrae día, mes y año
3. Agrega ceros iniciales donde sea necesario
4. Retorna la fecha formateada

### Ejemplo de Uso
```javascript
const fechaFormateada = formatDate(new Date()); // Returns "14/11/2024"
```

## 5. openModal(url, width, height)

### Propósito
Abre una ventana modal compatible con Chrome.

### Parámetros
- `url`: URL a cargar en el modal
- `width`: Ancho de la ventana (default: 800)
- `height`: Alto de la ventana (default: 600)

### Funcionamiento
1. Calcula la posición central en la pantalla
2. Configura opciones de la ventana
3. Abre la ventana con window.open()
4. Retorna referencia a la ventana

### Ejemplo de Uso
```javascript
const modalWindow = openModal('formulario.aspx', 1024, 768);
```

## 6. validateElement(elementId)

### Propósito
Valida la existencia de un elemento DOM antes de su manipulación.

### Parámetros
- `elementId`: ID del elemento a validar

### Funcionamiento
1. Intenta obtener el elemento
2. Registra error si no existe
3. Retorna el elemento o null

### Ejemplo de Uso
```javascript
const elemento = validateElement('miBoton');
if (elemento) {
    elemento.disabled = true;
}
```

## 7. handleError(error, context)

### Propósito
Maneja errores de manera consistente en toda la aplicación.

### Parámetros
- `error`: Objeto Error o mensaje de error
- `context`: String describiendo dónde ocurrió el error

### Funcionamiento
1. Registra el error en consola
2. Puede expandirse para incluir:
   - Logging a servidor
   - Notificaciones al usuario
   - Métricas de error

### Ejemplo de Uso
```javascript
try {
    // código que puede fallar
} catch (error) {
    handleError(error, 'Procesamiento de datos');
}
```

## 8. fetchData(url, params)

### Propósito
Realiza peticiones HTTP estandarizadas al servidor.

### Parámetros
- `url`: Endpoint a consultar
- `params`: Objeto con parámetros de la consulta

### Funcionamiento
1. Configura la petición POST
2. Envía los datos como JSON
3. Valida la respuesta
4. Maneja errores consistentemente
5. Retorna datos procesados

### Ejemplo de Uso
```javascript
async function obtenerDatos() {
    try {
        const datos = await fetchData('/api/datos', { id: 123 });
        return datos;
    } catch (error) {
        handleError(error, 'obtenerDatos');
    }
}
```

## Consideraciones de Implementación


### Orden de Carga
1. Cargar dependencias externas
2. Cargar commonUtils.js
3. Cargar scripts específicos de la página

### Manejo de Errores
Todas las funciones incluyen:
- Try-catch
- Logging consistente
- Valores de retorno seguros
- Validaciones de parámetros

### Compatibilidad
- Diseñado para Chrome
- Evita características obsoletas
- Usa ES6+ con consideración de compatibilidad

### Rendimiento
- Minimiza accesos al DOM
- Reutiliza referencias
- Implementa debouncing donde es necesario
