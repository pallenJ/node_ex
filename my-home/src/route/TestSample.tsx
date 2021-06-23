import { useState, useEffect } from "react";
import { getList, addOne , pwCheck} from '../service/TestSample.service'
import ReactPaginate from 'react-paginate'
import { Table, Button } from 'react-bootstrap'
import dateFormat from "dateformat";
import { MyModal, ModalType } from "src/util/Dialog";
const TestSample = () => {

    const [page, setpage] = useState(-1);
    const [showCnt, setshowCnt] = useState(20)
    const [allList, setallList] = useState([]);
    const [allCnt, setallCnt] = useState(0);
    const [list, setlist] = useState([] as Array<any>);
    const [insert, setinsert] = useState({ bno: -1, writer: '', content: '', password: '', startAt: 0, limit: showCnt });

    const [showmodal, setshowmodal] = useState(false);
    const modalInfoInit = { type: ModalType.confirm, theme: 'primary',size : 'sm', confirmNext: () => { }};
    const [modalInfo, setmodalInfo] = useState<any>(modalInfoInit);
   

    let confirmPW = ''; 

    const pageLength = 10;
    useEffect(() => {
        setShowList(0);
    }, [])
    const changeModalInfo = (val: any) => {
        const valKey = Object.keys(val);
        Object.keys(modalInfo).forEach(e => {
            if (valKey.indexOf(e) === -1) {
                val[e] = modalInfo[e];
            }
        });
        setmodalInfo(val);
    }
    const changeInsert = (key: string, newValue: any) => {
        setinsert((_val) => {
            const temp = _val as { [index: string]: any };
            temp[key] = newValue
            //console.log(`newValur of${key}:${newValue}`)
            return temp as any;
        });
    }

    const setShowList = (_page = page, force = false) => {
        const otherView = Math.floor(page / pageLength) !== Math.floor(_page / pageLength) || force;

        if (otherView) {
            const limit = showCnt * pageLength;
            const start = showCnt * pageLength * Math.floor(_page / pageLength);
            getList({ start, limit }).then(
                e => {
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
        const endAt = Math.min(20, Math.max(0, dataList.length - startAt)) + startAt;
        setlist(dataList.slice(startAt, endAt));
    }
    const checkPWcallback = (_bno:any,next:(_rs:boolean)=>void) => {
        changeModalInfo({
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
                    rs =>{
                        console.log(`rs:${rs.data.success as boolean}`)
                        next(rs);
                    }
                )
            }
        })
        setshowmodal(true);
    };
    const headers = ['bno', 'writer', 'content', 'addedAt', 'editedAt'];
    const tdSizes: { [index: string]: number } = { 'bno': 5, 'writer': 10, 'content': 30, 'addedAt': 20, 'editedAt': 20 };
    //showModal(false);
    //list.map(e =><pre>{JSON.stringify(e)}</pre>)
    return (

        <div className="container text-center">

            <hr />
            <Table className="" size="sm" variant="table">

                <thead>
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
                            <tr>
                                {headers.map(e =>
                                    <td style={{ width: `${tdSizes[e]}%` }}>{e.endsWith('At') ? dateFormat(Date.parse(_data[e])) : _data[e]}</td>
                                )}
                                <td>
                                    <Button variant="outline-secondary"> <span className="fa fa-history" aria-hidden="true"></span> </Button>&nbsp;&nbsp;
                                    <Button variant="primary"> <span className="fa fa-edit" aria-hidden="true"
                                        onClick={
                                            ()=>checkPWcallback(_data.bno,(_rs:boolean)=>{console.log(`rs:${_rs}`)})
                                        }
                                    ></span> </Button>&nbsp;&nbsp;
                                    <Button variant="danger"
                                        onClick={
                                            ()=>checkPWcallback(_data.bno,(_rs:boolean)=>{
                                                changeModalInfo({type:ModalType.alert});

                                                if(_rs){
                                                    changeModalInfo({content:`Article ${_data.bno} delete`});
                                                }else{
                                                    changeModalInfo({content:"password Inconsistency"});
                                                }
                                                setshowmodal(true);
                                            })
                                        }
                                    > <span className="fa fa fa-trash" aria-hidden="true"></span> </Button>
                                </td>
                            </tr>
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
                                        onChange={e => changeInsert('writer', e.target.value)} />
                                </div>
                                <div className="col-md-5">
                                    <input type="text" className="form-control" id="content" name="content" placeholder="Content"
                                        onChange={e => changeInsert('content', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input type="password" className="form-control" id="password" name="password" placeholder="Password"
                                        onChange={e => changeInsert('password', e.target.value)} />
                                </div>
                                <div className="col-md-2">
                                    <Button variant="success" className="form-control" onClick={() => {
                                        changeInsert('startAt', Math.floor(page / pageLength) * pageLength * showCnt);
                                        changeInsert('limit', showCnt * pageLength);
                                        addOne(insert).then(e => {
                                            setshowmodal(true);
                                            setallList(e.data.list.data as never[]);
                                            pagingList(e.data.list.data as never[])
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
                    pageCount={Math.floor(allCnt / showCnt)}
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
                show={showmodal}
                onHide={() => { setshowmodal(false); setmodalInfo(modalInfoInit);}}
            ></MyModal>

        </div>
    );
}


export default TestSample;
