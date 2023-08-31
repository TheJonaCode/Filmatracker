$(document).ready(function() {

    // ----- OBTENIENDO JSON DE DIARY.EXCEL (a través de transmisión en la URL desde index.html)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedData = urlParams.get('data');
    const decodedData = decodeURIComponent(encodedData);
    const moviesJSON = JSON.parse(decodedData);
    console.log(moviesJSON);
    
    //Renombrar Campo (quitando espacio en Watched Date)
    for (const item of moviesJSON) {
      item.WatchedDate = item['Watched Date'];
      delete item['Watched Date'];
    }

    //Obtener fecha corecta
    function getFecha (dateWatched){
      const excelStartDate = new Date('1900-01-01');
      const excelDate = new Date(excelStartDate.getTime() + (dateWatched - 1) * 24 * 60 * 60 * 1000);
      // Utilizamos una expresión regular para extraer la parte de la fecha deseada
      const extractedDate = excelDate.toDateString().match(/[A-Z][a-z]{2} \d{2} \d{4}/)[0];
      return extractedDate;
    }
          
    // ----- DOM ELEMENTS
    //Most Watched
    const mwatched = document.querySelector("#mwatched-title"); //Title
    const mwatchedS = document.querySelector("#mwatched-sub"); //Subtitle
    const mwatchedP = document.querySelector("#mwatched-poster"); //Poster
    //1 Watched
    const first = document.querySelector("#first-title"); //Title
    const firstS = document.querySelector("#first-sub"); //Subtitle
    const firstP = document.querySelector("#first-poster"); //Poster
    //50 Watched
    const fifty = document.querySelector("#fifty-title"); //Title
    const fiftyS = document.querySelector("#fifty-sub"); //Subtitle
    const fiftyP = document.querySelector("#fifty-poster"); //Poster
    //100 Watched
    const cien = document.querySelector("#cien-title"); //Title
    const cienS = document.querySelector("#cien-sub"); //Subtitle
    const cienP = document.querySelector("#cien-poster"); //Poster


    // ----- SHOWING INFO

    //MOST WATCHED
    //Title
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
    mwatched.innerHTML = `${mostRepeatedData}`;
    mwatchedS.innerHTML = `(${maxCount} times)`;
    //Poster
    async function mostwPoster(){
      const movieposter = await getPoster(mostRepeatedData);
      //console.log(movieposter);
      mwatchedP.src=movieposter;
    }
    mostwPoster();
           
    //FIRST MOVIE
    //Title
    const firstMovie = moviesJSON[0].Name;
    const firstDate = moviesJSON[0].WatchedDate;
    const firstFecha = getFecha(firstDate); //Convertir el número de serie en una fecha legible
    first.innerHTML = `${firstMovie}`;
    firstS.innerHTML = `(${firstFecha})`;
    //Poster
    async function firstPoster(){
     const movieposter = await getPoster(firstMovie);
     firstP.src=movieposter;
    }
    firstPoster();           

    //50 MOVIE
    //Title
    const fiftyMovie = moviesJSON[49].Name;
    const fiftyDate = moviesJSON[49].WatchedDate;
    const fiftyFecha = getFecha(fiftyDate); //Convertir el número de serie en una fecha legible
    fifty.innerHTML = `${fiftyMovie}`;
    fiftyS.innerHTML = `(${fiftyFecha})`;
    //Poster
    async function fiftyPoster(){
     const movieposter = await getPoster(fiftyMovie);
     fiftyP.src=movieposter;
    }
    fiftyPoster();         

    //100 MOVIE
    //Title
    const cienMovie = moviesJSON[99].Name;
    const cienDate = moviesJSON[99].WatchedDate;
    const cienFecha = getFecha(cienDate); //Convertir el número de serie en una fecha legible
    cien.innerHTML = `${cienMovie}`;
    cienS.innerHTML = `(${cienFecha})`;
    //Poster
    async function cienPoster(){
     const movieposter = await getPoster(cienMovie);
     cienP.src=movieposter;
    }
    cienPoster();

    // ----- FETCH API THE MOVIE DB
    async function fetchMovie(movieTitle){
      
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNTk5MjRlZmVmMmZhZTZmYjM2ODUwMzk5YWI5YjEwZCIsInN1YiI6IjVmOGNmN2U5ZWZkM2MyMDAzNjNkZjE5NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZPxtN7CeIJC14QaE0ktztv1JoKWuq7sFRoX6cgPQTEs'
        }
      };

      const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieTitle}`, options);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        return data.results[0]; // Devuelve solo el primer elemento del arreglo
      } else {        
        // Manejo en caso de que no se encuentren resultados
        //console.log(movieTitle);
        return {
          title : movieTitle,
          genre_ids: [0]
        };
      }
    }
    //fetchMovie('LÃ©on: The Professional');

    // ----- OBTENER POSTER
    async function getPoster(movieTitle){
      pelicula = movieTitle;
      movieInfo = await fetchMovie(pelicula);
      //console.log(movieInfo)
      //Obtener Poster
      const posterurl = 'https://image.tmdb.org/t/p/w500';
      const moviePoster = posterurl + movieInfo.poster_path;
      //console.log('POSTER: ' + moviePoster);
      return moviePoster;
    }
    //getPoster('Back To The Future');

    // ----- CONTAR GÉNEROS
    // Objeto que mapea IDs de género a nombres de género
    const genreIdToName = {
      0: 'Default',
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Science Fiction',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western'
    };

    async function genreCount(){
      const genreCounts = {}; // Objeto para almacenar las cuentas de géneros

      // Recorriendo las películas y contando los géneros
      for (const item of moviesJSON) {
        const name = item.Name;
        const movieInfo = await fetchMovie(name);
        //console.log(movieInfo);
        const genres = movieInfo.genre_ids;
        for (const genre of genres) {
          if (genreCounts[genre]) {
            genreCounts[genre]++;
          } else {
            genreCounts[genre] = 1;
          }
        }
      }

      //console.log(genreCounts);

      // Después de contar los géneros, mostrar las cuentas con nombres de género
      for (const genreId in genreCounts) {
        if (genreIdToName.hasOwnProperty(genreId)) {
          const genreName = genreIdToName[genreId];
          const count = genreCounts[genreId];
          console.log(`${genreName}: ${count}`);
        }
      }
    }
    genreCount();

});