import service from '../service/TestSample.service';

let setFncs:any = {};

export const setStates = (_setFncs:any)=>{
    const newValKeys = Object.keys(setFncs);
    Object.keys(setFncs).forEach(_key => {
        if(!newValKeys.includes(_key)){
            _setFncs[_key] = setFncs[_key];
        }
    });
    setFncs = _setFncs
}

export const searchFunc = (_search:any)=>{
    if(!setFncs['setsearch']||!setFncs['pagingList']||!setFncs['setallList']){
        console.log(setFncs);
        return;
    }
    const {setsearch, pagingList,setallList,setallCnt,showCnt,pageLength} = setFncs;
    service.getList({start:0,limit:(showCnt||10)*(pageLength||10)
        ,..._search})
        .then(
            (rs:any) =>{
                setsearch(_search);
                pagingList(rs.data.data as Array<any>,0,rs.data.allCount as number);
                setallList(rs.data.data as Array<any>) 
                setallCnt(rs.data.allCount as number);
            }
        )
}