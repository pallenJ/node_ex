import service from '../service/TestSample.service';
import { Table, Button } from 'react-bootstrap'
import {dateFomatArticle} from "../util/DateUtil";
import {ModalType } from "../util/Dialog";
import dateFormat from "dateformat";
import {headers,tdSizes} from "./TestSample.consts";
   let util:any = {};
   let values:any = {};
   export  const rowData = (_data:any)=>(<tr>
    {headers.map(e =>
        <td style={{ width: `${tdSizes[e]}%` }}>
            <span className = 'd-inline'>

            {e.endsWith('At') ? dateFomatArticle(_data[e]) : (_data[e])}
            </span>
        {(e ==='writer'&&(_data['addedAt'] !== _data['editedAt']))?<p className = 'd-inline text-danger' >[edited]</p>:null}
        </td>
    )}
    <td>
        <Button variant="outline-secondary" onClick = {()=>showHistory(_data)}> <span className="fa fa-history" aria-hidden="true"></span> </Button>&nbsp;&nbsp;
        <Button variant="primary"> <span className="fa fa-edit" aria-hidden="true"
            onClick={
                ()=>util.checkPWcallback(_data.bno,(_rs:boolean)=>{
                    console.log(`rs:${_rs}`)
                    if(_rs){
                        util.changeInsert(_data);
                    }else{
                        let newModalInfo:any = {};
                        newModalInfo['theme'] = 'danger';
                        newModalInfo['content'] = <p color='red'>password Inconsistency</p>;
                        newModalInfo['type'] = ModalType.alert;
                        util.changeModalInfo(newModalInfo);
                        util.setshowmodal(true);
                    }
                })
            }
        ></span> </Button>&nbsp;&nbsp;
        <Button variant="danger"
            onClick={
                ()=>util.checkPWcallback(_data.bno,(_rs:boolean)=>{
                    console.log(values.modalInfo.type)
                    let newModalInfo:any = {};
                    if (_rs) {
                        newModalInfo['content'] = `Article ${_data.bno} delete`;
                        console.log( values.showCnt * values.pageLength);
                        service.deleteOne(_data.bno as string, { start: values.showCnt * values.pageLength * Math.floor(values.page / values.pageLength), limit: values.showCnt * values.pageLength })
                            .then((e: any) => {
                                util.setallList(e.data.list.data as never[]);
                                util.pagingList(e.data.list.data as never[]);
                                util.setallCnt(e.data.list.allCount as number);
                            })
                    }else{
                        newModalInfo['theme'] = 'danger';
                        newModalInfo['content'] = <p color='red'>password Inconsistency</p>;
                    }
                    newModalInfo['type'] = ModalType.alert;
                    util.changeModalInfo(newModalInfo);
                    util.setshowmodal(true);
                })
            }
        > <span className="fa fa fa-trash" aria-hidden="true"></span> </Button>
    </td>
</tr>)

   export const showHistory = (_data:any)=>{
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

export const setUtils = (_util:any)=>{util = _util};
export const setValues = (_values:any)=>{values = _values}