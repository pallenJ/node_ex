import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import {Button, Col, Row, Table}from 'react-bootstrap'
import Article from '../lib/Article';
import dateFormat from 'dateformat'
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
const exAuth = {canEdit:true};
const EX1= ()=>{
    let articleData = [];
    let _cnt = 0;
    const [articles, setarticles] = useState(articleData);
    const [last, setlast] = useState(5);
    const getArticle = (_key,data,authority = {})=>{
        
        return(
            <Article key = {_key} article={
                {
                    bno:`${data.bno}`,writer:`${data.writer}`,
                    content:`${data.content}`,
                    added:`${dateFormat(data.added,'yyyy-mm-dd HH:MM:ss' )}`,
                    edited:`${dateFormat(data.edited,'yyyy-mm-dd HH:MM:ss' )}`}} isHeader = 'false' canEdit ={authority.canEdit}/>
                    );
    }
    while(_cnt<5 ){
        articleData.push(getArticle(_cnt,{bno:`${_cnt}`,writer:`writer ${_cnt}`,content:`content${_cnt}`,
        added:dateFormat(Date.now() -(6-_cnt)*24 *60*60*1000 -Math.floor(Math.random() * 24 *60*60*1000),'yyyy-mm-dd HH:MM:ss' ),
        edited:dateFormat(Date.now() -(5-_cnt)*24 *60*60*1000 -Math.floor(Math.random() * 24 *60*60*1000),'yyyy-mm-dd HH:MM:ss' )},
        {canEdit: true}
        )
        );
        _cnt++;
        
        //setlast(5);
    }
    
    
    const addArticleEX = (authority)=>{
        const pairData = {bno:last,writer:`writer${last}`,content:`content${last}`,added:Date.now(),edited:Date.now()};
        const newArticle = getArticle(last,pairData,authority);
        //articleData.push(newArticle);

        console.log(articles);
        console.log(last);
        setarticles(
            articles.concat(
                [newArticle]
            )
        );
        setlast(last+1);
        
    }



    return(
        <div className ='container-fluid'>
            <Table className = 'table table-dark table-striped'>
                <thead>

                <Article article={{bno:'bno',writer:'writer',content:'content',added:'added',edited:'edited'}} isHeader = 'true'/>
                </thead>
                <tbody>

                    {
                        articles.map(elt => elt)
                    }
                    
                </tbody>
                <tfoot>
                    <tr color = 'white' className ='table-white'>
                        <td colSpan = '100%' align ='right'>

                            <Button className ='add' variant ='success' size ='large' onClick ={()=>{addArticleEX({canEdit:true})}}> 
                                ADD
                            </Button>

                            
                        </td>
                    </tr>
                </tfoot>
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