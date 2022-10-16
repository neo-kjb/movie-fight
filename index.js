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


const root = document.querySelector('.autocomplete');
root.innerHTML=`
<label><b>search for a movie</b></label>
<input class="input" />
<div class ="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results">
        </div>
    </div>
</div>
`;
const input = document.querySelector('.input');
const dropdown = document.querySelector(".dropdown");
const resultWrapper = document.querySelector('.results');


const onInput= async event=>{
    const movies = await fetchData(event.target.value)
if (!movies.length){
    dropdown.classList.remove('is-active');
    return;
}
    resultWrapper.innerHTML="";
    dropdown.classList.add('is-active');

    for(let movie of movies){
        const option = document.createElement('a');
        const img = movie.Poster=== "N/A"?"":movie.Poster
        option.classList.add('dropdown-item')
        option.innerHTML=`
        <img src="${img}">
        ${movie.Title}
        `;
        resultWrapper.appendChild(option)
    }
}


input.addEventListener('input',debounce(onInput))
document.addEventListener('click', (event)=>{
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    }
})