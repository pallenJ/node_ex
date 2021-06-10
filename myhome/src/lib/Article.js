import React from 'react';
import { Component } from 'react';

class Article extends Component{
    constructor(props){
        super(props);
        this.setArticle(props.article);
    }

    state = {
        bno:"0",
        writer:"anonymous",
        content:"",
        added:null,
        edited:null
    }
    setArticle = async(params)=>{
        await this.setState(params).
        console.log(JSON.stringify(params));
        console.log(JSON.stringify(this.state));
    }
    getPiece = (val)=>this.props.isHeader?<th> {val}</th>:<td>{val}</td>;
    
    render(){
        
        return(
            <tr>
                {
                    Object.keys(this.state).forEach(_key =>{
                    {
                        console.log(this.state[_key] );
                        this.getPiece(_key);
                    }
                    })
                }
            </tr>
        ) 

    }

}


export default Article;