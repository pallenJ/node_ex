import axios from "axios";
import React from "react";
import serverInfo from '../serverInfo.json'

export default this;
export const getList = ({type = 'page' ,page =1 ,limit = 20}:any)=>{
  return axios.get(`${serverInfo.BASE_URL}/testSample`,{params:{type,page,limit}}).then(
      e =>{return e}
  ).catch(err =>{return err});

}

