import {elements} from './base';
export const getinput=()=>elements.searchinput.value;
export const clearInput=()=>{
    elements.searchinput.value='';
};
export const clearresults=()=>{
    elements.searchreslist.innerHTML='';
    elements.searchrespages.innerHTML='';
};

export const highlight=id=>{
    const ra=Array.from(document.querySelectorAll('.results__link'));
    ra.forEach(el=>{
        el.classList.remove('results__link--active');
    });
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}

export const limittitle=(title,limit=17)=>{
    const newtitle=[];
    if(title.length>limit){
        title.split(' ').reduce((acc,cur)=>{
            if(acc+cur.length<=limit){
                newtitle.push(cur);
            }
            return acc+cur.length;
        },0);
        return `${newtitle.join(' ')} ...`;
    }
    return title;
}

const renderrecipe=recipe=>{
    const markup=`
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limittitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchreslist.insertAdjacentHTML('beforeend',markup);
};
const createbutton=(page,type)=>`
    <button class="btn-inline results__btn--${type}" data-goto=${type==='prev'? page-1:page+1}>
    <span>Page ${type==='prev'? page-1:page+1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type==='prev'? 'left':'right'}"></use>
    </svg>    
    </button>
    
`;
const renderbuttons=(page,numresults,resperpage)=>{
    const pages=Math.ceil(numresults/resperpage);
    let button;
    if(page===1){
        button= createbutton(page,'next');
    }else if(page<pages){
        button= `
        ${createbutton(page,'prev')}
        ${createbutton(page,'next')}`;
    }else if(page===pages && pages>1){
        button= createbutton(page,'prev');
    }
    elements.searchrespages.insertAdjacentHTML('afterbegin',button);
};
export const renderresults=(recipes,page=1,resperpage=10)=>{
    const start=(page-1)*resperpage;
    const end=(page*resperpage);
    recipes.slice(start,end).forEach(renderrecipe);
    renderbuttons(page,recipes.length,resperpage);
};

