import { useEffect, useState } from 'react';
import './App.css';
import service from './service/service'

function App() {
  const [page, setpage] = useState<number>(0);
  const [list, setlist] = useState<never[]>()
  const [search, setsearch] = useState("")



   
  const moreShow = (clear = false,_search=search)=>{
    const _page = clear?0: page;

    service.getList({page:_page,search:_search}).then(e=>{
      if((e as never[]).length == 0&&!clear)return;
      else if(clear){
        setlist([]);
      }else{

        const temp = list ?? [];
        setlist(clear? e : temp.concat(e));
        setpage(_page+1);
      }
    })
  }
  const infiniteScroll = () => {
    let scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    let scrollTop = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    let clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      moreShow();
    }
  };
  const searchFnc = (val = search)=>{
    setpage(0);
    moreShow(true,val);
  };
  //infiniteScroll();
  useEffect(() => {
    infiniteScroll();
    window.addEventListener('scroll',infiniteScroll);
    return () => {
      window.removeEventListener('scroll',infiniteScroll);
    };
  }, [{page}]);
  return (
    <div className="App">
      <h1>HOME WORK</h1>
      <h4>PAGE:{page}</h4>
      <input type="search" onChange = {(e)=>{
        setsearch(e.target.value)
        setpage(0);
        moreShow(true,e.target.value);
        console.log(e.target.value)
      }}
     
      
      />
      <hr/>
      <div>
        {
          list?.map(
            e=><pre>{JSON.stringify(e)}</pre>
          )
          
        }
      </div>
      <hr/>
    </div>
  );
}

export default App;
