import React from 'react';
import { Route } from 'react-router-dom';
import Example from './Example';

function App() {
  return (
    <div>
      <Route path="/" component={test1} exact/>
      <Route path="/home" component={test2} />
      <Route path="/example" component ={Example} />
    </div>
  );
}

const test1 = ()=>{
    return (<div><h1>Main</h1></div>);
}
const test2 = ()=>{
    return (
        <div>
        <h1>Home</h1>
    </div>
        );
}

export default App;