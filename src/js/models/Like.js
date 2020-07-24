export default class Like{
    constructor(){
        this.likes=[];
    }
    addlike(id,title,author,img){
        const like={id,title,author,img};
        this.likes.push(like);
        this.persistdata();
        return like;
    }
    deletelike(id){
        const index=this.likes.findIndex(el=>el.id===id);
        this.likes.splice(index,1);
        this.persistdata();
    }
    isliked(id){
        return this.likes.findIndex(el=>el.id===id) !==-1;
    }

    getnumlikes(){
        
        return this.likes.length;
    }

    persistdata(){
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }

    readstorage(){
        const storage=JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes=storage;
    }
}