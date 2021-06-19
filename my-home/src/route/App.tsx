import React from "react";
import { Route } from "react-router-dom";
import TestSample from "./TestSample";

const App = ()=>{

    return (
        <div>
            <Route path = '/' component={Main} exact/>
            <Route path = '/home' component = {Home}/>
            <Route path = '/testSample' component = {TestSample}/>
        </div>
    )

}

const Home = ()=>(<h1> Home </h1>);
const Main = ()=>
    (
    <h1>
        Main
    </h1>
    )
export default  App;