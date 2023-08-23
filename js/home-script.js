$(document).ready(function() {

    const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const encodedData = urlParams.get('data');
        const decodedData = decodeURIComponent(encodedData);
        const moviesJSON = JSON.parse(decodedData);
        //console.log(moviesJSON);

        //Renombrar Campo (quitando espacio)
        for (const item of moviesJSON) {
            item.WatchedDate = item['Watched Date'];
            delete item['Watched Date'];
        }
        console.log(moviesJSON);

        //Obtener fecha corecta
        function getFecha (dateWatched){
         const excelStartDate = new Date('1900-01-01');
         const excelDate = new Date(excelStartDate.getTime() + (dateWatched - 1) * 24 * 60 * 60 * 1000);
         // Utilizamos una expresión regular para extraer la parte de la fecha deseada
         const extractedDate = excelDate.toDateString().match(/[A-Z][a-z]{2} \d{2} \d{4}/)[0];
         return extractedDate;
        }

        // ----- DOM ELEMENTS
        const mwatched = document.querySelector("#mwatched-title"); //Most Watched
        const first = document.querySelector("#first-title"); //1 Watched
        const fifty = document.querySelector("#fifty-title"); //50  Watched
        const cien = document.querySelector("#cien-title"); //100 Watched


        // ----- SHOWING INFO

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
           //console.log(`El dato más repetido es: ${mostRepeatedData} (${maxCount} veces)`);
           mwatched.innerHTML = `${mostRepeatedData} (${maxCount} times)`;

         //FIRST MOVIE
         const firstMovie = moviesJSON[0].Name;
         const firstDate = moviesJSON[0].WatchedDate;
         const firstFecha = getFecha(firstDate); //Convertir el número de serie en una fecha legible
         first.innerHTML = `${firstMovie} (${firstFecha})`;

         //50 MOVIE
         const fiftyMovie = moviesJSON[49].Name;
         const fiftyDate = moviesJSON[49].WatchedDate;
         const fiftyFecha = getFecha(fiftyDate); //Convertir el número de serie en una fecha legible
         fifty.innerHTML = `${fiftyMovie} (${fiftyFecha})`;

         //100 MOVIE
         const cienMovie = moviesJSON[99].Name;
         const cienDate = moviesJSON[99].WatchedDate;
         const cienFecha = getFecha(cienDate); //Convertir el número de serie en una fecha legible
         cien.innerHTML = `${cienMovie} (${cienFecha})`;


    });