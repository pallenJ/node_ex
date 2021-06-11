import React from 'react';
import { Component } from 'react';

class ArticleEX extends Component{
    constructor(props){
        super(props);
        this.state =  this.props.article;
    }


    getArticleData = (_key,val)=>this.props.isHeader?
    <th key={_key} className =  'text text-center'> {val}</th>:<td key={_key}>{val}</td>;

    render(){
        return(
            <tr>
                {

                    Object.keys(this.state).map(_key=>{
                       return this.getArticleData(_key,this.state[_key]);
                    })

                }
                {

                    <td width = '200'>
                        {
                            this.props.editGroup
                        }
                    </td>

                }
            </tr>
        )

    }

}


export default ArticleEX;