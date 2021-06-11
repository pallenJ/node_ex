import React from 'react';
import { Component } from 'react';
import { Button } from 'react-bootstrap';

class Article extends Component{
    constructor(props){
        super(props);
        this.state =  this.props.article;
    }


    getArticleData = (_key,val)=>this.props.isHeader?
    <th key={_key} className =  'text text-center'> {val}</th>:<td key={_key}>{val}</td>;

    render(){
        const {canEdit} = this.props;
        return(
            <tr>
                {

                    Object.keys(this.state).map(_key=>{
                       return this.getArticleData(_key,this.state[_key]);
                    })
                    
                }
                {
                    
                    <td>
                        {canEdit?(
                            <div className="align-items-center" role="group" aria-label="Basic example" >
                                
                                <Button variant='outline-primary' className = 'align-left'>
                                    Edit
                                  </Button>
                                  &nbsp;
                                  &nbsp;
                                  &nbsp;
                                <Button variant='outline-danger' align={'end'}>
                                    Delete
                                </Button>
                            </div>
                        ):null}
                    </td>
                    
                }
            </tr>
        )

    }

}


export default Article;