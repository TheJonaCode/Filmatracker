$(document).ready(function() {

    const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const encodedData = urlParams.get('data');
        const decodedData = decodeURIComponent(encodedData);
        const moviesJSON = JSON.parse(decodedData);

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
    });