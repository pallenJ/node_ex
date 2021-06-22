import axios from "axios";
import React from "react";
import serverInfo from '../serverInfo.json'

export default this;
export const getList = async ({start= 0,limit = 20}:any)=>{
  try {
    const e = await axios.get(`${serverInfo.BASE_URL}/testSample`, { params: { start, limit } });
    return e;
  } catch (err) {
    return err;
  }
}
export const addOne = async({writer,content,password}:any)=>{
  try{

  }catch(err){
    
  }
}
