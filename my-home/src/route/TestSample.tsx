import { useState , useEffect} from "react";
import { getList } from '../service/TestSample.service'
import ReactPaginate from 'react-paginate'
import {Table} from 'react-bootstrap'
import dateFormat from "dateformat";

const TestSample =  ()=>{

    const [page, setpage] = useState(-1);
    const [showCnt, setshowCnt] = useState(20)
    const [allList, setallList] = useState([]);
    const [allCnt, setallCnt] = useState(0);
    const [list, setlist] = useState([] as Array<any>);
    const pageLength = 10;

    useEffect(() => {
        setShowList(0);
    }, [])

    const setShowList = (_page:number)=>{
        const otherView = Math.floor(page/pageLength)!== Math.floor(_page/pageLength);

        if(otherView){
            const limit = showCnt * pageLength;
            const start = showCnt *pageLength * Math.floor(_page/pageLength);
            getList({start,limit}).then(
                e =>{
                    const _allCnt = e.data.allCount;
                    setallCnt(_allCnt);
                    setallList(e.data.data)
                    pagingList(e.data.data as Array<any>,_page,_allCnt);
                }
                ).catch((err)=>console.error(err))
        }else{
            pagingList(allList,_page);
        }
        setpage(_page);
    }
    const pagingList = (dataList : Array<any>, _page = page,_allCnt = allCnt)=>{
        const startAt = showCnt * (_page%pageLength);
        const endAt = Math.min(20,Math.max(0,dataList.length-startAt))+startAt;
        setlist(dataList.slice(startAt,endAt));
    }

    const headers = ['bno','writer','content','addedAt','editedAt'];

    //list.map(e =><pre>{JSON.stringify(e)}</pre>)
    return  (

        <div className ="container text-center">
            <hr/>
            <Table className="" size="sm" variant="table" hover>

                         <thead>
                <tr>
                  {
                      headers.map(e=><th>{e}</th>)

                  }
                  <th>options</th>

                </tr>
              </thead>
              <tbody>

                  {
                      list.map(_data =>
                        <tr>
                            {headers.map(e=>
                            <td>{e.endsWith('At')?dateFormat(Date.parse(_data[e])):_data[e]}</td>
                            )}
                            <td></td>
                        </tr>
                    )
                  }

              </tbody>
            </Table>
                <hr />

            <ReactPaginate
            pageCount = {Math.floor(allCnt/showCnt)}
            pageRangeDisplayed ={5}
            activeLinkClassName = {""}
            disabledClassName ={""}
            extraAriaContext = {"Previous"}
            marginPagesDisplayed = {0}
            breakClassName = {"page-item "}
            breakLinkClassName = {"page-link"}
            previousLabel = {"prev"}
            nextLabel = {"next"}
            pageClassName = {"Page navigation"}
            containerClassName = {"pagination table-dark"}
            pageLinkClassName = {"page-link"}
            nextClassName = {"page-link"}
            previousClassName = {"page-link"}
            activeClassName = {"page-item active table-dark"}
            previousLinkClassName = {"page-item"}
            nextLinkClassName = {"page-item"}
            onPageChange ={(data)=>{
                setShowList(data.selected)
            }}
            />
        </div>
    );
}

export default TestSample;