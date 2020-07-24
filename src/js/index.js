import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe';
import {elements,renderloader,clearloader} from './views/base';
import list from './models/list';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Like from './models/like';
const state={};
const controlsearch=async ()=>{
    const query=searchView.getinput();
    
    
    if(query){
        state.search=new Search(query);
        searchView.clearInput();
        searchView.clearresults();
        renderloader(elements.searchres);
        try{
        await state.search.getresults();
        clearloader();
        searchView.renderresults(state.search.result);
        }catch(error){
            alert(error);
        }
    }
}
elements.searchform.addEventListener('submit',e=>{
    e.preventDefault();
    controlsearch();
});


elements.searchrespages.addEventListener('click',e=>{
    const btn=e.target.closest('.btn-inline');
    if(btn){
        const gotopage=parseInt(btn.dataset.goto,10);
        searchView.clearresults();
        searchView.renderresults(state.search.result,gotopage);
        
    }
});
const controlRecipe=async ()=>{
const id=window.location.hash.replace('#','');

if(id){
    recipeView.clearecipe();
    renderloader(elements.recipe);
    if(state.search) searchView.highlight(id);
    state.recipe=new Recipe(id);
    
    try{

        await state.recipe.getRecipe();
        state.recipe.parseing();
        state.recipe.calctime();
        state.recipe.calcservings();
        clearloader();
        recipeView.renderrecipe(state.recipe,state.likes.isliked(id));
    }catch(error){
        alert(error);
    }
    
}
};
window.addEventListener('hashchange',controlRecipe);
window.addEventListener('load',controlRecipe);
//['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));

const controllist=()=>{
    if(!state.list) state.list=new list();
    state.recipe.ingredients.forEach(el=>{
        const item=state.list.additem(el.count,el.unit,el.ingredient);
        listView.renderitem(item);
    });
}

elements.shopping.addEventListener('click',e=>{
    const id=e.target.closest('.shopping__item').dataset.itemid;
    if(e.target.matches('.shopping__delete,.shopping__delete *')){
        state.list.deleteitem(id);
        listView.deleteitem(id);

    }else if(e.target.matches('.shopping__count-value')){
        const val=parseFloat(e.target.value,10);
        state.list.updatecount(id,val);
    }
});

const controllike=()=>{
    if(!state.likes) state.likes=new Like();
    const currentid=state.recipe.id;
    if(!state.likes.isliked(currentid)){
        const newlike=state.likes.addlike(currentid,state.recipe.title,state.recipe.author,state.recipe.img);
        likesView.togglelikebtn(true);
        likesView.renderlike(newlike);
        
    }else{
        state.likes.deletelike(currentid);
        likesView.togglelikebtn(false);
        likesView.deletelike(currentid);
    }
    likesView.togglelikemenu(state.likes.getnumlikes());
};

window.addEventListener('load',()=>{
    state.likes=new Like();
    state.likes.readstorage();
    likesView.togglelikemenu(state.likes.getnumlikes());
    state.likes.likes.forEach(like=>likesView.renderlike(like));

});

elements.recipe.addEventListener('click',e=>{
    if(e.target.matches('.btn-dec,.btn-dec *')){
        if(state.recipe.servings>1){
        state.recipe.updateservings('dec');
        recipeView.updateserveing(state.recipe);
    }
    }
    if(e.target.matches('.btn-inc,.btn-inc *')){
        state.recipe.updateservings('inc');
        recipeView.updateserveing(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controllist();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controllike();
    }
});


