import { useState, useEffect } from "react";
import { getList, addOne, pwCheck, deleteOne,edit } from '../service/TestSample.service';
import ReactPaginate from 'react-paginate'
import { Table, Button } from 'react-bootstrap'
import {dateFomatArticle} from "../util/DateUtil";
import { MyModal, ModalType } from "../util/Dialog";
import dateFormat from "dateformat";

   let util:any = {};

    

   export  const showHistory = (_data:any)=>{
        util.changeInsert({ bno: -1, writer: '', content: '', password: ''});
        const temp = {..._data};
        console.log(temp.history as never[])
        delete temp.history;
        const historyList = 
        <div>
            <Table size = 'sm' className = 'col-md-6' style={{width:'50%'}}>
                <thead>
                    <tr>
                        <th className='table-dark col-md-3 h4'>
                        Writer
                        </th>
                        <td className = 'col-auto h4'>
                                {_data.writer}     
                        </td>
                    </tr>
                </thead>
            </Table>
        <hr/>
            
                <Table>
                    <thead>
                        <tr className='table-secondary'>
                            <th style = {{width:'65%'}} className='text-center'>
                                content
                            </th>
                            <th>
                                editedAt
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {((_data.history as never[]).concat(temp)).map((e:any) => 
                        <tr>
                            <td className='text-center'>
                                {e.content}
                            </td>
                            <td>
                                {dateFormat(e.editedAt as string,'yyyy-mm-dd H:MM:ss')}
                            </td>
                        </tr>    
                    )}
                    </tbody>
                </Table>
            
            </div>;
        //historyList.forEach(e=>console.log(e));
        util.changeModalInfo({type:ModalType.alert,content:<div>{historyList}</div>,theme:'secondary',title:`History of Article ${_data.bno}`});
        util.setshowmodal(true);
    }

export const setutils = (_util:any)=>{util = _util};