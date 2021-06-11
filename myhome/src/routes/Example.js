import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import {Button, FormGroup, Table}from 'react-bootstrap'
import ArticleEX from '../lib/ArticleEX';
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
const EX1= ()=>{
    let articleData = [];
    let _cnt = 0;
    const [articles, setarticles] = useState(articleData);
    const [last, setlast] = useState(5);
    const getArticle = (_key,data,authority = {})=>{

        return(
            <ArticleEX key = {_key} article={
                {
                    bno:`${data.bno}`,writer:`${data.writer}`,
                    content:`${data.content}`,
                    added:`${dateFormat(data.added,'yyyy-mm-dd HH:MM:ss' )}`,
                    edited:`${dateFormat(data.edited,'yyyy-mm-dd HH:MM:ss' )}`}} isHeader = 'false' canEdit ={authority.canEdit}
                    />
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

    }


    const addArticleEX = (authority)=>{
        const pairData = {bno:last,writer:`writer${last}`,content:`content${last}`,added:Date.now(),edited:Date.now()};
        const newArticle = getArticle(last,pairData,authority);
        //articleData.push(newArticle);

        setarticles(
            articles.concat(
                [newArticle]
            )
        );
        setlast(last+1);
        console.log('last:'+last)
    }

    const deleteArticleEX = (bno) =>{

        try {
            const _selectIdx = articles.findIndex(art => parseInt(art.key) === parseInt(bno));
            setarticles(articles.slice(0,_selectIdx).concat(articles.slice( _selectIdx+1 )) )
        } catch (error) {
            console.log(error);

        }
        console.log(articles[articles.length-1].key)
        if(articles.length === 0)setlast(0);
        else{
            setlast(last-1);
            console.log('last:'+last)
        }
    }


    return(
        <div className ='container-fluid'>
            <Table className = 'table table-dark table-striped'>
                <thead>

                <ArticleEX article={{bno:'bno',writer:'writer',content:'content',added:'added',edited:'edited'}} isHeader = 'true'/>
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
                            <Button className ='delete' variant ='danger' size ='large' onClick ={()=>{deleteArticleEX(last-1)}}>
                                DELETE
                            </Button>


                        </td>
                    </tr>
                </tfoot>
            </Table>

        </div>
    );


}
/*
const EX2= ()=>{
    return(
        <div>
            EX2
        </div>
    );
}
 */
export default Example;