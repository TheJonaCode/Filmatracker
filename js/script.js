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

            //MOST WATCHED
            //Objeto para almacenar las ocurrencias de cada dato
            const countMap  = {}
            // Recorrer el JSON y contar las ocurrencias
            moviesJSON.forEach(item => {
                const name = item.Name;
                if (countMap [name]) {
                    countMap [name]++;
                } else {
                    countMap [name] = 1;
                }
              });
              //Encontrar dato que se repite más veces
              let maxCount = 0;
              let mostRepeatedData = null;
              
              for (const name in countMap ) {
                if (countMap [name] > maxCount) {
                  maxCount = countMap [name];
                  mostRepeatedData = name;
                }
              }

              console.log(`El dato más repetido es: ${mostRepeatedData} (${maxCount} veces)`);

            //FIRST MOVIE
            const firstMovie = moviesJSON[0].Name;
            console.log(firstMovie);

            //50 MOVIE
            const fiftyMovie = moviesJSON[49].Name;
            console.log(fiftyMovie);

            //100 MOVIE
            const cienMovie = moviesJSON[99].Name;
            console.log(cienMovie);
          
        };
        reader.readAsBinaryString(file);
    });

});