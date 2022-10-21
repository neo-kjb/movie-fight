const autoCompleteConfig={
  renderOption(movie){
    const img = movie.Poster=== "N/A"?"":movie.Poster
    return `
    <img src="${img}">
    ${movie.Title}
    `
   },
   inputValue(movie){
    return movie.Title
   },
   async fetchData(search){
    const response = await axios.get('https://www.omdbapi.com/',{
      params:{
      apikey:'cabd3494',
      s: search
  }
  });
  if (response.data.Error){
  return []
  }
  return response.data.Search
  }
}

createAutoComplete({
  ...autoCompleteConfig,

 root: document.querySelector('#left-autocomplete') ,

 onOptionSelect(movie){
  document.querySelector('.tutorial').classList.add('is-hidden')
  onMovieSelect(movie,document.querySelector('#left-summary'),'left')
 }
 

})

createAutoComplete({
  ...autoCompleteConfig,

  root: document.querySelector('#right-autocomplete') ,

  onOptionSelect(movie){
     document.querySelector('.tutorial').classList.add('is-hidden')
     onMovieSelect(movie,document.querySelector('#right-summary'),'right')
  }
  
 
 })

 let leftMovie;
 let rightMovie;

const onMovieSelect = async(movie,summaryElement,side)=>{
    const response = await axios.get('https://www.omdbapi.com/',{
        params:{
        apikey:'cabd3494',
        i: movie.imdbID
    }
});
summaryElement.innerHTML=movieTemplate(response.data)
if (side==='left') {
  leftMovie=response.data
} else {
  rightMovie=response.data
}
if (leftMovie && rightMovie){
  runCompare()
}
};

const runCompare = ()=>{
  const leftSide =document.querySelectorAll('#left-summary .notification');
  const rightSide =document.querySelectorAll('#right-summary .notification');
  leftSide.forEach((leftState,index)=> {
    const rightState=rightSide[index]
    const leftValues = leftState.dataset.value
    const rightValues= rightState.dataset.value
    if(leftValues>rightValues){
      rightState.classList.remove('is-primary')
      rightState.classList.add('is-warning')
    } else{
      leftState.classList.remove('is-primary')
      leftState.classList.add('is-warning')
    }
  });

}

const movieTemplate = (movieDetail)=>{
  const boxOf = parseInt (movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
  const meta = parseInt(movieDetail.Metascore);
  const rate = parseFloat(movieDetail.imdbRating);
  const vote = parseFloat(movieDetail.imdbVotes.replace(/,/g,''))
  const award = movieDetail.Awards.split(' ').reduce((word , currVal) => {
    value=parseInt(currVal)
    if(isNaN(value)){
      return word
    } else{
      return word+currVal
    }
  })
    
;

    return `
<article class="media">
<figure class="media-left">
  <p class="image">
    <img src="${movieDetail.Poster}">
  </p>
</figure>
<div class="media-content">
  <div class="content">
    <h1>${movieDetail.Title}</h1>
    <h4>${movieDetail.Genre}</h4>
    <p>${movieDetail.Plot}</p>
  </div>
</div>

</article>
<article data-value=${award} class="notification is-primary">
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</p>
</article>
<article data-value=${boxOf} class="notification is-primary">
  <p class="title">${movieDetail.BoxOffice}</p>
  <p class="subtitle">Box Office</p>
</article>
<article data-value=${meta} class="notification is-primary">
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">Metascore</p>
</article>
<article data-value=${rate} class="notification is-primary">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">IMDB Rating</p>
</article>
<article data-value=${vote} class="notification is-primary">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">IMDB Votes</p>
</article>
`
}