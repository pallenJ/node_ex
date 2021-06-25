import { useState, useEffect } from "react";
import service from '../service/TestSample.service';
import ReactPaginate from 'react-paginate'
import { Table, Button,Row,Col, FormControl,InputGroup  } from 'react-bootstrap'
import {dateFomatArticle} from "../util/DateUtil";
import { MyModal, ModalType } from "../util/Dialog";
import dateFormat from "dateformat";
import { setStates,searchFunc } from "../functions/TestSample.functions";

const TestSample = () => {

    const [page, setpage] = useState(-1);
    const [showCnt, setshowCnt] = useState(10)
    const [allList, setallList] = useState([]);
    const [allCnt, setallCnt] = useState(0);
    const [list, setlist] = useState([] as Array<any>);
    const [insert, setinsert] = useState<any>({ bno: -1, writer: '', content: '', password: '', start: 0, limit: showCnt });

    const [showmodal, setshowmodal] = useState(false);
    const modalInfoInit = { theme: 'primary',size : 'md', confirmNext: () => { }};
    const [modalInfo, setmodalInfo] = useState<any>(modalInfoInit);
    const [search, setsearch] = useState<any>({keyword:'content|writer',search:''});

    let confirmPW = '';
    const [nowSearched, setnowSearched] = useState(false);

    const pageLength = 10;
    useEffect(() => {
        setStates({setsearch,setallList,pagingList,showCnt,pageLength,setallCnt})
        setShowList(page<0? 0:page);
    }, []);
    /* change functions */
    const changeModalInfo = (val: any) => {
        const valKeys = Object.keys(val);
        Object.keys(modalInfo).forEach(e => {
            if (!valKeys.includes(e)) {
                val[e] = modalInfo[e];
            }
        });
        setmodalInfo(val);
    }
    const changeInsertOne = (key: string, newValue: any) => {
        setinsert((_val:any) => {
            const temp = _val as { [index: string]: any };
            temp[key] = newValue
            return temp as any;
        });
    }
    const changeInsert = (val: any) => {
        const valKeys = Object.keys(val);
        setinsert((_val:any) => {
            Object.keys(insert).forEach(_key=>{
                if(!valKeys.includes(_key)){
                    val[_key] = insert[_key];
                }
            });
            return val as any;
        });
    }
    const changeSearchOne = (_key:string,_val:any) =>{
        let temp = {...search};
        temp[_key] = _val;
        setsearch(temp);
    }
    const changeSearch = (val:any) =>{
        const newKeys = Object.keys(val);
        Object.keys(search).forEach(_key=>{
            if(!newKeys.includes(_key)){
                val[_key] = search[_key];
            }
        });
        setsearch(val);
        
    }
    /* change functions end */
    /* elements */
    const setShowList = (_page = page, force = false) => {
        const otherView = Math.floor(page / pageLength) !== Math.floor(_page / pageLength) || force;
        if(force){
            setsearch({keyword:'content|writer',search:''});
        }
        if (otherView) {
            const limit = showCnt * pageLength;
            const start = showCnt * pageLength * Math.floor(_page / pageLength);
            service.getList(force?{start, limit,keyword:'writer|content'}:{ start, limit, ...search }).then(
                (rs:any) => {
                    const _allCnt = rs.data.allCount;
                    setallCnt(_allCnt);
                    setallList(rs.data.data)
                    pagingList(rs.data.data as Array<any>, _page, _allCnt);
                }
            ).catch((err) => console.error(err))
        } else {
            pagingList(allList, _page);
        }
        setpage(_page);
    }
    const pagingList = (dataList: Array<any>, _page = page, _allCnt = allCnt) => {
        const startAt = showCnt * (_page % pageLength);
        const endAt = Math.min(showCnt, Math.max(0, dataList.length - startAt)) + startAt;
        setlist(dataList.slice(startAt, endAt));
    }
    
    const checkPWcallback = (_bno:any,next:(_rs:boolean)=>void) => {
        changeModalInfo({
            type:ModalType.confirm,
            content: (
                <div className="align-items-center">
                    <div className="col-auto">
                        <label className="col-form-label">Password</label>
                    </div>
                    <div className="col-auto">
                        <input type="password" className="form-control"
                        onChange = {input=>{
                            confirmPW = input.target.value as string;
                            }}/>
                    </div>

                </div>
            ), confirmNext: () => {
                service.pwCheck(_bno as string,confirmPW).then(
                    (rs:any) =>{
                        let rsStr:string = (rs as string).toString();
                        if(rsStr.includes('Error: Request failed with status code 500')){
                            console.error(rsStr);
                            changeModalInfo({theme: 'danger',type:ModalType.alert,title:'ERROR',content:rsStr});
                            setshowmodal(true);
                        }else{
                            next(rs.data.success as boolean);
                        }
                    }
                )
            }
        })
        setshowmodal(true);
    };
    const rowData = (_data:any)=>(<tr>
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
                    ()=>checkPWcallback(_data.bno,(_rs:boolean)=>{
                        if(_rs){
                            changeInsert(_data);
                        }else{
                            let newModalInfo:any = {};
                            newModalInfo['theme'] = 'danger';
                            newModalInfo['content'] = <p color='red'>password Inconsistency</p>;
                            newModalInfo['type'] = ModalType.alert;
                            changeModalInfo(newModalInfo);
                            setshowmodal(true);
                        }
                    })
                }
            ></span> </Button>&nbsp;&nbsp;
            <Button variant="danger"
                onClick={
                    ()=>checkPWcallback(_data.bno,(_rs:boolean)=>{
                        let newModalInfo:any = {};
                        if (_rs) {
                            newModalInfo['content'] = `Article ${_data.bno} delete`;
                            service.deleteOne(_data.bno as string, { start: showCnt * pageLength * Math.floor(page / pageLength), limit: showCnt * pageLength })
                                .then((e: any) => {
                                    setallList(e.data.list.data as never[]);
                                    pagingList(e.data.list.data as never[]);
                                    setallCnt(e.data.list.allCount as number);
                                })
                        }else{
                            newModalInfo['theme'] = 'danger';
                            newModalInfo['content'] = <p color='red'>password Inconsistency</p>;
                        }
                        newModalInfo['type'] = ModalType.alert;
                        changeModalInfo(newModalInfo);
                        setshowmodal(true);
                    })
                }
            > <span className="fa fa fa-trash" aria-hidden="true"></span> </Button>
        </td>
    </tr>)
    const addRow = ()=>{
        return(<tr>
            <th>
                NEW
            </th>
            <td colSpan={5}>
                <div className="row g-3" >
                    <div className="col-md-2">
                        <input type="text" className="form-control" id="writer" name="writer" placeholder="writer"
                            onChange={e => changeInsertOne('writer', e.target.value)} 
                            defaultValue = {insert.bno as number > -1?'':insert.writer} disabled = {insert.bno as number > -1}/>
                    </div>
                    <div className="col-md-5">
                        <input type="text" className="form-control" id="content" name="content" placeholder="Content"
                            onChange={e => changeInsertOne('content', e.target.value)} 
                            defaultValue = {insert.bno as number > -1?'':insert.content} disabled = {insert.bno as number > -1} 
                        />
                    </div>
                    <div className="col-md-3">
                        <input type="password" className="form-control" id="password" name="password" placeholder="Password"
                            onChange={e => changeInsertOne('password', e.target.value)} 
                            defaultValue = {insert.bno as number > -1?undefined:insert.password} disabled = {insert.bno as number > -1}/>
                    </div>
                    <div className="col-md-2">
                        <Button variant="success" className="form-control" onClick={() => {
                            changeInsertOne('start', Math.floor(page / pageLength) * pageLength * showCnt);
                            changeInsertOne('limit', showCnt * pageLength);
                            service.addOne(insert).then((e:any) => {
                                changeModalInfo({type:ModalType.alert,content:'New Article Add'});
                                setshowmodal(true);
                                setallList(e.data.list.data as never[]);
                                setallCnt(e.data.list.allCount as number);
                                pagingList(e.data.list.data as never[]);
                            })
                        }}>
                            <span className="fa fa-paper-plane" aria-hidden="true"> &nbsp;ADD</span>
                        </Button>

                    </div>

                </div>
            </td>
        </tr>);
    }
    const editRow = (_data:any)=>(
        <tr className = 'table-secondary'>
                        <th>
                        {_data.bno}
                        </th>
                        <td colSpan={5}>
                            <div className="row g-3" >
                                
                                <div className="col-md-2">
                                    <input type="text" className="form-control" id="writer" name="writer" placeholder="writer"
                                        value = {_data.writer} disabled/>
                                </div>
                                <div className="col-4">
                                    <input type="text" className="form-control" id="content" name="content" placeholder="Content"
                                        onChange={e => changeInsertOne('content', e.target.value)} 
                                        defaultValue = {_data.content} 
                                    />
                                </div>
                                <div className="col-md-2">
                                    <input type="text" className="form-control" id="writer" name="writer" placeholder="writer"
                                        value = {dateFomatArticle(_data.addedAt)} disabled/>
                                </div>
                                <div className="col-md-2">
                                    <input type="text" className="form-control" id="writer" name="writer" placeholder="writer"
                                        value = {dateFomatArticle(_data.editedAt)} disabled/>
                                </div>
                                <div className="col-md-2">
                                    <Button variant="primary" className="form-control" onClick={() => {
                                        changeInsertOne('start', Math.floor(page / pageLength) * pageLength * showCnt);
                                        changeInsertOne('limit', showCnt * pageLength);
                                        service.edit(insert.bno as string,insert).then((e:any) => {
                                            changeModalInfo({type:ModalType.alert,content:`Article ${insert.bno} Edited`});
                                            setshowmodal(true);
                                            setallList(e.data.list.data as never[]);
                                            setallCnt(e.data.list.allCount as number);
                                            pagingList(e.data.list.data as never[]);
                                            changeInsert({ bno: -1, writer: '', content: '', password: ''})
                                        })
                                    }}>
                                        <span className="fa fa-edit" aria-hidden="true"> &nbsp;EDIT</span>
                                    </Button>

                                </div>

                            </div>
                        </td>
                    </tr>
    )
    const showHistory = (_data:any)=>{
        changeInsert({ bno: -1, writer: '', content: '', password: ''});
        const temp = {..._data};
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
        changeModalInfo({type:ModalType.alert,content:<div>{historyList}</div>,theme:'secondary',title:`History of Article ${_data.bno}`});
        setshowmodal(true);
    }
    const pagination = <ReactPaginate
    pageCount={Math.floor(allCnt / showCnt)+(allCnt % showCnt >0?1:0)}
    pageRangeDisplayed={3}
    initialPage={page<0?0:page}
    activeLinkClassName={"bg-dark text-white"}
    disabledClassName={""}
    extraAriaContext={"Previous"}
    marginPagesDisplayed={1}
    breakClassName={"page-item"}
    breakLinkClassName={"page-link text-dark"}
    previousLabel={"prev"}
    nextLabel={"next"}
    pageClassName={"Page navigation"}
    containerClassName={"pagination form-group"}
    pageLinkClassName={`page-link text-dark`}
    previousClassName={"page-link"}
    nextClassName={"page-link text-dark"}
    activeClassName={"page-item active "}
    previousLinkClassName={"page-item text-dark"}
    nextLinkClassName={"page-item text-dark"}
    onPageChange={(data) => {
        setShowList(data.selected)
        
    }}
    forcePage = {page}
