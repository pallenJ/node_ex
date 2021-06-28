import { useEffect, useState } from 'react';
import './App.css';
import service from './service/service'

function App() {
  const [page, setpage] = useState<number>(0);
  const [list, setlist] = useState<never[]>();
  const [search, setsearch] = useState("");
  const [post, setpost] = useState('a');
  const [selected, setselected] = useState<any>(null);

  const moreShow = (clear = false, _search = search,_post  = post) => {
    const _page = clear ? 0 : page;

    service.getList({ page: _page, search: _search},_post).then(e => {
      if ((e as never[]).length == 0 && !clear) return;
      else if (clear) {
        setlist([]);
      } else {

        const temp = list ?? [];
        setlist(clear ? e : temp.concat(e));
        setpage(_page + 1);
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
  const searchFnc = (e: any) => {
    setsearch(e.target.value)
    setpage(0);
    moreShow(true, e.target.value);
    console.log(e.target.value)
  };

  const showDetail = (e:any) =>
(
    <div style = {{textAlign:'center'}}>
      <div style = {{border:'1px solid black',width:'64%',left:'18%',right:'18%', position:'relative'}}>
        <h2>{e.title}</h2>
        <div style={{padding:'20px'}}>
          {e.content}
        </div>
      </div>
      <button className = 'btn-selected' onClick = {()=>{setselected(null) }}>뒤로가기</button>
    </div>)

  //infiniteScroll();
  useEffect(() => {
    infiniteScroll();
    window.addEventListener('scroll', infiniteScroll);
    return () => {
      window.removeEventListener('scroll', infiniteScroll);
    };
  }, [{ page }]);
  const Main = <div style = {{border:'1px solid black', padding:'50px'}}>
            <div className="wrap" >
   <div className="search ">
      <input type="text" className="searchTerm" placeholder = '&#xF002; Search...' onChange={searchFnc} style={{fontFamily:'FontAwesome'}}/>

   </div>
</div>
   <button className = {`btn${post ==='a'?'-selected':''}`} value = 'A-post' onClick = {()=>{setpost('a');setpage(0);moreShow(true,search,'a');}}>A-post</button>
   <button className = {`btn${post ==='b'?'-selected':''}`} value = 'A-post' onClick = {()=>{setpost('b');setpage(0);moreShow(true,search,'b');}}>B-post</button>
      <hr />
      <div>
        <ul className = ''>
          {

            list?.map(
              (e:any) => <li  style = {{userSelect:'text',margin:'20px',listStyle:'none'}} className ='bg-gray-100'>
                <article onClick={() => { setselected(showDetail(e));}}
              >
               <h3><span style = {{color:'blueviolet'}}> {e.id}</span>&nbsp;<span style={{}}>{e.title}</span></h3>
               <span className = 'pre'>{e.content}</span>
                </article></li>
            )

          }
        </ul>
      </div>
  </div>

  return (
    <div className="App" style = {{width:'70%', left:'15%',right:'15%',position:'relative'}}>
      <h1 style = {{textAlign:'center'}}>HOMEWORK</h1>
        {console.log(selected === null)}
        {console.log(selected)}
        {selected ?? Main}
      <hr />
    </div>
  );
}

export default App;
