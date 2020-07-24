import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id=id;
    }
    async getRecipe(){
        try{
            const res=await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title=res.data.recipe.title;
            this.author=res.data.recipe.publisher;
            this.img=res.data.recipe.image_url;
            this.url=res.data.recipe.source_url;
            this.ingredients=res.data.recipe.ingredients;
            
        }catch(error){
            alert(error);
        }
    }
    calctime(){
        const ning=this.ingredients.length;
        const periods=Math.ceil(ning/3);
        this.time=periods*15;
    }
    calcservings(){
        this.servings=4;
    }

    parseing(){
        const unitslong=['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds','oz,'];
        const unitshort=['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound','oz'];
        const units=[...unitshort,'kg','g'];
        const newing=this.ingredients.map(el=>{
            let ingredient=el.toLowerCase();
            unitslong.forEach((unit,i)=>{
                ingredient=ingredient.replace(unit,unitshort[i]);
            });

            ingredient=ingredient.replace(/ *\([^)]*\) */g, ' ');//to remove parenthesis
            const arring=ingredient.split(' ');
            const unitindex=arring.findIndex(el2=>units.includes(el2));
            
            let objing;
            if(unitindex>-1){
                let count;
                const arrcount=arring.slice(0,unitindex);
                if(arrcount.length===1){
                    count=eval(arring[0].replace('-','+'));
                }else{
                    count=eval(arring.slice(0,unitindex).join('+'));
                }
                objing={
                    count,
                    unit:arring[unitindex],
                    ingredient:arring.slice(unitindex+1).join(' ')
                }
            }else if(parseInt(arring[0],10)){
                objing={
                    count:parseInt(arring[0],10),
                    unit:'',
                    ingredient:arring.slice(1).join(' ')
                }
            }else if(unitindex===-1){
                objing={
                    count:1,
                    unit:'',
                    ingredient
                }
            }
            return objing;

        });
        this.ingredients=newing;
    }

    updateservings(type){
        const newservings=type==='dec'? this.servings-1:this.servings+1;
        this.ingredients.forEach(ing=>{
            ing.count=ing.count*(newservings/this.servings);
        });
        this.servings=newservings
    }
}