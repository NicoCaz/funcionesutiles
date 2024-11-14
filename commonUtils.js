// commonUtils.js - Utilidades comunes para la migración de BCSAWebApp

/**
 * Bindea datos JSON a una tabla HTML
 * @param {string} tbodyId - ID del tbody
 * @param {string} trId - ID del tr template
 * @param {Object|Array} jsonData - Datos a bindear
 * @param {Object} options - Opciones adicionales de configuración
 */
function jsBindearTabla(tbodyId, trId, jsonData, options = {}) {
    try {
        const tbody = document.getElementById(tbodyId);
        const trTemplate = document.getElementById(trId);
        
        if (!tbody || !trTemplate) {
            console.error('No se encontraron los elementos necesarios para bindear la tabla');
            return;
        }

        // Limpiar tabla existente
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        // Asegurar que jsonData sea un array
        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
        
        dataArray.forEach((item, index) => {
            const newRow = trTemplate.cloneNode(true);
            newRow.id = `${trId}_${index}`;
            newRow.style.display = '';
            
            // Bindear datos a las celdas
            Array.from(newRow.cells).forEach(cell => {
                const dataField = cell.getAttribute('dataFld');
                if (dataField && item[dataField] !== undefined) {
                    cell.innerHTML = item[dataField];
                }
            });

            tbody.appendChild(newRow);
        });

        // Guardar source data si se especifica
        if (options.saveSource) {
            tbody.setAttribute('source', JSON.stringify(jsonData));
        }
    } catch (error) {
        console.error('Error al bindear tabla:', error);
    }
}

/**
 * Observador para cambios en tablas
 * @param {string} tableId - ID de la tabla a observar
 * @param {Function} callback - Función a ejecutar cuando hay cambios
 */
function createTableObserver(tableId, callback) {
    const targetNode = document.getElementById(tableId);
    if (!targetNode) {
        console.error('Tabla no encontrada:', tableId);
        return;
    }

    const observer = new MutationObserver((mutations) => {
        callback(mutations, targetNode);
    });

    observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: true
    });

    return observer;
}

/**
 * Convierte XML a JSON
 * @param {string} xmlString - String XML a convertir
 * @returns {Object} - Objeto JSON resultante
 */
function xmlToJson(xmlString) {
    try {
        const x2js = new X2JS();
        return x2js.xml_str2json(xmlString);
    } catch (error) {
        console.error('Error al convertir XML a JSON:', error);
        return null;
    }
}

/**
 * Convierte JSON a XML
 * @param {Object} jsonObj - Objeto JSON a convertir
 * @returns {string} - String XML resultante
 */
function jsonToXml(jsonObj) {
    try {
        const x2js = new X2JS();
        return x2js.json2xml_str(jsonObj);
    } catch (error) {
        console.error('Error al convertir JSON a XML:', error);
        return null;
    }
}

/**
 * Formatea una fecha al formato dd/MM/yyyy
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
function formatDate(date) {
    try {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return '';
    }
}

/**
 * Abre un modal compatible con Chrome
 * @param {string} url - URL a abrir
 * @param {number} width - Ancho de la ventana
 * @param {number} height - Alto de la ventana
 * @returns {Window} - Referencia a la ventana abierta
 */
function openModal(url, width = 800, height = 600) {
    try {
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        
        return window.open(url, '_blank', 
            `width=${width},height=${height},left=${left},top=${top},` +
            'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes'
        );
    } catch (error) {
        console.error('Error al abrir modal:', error);
        return null;
    }
}

/**
 * Valida un elemento antes de manipularlo
 * @param {string} elementId - ID del elemento a validar
 * @returns {HTMLElement|null} - Elemento HTML o null si no existe
 */
function validateElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Elemento no encontrado: ${elementId}`);
        return null;
    }
    return element;
}

/**
 * Maneja errores de manera consistente
 * @param {Error} error - Error a manejar
 * @param {string} context - Contexto donde ocurrió el error
 */
function handleError(error, context) {
    console.error(`Error en ${context}:`, error);
    // Aquí podrías agregar lógica adicional como mostrar un mensaje al usuario
}

/**
 * Obtiene datos del servidor de manera estandarizada
 * @param {string} url - URL del endpoint
 * @param {Object} params - Parámetros de la consulta
 * @returns {Promise} - Promesa con la respuesta
 */
async function fetchData(url, params = {}) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        handleError(error, 'fetchData');
        throw error;
    }
}
