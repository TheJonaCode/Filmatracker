$(document).ready(function() {

    // ----- OBTENIENDO JSON DE DIARY.EXCEL
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
      //console.log(data);
      return data;
    }
    //fetchMovie('Top Gun');

    // ----- FETCH + OBTENER POSTER
    async function getPoster(movieTitle){
      pelicula = movieTitle;
      movieInfo = await fetchMovie(pelicula);
      //console.log(movieInfo)
      //Obtener Poster
      const posterurl = 'https://image.tmdb.org/t/p/w500';
      const moviePoster = posterurl + movieInfo.results[0].poster_path;
      //console.log('POSTER: ' + moviePoster);
      return moviePoster;
    }
    //getPoster('Back To The Future');


    });