/>
    /* elements end*/
    /* values */
    const headers = ['bno', 'writer', 'content', 'addedAt', 'editedAt'];
    const tdSizes: { [index: string]: number } = { 'bno': 5, 'writer': 20, 'content': 30, 'addedAt': 15, 'editedAt': 15 };
    
     
    return (
        <div className="container text-center">
 
  
 <h1>{nowSearched?'a':'b'}</h1>
  <Row className = 'd-flex justify-content-end' sm={"12"}>
      <Col className = 'd-flex justify-content-start'>
          {
              nowSearched?
              (<Button variant = 'light' onClick={()=>{setShowList(0,true); setpage(0); setnowSearched(false)}}>
                 All List
                </Button>):null
          }
          
      </Col>
    <Col sm = {4}>
        <InputGroup>
        <FormControl type = 'search' className = 'form-outline' onChange = {(e)=>{changeSearchOne('search',e.target.value)}}>
            
            </FormControl>
            <Button className = 'fas fa-search' variant = 'dark' onClick = {()=>{searchFunc(search);setpage(0); setnowSearched(true);}}/>
        </InputGroup>
        
    </Col>

  </Row>


            <hr />
            <Table className="" size="sm" variant="table">

                <thead className='table-dark'>
                    <tr>
                        {

                            headers.map(e => <th style={{ width: `${tdSizes[e]}%` }}>{e}</th>)
                        }
                        <th>options</th>

                    </tr>
                </thead>
                <tbody>

                    {
                        list.map(_data =>
                           (insert.bno as number) === (_data.bno as number)? editRow(_data):rowData(_data)
                        )
                    }

                </tbody>
                {<tfoot className='table-dark'>
                    {addRow()}
                </tfoot>}
            </Table>
            <hr />
           
                {pagination}
                
            <MyModal
                info={modalInfo}
                size={modalInfo.size}
                show={showmodal}
                onHide={() => { setshowmodal(false); setmodalInfo(modalInfoInit);}}
            ></MyModal>
        </div>
    );
}


export default TestSample;
