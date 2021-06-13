import dateFormat from 'dateformat';
import React, { useState } from 'react';
import { Button, Table} from 'react-bootstrap';

const keys = ['bno','title','writer','content','added','edited'];

const Ex2 = ()=>{

    const GetSample = (len) =>{
        let rt = [];
        for (let i = 0; i < len; i++) {
            rt.push(
                {
                    bno:i,
                    title:`title${i}`,
                    writer:`writer${i}`,
                    content:`content${i}`,
                    added: dateFormat(Date.now() -(len+1-i)*24 *60*60*1000 -Math.floor(Math.random() * 24 *60*60*1000),'yyyy-mm-dd HH:MM:ss' ),
                    edited: dateFormat(Date.now() -(len-i)*24 *60*60*1000 -Math.floor(Math.random() * 24 *60*60*1000),'yyyy-mm-dd HH:MM:ss' )
                }
            );

        }
        return rt;
    }

    const [articleList, setarticleList] = useState(GetSample(5))
    const [last, setlast] = useState(5);
    const addArticle = ()=>{
        if(articleList.length === 0)
            setlast(0);
        setarticleList(articleList.concat([
            {
                bno:last,
                title:`title${last}`,
                writer:`writer${last}`,
                content:`content${last}`,
                added: dateFormat(Date.now(),'yyyy-mm-dd HH:MM:ss' ),
                edited: dateFormat(Date.now(),'yyyy-mm-dd HH:MM:ss' )
            }
        ])

        );
        setlast(last+1)
    }
    const deleteArticle = (bno:Number)=>{
        //bno = parseInt(bno);
        const isLast = articleList[articleList.length-1].bno === bno;
        console.log(isLast);
        const selectIdx = articleList.findIndex(elt => elt.bno === bno)
        setarticleList(
            articleList.slice(0,selectIdx).concat(articleList.slice(selectIdx+1))
        )
        if(articleList.length === 1)
            setlast(0);
        else if(isLast)
            setlast(articleList[articleList.length-1].bno);
        else
            setlast(1+articleList[articleList.length-1].bno);
    }
    return(
        <Table striped bordered hover size='sm' variant='dark' responsive='sm'>
            <thead>
                <tr>

                {
                    keys.map(_val => <th key = {`header-${_val}`} className = 'text-center'>{_val}</th>)
                }
                <th className = 'text-center'><Button variant = 'success' size ='sm' align ='right' onClick ={addArticle}>ADD</Button></th>
                </tr>
            </thead>
            <tbody>
                {
                    articleList.map(elt =>{
                        return(
                            <tr key = {`tr-${elt.bno}`}>
                                {keys.map(_key=><td className='text-center' key = {`td-${_key}-${elt.bno}`}>{elt[_key.toString()]}</td>)}
                                <td className='text-center' >
                                <Button variant = 'outline-danger' size ='sm'
                                key = {`del-${elt.bno}`} onClick ={()=> deleteArticle(elt.bno)}>DELETE</Button>
                                </td>
                            </tr>
                        );
                    }
                    )
                    }
            </tbody>

        </Table>
    )
}


export default Ex2;