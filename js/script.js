$(document).ready(function() {

    // Importa la biblioteca
    const XLSX = window.XLSX;

    document.getElementById('csvFileInput').addEventListener('change', handleFileSelect);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            //Conversión de Excel a JSON
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            //console.log(jsonData);
            
            // Normalizar los nombres de las películas antes de la codificación
            const normalizedJSON = jsonData.map(item => {
                const normalizedItem = { ...item }; // Copiar el objeto para no modificar el original
                normalizedItem.Name = normalizeMovieTitle(item.Name); // Normalizar el título de la película
                return normalizedItem;
              });

            //Codificación de JSON en la URL para su transmisión
            const jsonStr = JSON.stringify(normalizedJSON);
            const encodedData = encodeURIComponent(jsonStr);
            //Envío de JSON
            window.location.href = `home.html?data=${encodedData}`;
        };

        reader.readAsArrayBuffer(file);
    }

    // Función para normalizar el título de la película
    function normalizeMovieTitle(title) {
        const titleAsString = title.toString(); // Convertir a cadena
        return titleAsString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

});