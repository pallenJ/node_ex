import { useState, useEffect } from "react";
import { getList, addOne, pwCheck, deleteOne,edit } from '../service/TestSample.service';
import ReactPaginate from 'react-paginate'
import { Table, Button } from 'react-bootstrap'
import {dateFomatArticle} from "../util/DateUtil";
import { MyModal, ModalType } from "../util/Dialog";
import dateFormat from "dateformat";
import {setutils,showHistory} from "src/element/TestSample.element";
const TestSample = (props:any) => {

    const [page, setpage] = useState(-1);
    const [showCnt, setshowCnt] = useState(10)
    const [allList, setallList] = useState([]);
    const [allCnt, setallCnt] = useState(0);
    const [list, setlist] = useState([] as Array<any>);
    const [insert, setinsert] = useState<any>({ bno: -1, writer: '', content: '', password: '', start: 0, limit: showCnt });

    const [showmodal, setshowmodal] = useState(false);
    const modalInfoInit = { theme: 'primary',size : 'md', confirmNext: () => { }};
    const [modalInfo, setmodalInfo] = useState<any>(modalInfoInit);
    
   

    let confirmPW = '';

    const pageLength = 10;
    useEffect(() => {
        setutils({setpage,setshowCnt,setallList,setallCnt,setlist,setinsert,setshowmodal,setmodalInfo,
            changeModalInfo,changeInsertOne,changeInsert,setShowList,pagingList,checkPWcallback});
        setShowList(0);
    }, [])
    const changeModalInfo = (val: any) => {
        const valKeys = Object.keys(val);
        Object.keys(modalInfo).forEach(e => {
            if (!valKeys.includes(e)) {
                val[e] = modalInfo[e];
            }
        });
        setmodalInfo(val);
        console.log(val['type'])
    }
    const changeInsertOne = (key: string, newValue: any) => {
        setinsert((_val:any) => {
            const temp = _val as { [index: string]: any };
            temp[key] = newValue
            //console.log(`newValur of${key}:${newValue}`)
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

    const setShowList = (_page = page, force = false) => {
        const otherView = Math.floor(page / pageLength) !== Math.floor(_page / pageLength) || force;

        if (otherView) {
            const limit = showCnt * pageLength;
            const start = showCnt * pageLength * Math.floor(_page / pageLength);
            getList({ start, limit }).then(
                (e:any) => {
                    const _allCnt = e.data.allCount;
                    setallCnt(_allCnt);
                    setallList(e.data.data)
                    pagingList(e.data.data as Array<any>, _page, _allCnt);
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
                pwCheck(_bno as string,confirmPW).then(
                    (rs:any) =>{
                        let rsStr:string = (rs as string).toString();
                        console.info(rsStr);
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
    const headers = ['bno', 'writer', 'content', 'addedAt', 'editedAt'];
    const tdSizes: { [index: string]: number } = { 'bno': 5, 'writer': 20, 'content': 30, 'addedAt': 15, 'editedAt': 15 };
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
                        console.log(`rs:${_rs}`)
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
                        console.log(modalInfo.type)
                        let newModalInfo:any = {};
                        if (_rs) {
                            newModalInfo['content'] = `Article ${_data.bno} delete`;
                            console.log( showCnt * pageLength);
                            deleteOne(_data.bno as string, { start: showCnt * pageLength * Math.floor(page / pageLength), limit: showCnt * pageLength })
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
                                        console.log('start:', Math.floor(page / pageLength) * pageLength * showCnt);
                                        changeInsertOne('limit', showCnt * pageLength);
                                        edit(insert.bno as string,insert).then((e:any) => {
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
    
    return (

        <div className="container text-center">
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
                    <tr>
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
                                        console.log('start:', Math.floor(page / pageLength) * pageLength * showCnt);
                                        changeInsertOne('limit', showCnt * pageLength);
                                        addOne(insert).then((e:any) => {
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
                    </tr>
                </tfoot>}
            </Table>
            <hr />
            <div className="align-items-center">

                <ReactPaginate
                    pageCount={Math.floor(allCnt / showCnt)+(allCnt % showCnt >0?1:0)}
                    pageRangeDisplayed={3}
                    initialPage={0}
                    activeLinkClassName={""}
                    disabledClassName={""}
                    extraAriaContext={"Previous"}
                    marginPagesDisplayed={1}
                    breakClassName={"page-item "}
                    breakLinkClassName={"page-link"}
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    pageClassName={"Page navigation align-items-center"}
                    containerClassName={"pagination align-items-center"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-link"}
                    nextClassName={"page-link"}
                    activeClassName={"page-item active"}
                    previousLinkClassName={"page-item"}
                    nextLinkClassName={"page-item"}
                    onPageChange={(data) => {
                        setShowList(data.selected)
                    }}
                />
            </div>
           
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
