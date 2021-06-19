import React, { useState , useEffect} from "react";
import { Link } from "react-router-dom";
import { getList } from '../service/TestSample.service'
import {Button, Table,Pagination} from 'react-bootstrap'
import queryString, { stringify } from "query-string";

const TestSample =  ({history, location,match}:any)=>{

    const [pageInfo, setpageInfo] = useState(queryString.parseUrl(location.search).query);


    const [list, setlist] = useState({type:'page',data:[],descript:"",lastPage:0,page:1});
    const getDatas = (_page:number /* = parseInt(pageInfo.page?.toString()??'1') */)=>{
        let newPgInfo = {...pageInfo};
        newPgInfo.page = _page.toString();
        getList(newPgInfo).then(e =>{
            setlist(e.data);
            setpageInfo({page:_page.toString()});
        })


     };
    const headers = ['bno','writer','content','addedAt','editedAt'];
     const getPageNum = ()=>{
        return parseInt(pageInfo.page?.toString()??'0')
     }
    useEffect(() => {
        const pageVal = parseInt(pageInfo?(pageInfo.page?.toString()??'1'):'1');
        getDatas(pageVal);
    }, [])


    const pagingComponent = ()=>{
        const pageVal = parseInt(pageInfo?(pageInfo.page?.toString()??'1'):'1');
        const prevDots = pageVal>3&&list.lastPage>5;
        const nextDots = list.lastPage>5&&list.lastPage-pageVal>2;

        let showStart = 1;
        let showEnd = list.lastPage;
        let showList = [];
        if(!prevDots){
            showEnd = Math.min(showEnd,5);
        }else if(!nextDots){
            showStart = Math.max(1,showEnd-4);
        }else{
            showStart = pageVal-2;
            showEnd = pageVal+2;
        }
        for (let index = showStart; index <=showEnd; index++) {
            showList.push(
                <Pagination.Item active={index===pageVal} onClick = {()=>{
                    getDatas(index)
                }}>

                {index}
                </Pagination.Item>
                );
        }

        return(
        <Pagination className = "justify-content-md-center" >

        {list.page ===1?null:<Pagination.Prev key = 'to-perv-page' onClick = {()=>{getDatas(getPageNum()-1)}}/>}
        {prevDots?<Pagination.Item onClick = {()=>{getDatas(1);setpageInfo({page:'1'});}}>{1}</Pagination.Item>:null}
        {prevDots?<Pagination.Ellipsis />:null}

        {showList.map(e=>e)}

        {nextDots?<Pagination.Ellipsis/>:null}
        {nextDots?<Pagination.Item key='to-next-page' onClick = {()=>{getDatas(list.lastPage)}}>{list.lastPage}</Pagination.Item>:null}
        {list.page ===list.lastPage?null:<Pagination.Next onClick = {()=>{getDatas(getPageNum()+1)}}/>}

      </Pagination>)
    }

    return  (
        <div>
           {
               <Table size='sm' variant ='dark' striped>
                   <thead>

                   </thead>
                   <tbody>
                    {

                        (list?.data as Array<any>).map(
                            _data =>(
                            <tr>
                                {
                                    headers.map(
                                        _val =>{
                                         return (<td>
                                                {_data?.[_val]}
                                            </td>
                                        )
                                        }
                                    )
                                }
                            </tr>)
                        )

                    }
                   </tbody>
               </Table>

           }
           <hr></hr>
            {
                pagingComponent()

            }
            <Link to = {`/`}>
            sdfds
            </Link>
        </div>
    );
}

export default TestSample;