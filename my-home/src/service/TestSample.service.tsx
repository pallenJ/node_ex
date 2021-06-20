import axios from "axios";
import React from "react";
import serverInfo from '../serverInfo.json'

export default this;
export const getList = ({start= 0,limit = 20}:any)=>{
  return axios.get(`${serverInfo.BASE_URL}/testSample`,{params:{start,limit}}).then(
      e =>{return e}
  ).catch(err =>{return err});

}

