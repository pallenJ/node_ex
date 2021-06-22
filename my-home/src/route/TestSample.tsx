import { useState , useEffect} from "react";
import  { getList,addOne } from '../service/TestSample.service'
import ReactPaginate from 'react-paginate'
import {Table,Button} from 'react-bootstrap'
import dateFormat from "dateformat";

const TestSample =  ()=>{

    const [page, setpage] = useState(-1);
    const [showCnt, setshowCnt] = useState(20)
    const [allList, setallList] = useState([]);
    const [allCnt, setallCnt] = useState(0);
    const [list, setlist] = useState([] as Array<any>);
    const [insert, setinsert] = useState({'writer':'','content':'','password':''});
    const pageLength = 10;

    useEffect(() => {
        setShowList(0);
    }, [])

    const changeInsert = (key:string,newValue:string)=>{
        setinsert((_val)=>{
            const temp = _val as {[index:string]:string};
            temp[key] = newValue
            //console.log(`newValur of${key}:${newValue}`)
            return temp as any;
        });
    }

    const setShowList = (_page:number,force = false)=>{
        const otherView = Math.floor(page/pageLength)!== Math.floor(_page/pageLength)||force;

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
    const tdSizes : {[index:string]:number} = { 'bno':5,'writer':10,'content':30,'addedAt':20,'editedAt':20};
    //list.map(e =><pre>{JSON.stringify(e)}</pre>)
    return  (

        <div className ="container text-center">
            <hr/>
            <Table className="" size="sm" variant="table" hover>

                         <thead>
                <tr>
                  {
                      headers.map(e=><th style = {{width:`${tdSizes[e]}%`}}>{e}</th>)
                  }
                  <th>options</th>

                </tr>
              </thead>
              <tbody>

                  {
                      list.map(_data =>
                        <tr>
                            {headers.map(e=>
                            <td style = {{width:`${tdSizes[e]}%`}}>{e.endsWith('At')?dateFormat(Date.parse(_data[e])):_data[e]}</td>
                            )}
                            <td>
                                <Button variant = "outline-secondary"> <span className="fa fa-history" aria-hidden="true"></span> </Button>&nbsp;&nbsp;
                                <Button variant = "primary"> <span className="fa fa-edit" aria-hidden="true"></span> </Button>&nbsp;&nbsp;
                                <Button variant = "danger"> <span className="fa fa fa-trash" aria-hidden="true"></span> </Button>
                            </td>
                        </tr>
                    )
                  }

              </tbody>
              {<tfoot className = 'table-dark'>
                  <tr>
                  <th>
                      NEW
                  </th>
                      <td colSpan = {5}>
                    <div  className = "row g-3" >
                    <div className="col-md-2">
                        <input type="text" className="form-control" id="writer" name = "writer" placeholder="writer" 
                        onChange = {e=>changeInsert('writer',e.target.value)}/>
                    </div>
                    <div className="col-md-5">
                        <input type="text" className="form-control" id="content" name ="content" placeholder="Content"
                        onChange = {e=>changeInsert('content',e.target.value)}
                        />
                     </div>
                    <div className="col-md-3">
                        <input type="password" className="form-control" id="password" name = "password" placeholder="Password"
                        onChange = {e=>changeInsert('password',e.target.value)}/>
                     </div>
                    <div className="col-md-2">
                        <Button variant = "success" className="form-control" onClick = {()=>{addOne(insert).then(e=>{console.log(e); alert('article ADDED'); setShowList(page,true);})}}>
                            <span className="fa fa-paper-plane" aria-hidden="true"> &nbsp;ADD</span>
                        </Button>
                        
                     </div>
                     
                        </div>
                      </td>
                  </tr>
              </tfoot>}
            </Table>
                <hr />
            <div className = "align-items-center">

            <ReactPaginate
            pageCount = {Math.floor(allCnt/showCnt)}
            pageRangeDisplayed ={3}
            initialPage ={0}
            activeLinkClassName = {""}
            disabledClassName ={""}
            extraAriaContext = {"Previous"}
            marginPagesDisplayed = {1}
            breakClassName = {"page-item "}
            breakLinkClassName = {"page-link"}
            previousLabel = {"prev"}
            nextLabel = {"next"}
            pageClassName = {"Page navigation align-items-center"}
            containerClassName = {"pagination align-items-center"}
            pageLinkClassName = {"page-link"}
            previousClassName = {"page-link"}
            nextClassName = {"page-link"}
            activeClassName = {"page-item active"}
            previousLinkClassName = {"page-item"}
            nextLinkClassName = {"page-item"}
            onPageChange ={(data)=>{
                setShowList(data.selected)
            }}
            />

            </div>
        </div>
    );
}

export default TestSample;