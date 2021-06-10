import React from 'react';
import { Component } from 'react';

class Article extends Component{
    constructor(props){
        super(props);
        this.state =  this.props.article;
    }


    getPiece = (_key,val)=>this.props.isHeader?
    <th key={_key} className =  'text text-center'> {val}</th>:<td key={_key}>{val}</td>;

    render(){

        return(
            <tr>
                {

                    Object.keys(this.state).map(_key=>{
                       return this.getPiece(_key,this.state[_key]);
                    })

                }
            </tr>
        )

    }

}


export default Article;