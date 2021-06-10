import React from 'react';
import { Route } from 'react-router-dom';
import {Table}from 'react-bootstrap'
import Article from '../lib/Article';
const Example=({match})=>{
    return(
    <div>
       <Route exact path={`${match.path}`} component={aaa} />
       <Route exact path={`${match.path}/ex1`} component={EX1}/>
         
    </div>
    );
}

const aaa =  ()=>{
    return (<div>
        fdsf
    </div>)
}

const EX1= (aaa)=>{
    return(
        <div>
            <Table className = 'table table-dark table-striped'>
                <thead>
                    {/* <tr>
                        <th>dd</th>
                    </tr> */}
                <Article article={{bno:'bno',writer:'writer',content:'content',added:'content',edited:'edited'}} isHeader = 'true'/> 
                </thead>


            </Table>
        </div>
    );
}

const EX2= ()=>{
    return(
        <div>
            EX2
        </div>
    );
}

export default Example;