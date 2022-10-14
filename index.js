const fetchData = async(search)=>{
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

const input = document.querySelector('input');
const onInput= async event=>{
    const movies = await fetchData(event.target.value)
    for(let movie of movies){
        const div = document.createElement('div');
        div.innerHTML=`
        <img src="${movie.Poster}">
        <h1>${movie.Title}</h1>
        `;
        document.querySelector('#target').appendChild(div)
    }
}


input.addEventListener('input',debounce(onInput))