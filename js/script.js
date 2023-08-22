$(document).ready(function() {

    // Importa la biblioteca
    const XLSX = window.XLSX;

    // Al SUBIR ARCHIVO
    // Obtén una referencia al input de archivo
    const csvFileInput = document.getElementById('csvFileInput');

    // Escucha el evento 'change' del input de archivo
    csvFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Obtén el archivo seleccionado
  
        // Lee el archivo usando FileReader
        const reader = new FileReader();
        reader.onload = function (e) {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          
          // Procesamiento del archivo
          // Obtiene la primera hoja
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convierte los datos a un objeto JSON
            const moviesJSON = XLSX.utils.sheet_to_json(sheet);

            // Ahora 'moviesJSON' contiene la información del archivo Excel
            console.log(moviesJSON);

            //TESTING
            console.log('TEST .-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.');

            //FIRST MOVIE
            const firstMovie = moviesJSON[0].Name;
            console.log(firstMovie);
          
        };
        reader.readAsBinaryString(file);
    });

});