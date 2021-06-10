import React from 'react';
import { Route } from 'react-router-dom';
import {Table}from 'react-bootstrap'
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

const EX1= ()=>{
    let _cnt = 0;
    let last= 0;
    let articleList = [];
    while(_cnt<5 ){
        articleList.push(<Article key = {_cnt} article={{bno:`${_cnt}`,writer:`writer ${_cnt}`,content:`content${_cnt}`,
        added:`${dateFormat(Date.now() -(6-_cnt)*24 *60*60*1000 -Math.floor(Math.random() * 24 *60*60*1000),'yyyy-mm-dd HH:MM:ss' )}`,
        edited:`${dateFormat(Date.now() -(5-_cnt)*24 *60*60*1000 -Math.floor(Math.random() * 24 *60*60*1000),'yyyy-mm-dd HH:MM:ss' )}`}} isHeader = 'false'/>)
        console.log(Date.now());
        console.log(Math.floor(Math.random()*(5-_cnt) * 24 *60*60 *1000000 ));
        _cnt++;
    }
    last = _cnt;

    return(
        <div>
            <Table className = 'table table-dark table-striped'>
                <thead>

                <Article article={{bno:'bno',writer:'writer',content:'content',added:'added',edited:'edited'}} isHeader = 'true'/>
                </thead>
                <tbody>
                    {
                        articleList.map(elt => elt)
                    }
                </tbody>

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