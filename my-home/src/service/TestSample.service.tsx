import axios from "axios";
import React from "react";
import serverInfo from '../serverInfo.json'

export default this;
export const getList = async ({start= 0,limit = 20}:any)=>{
  try {
    return await axios.get(`${serverInfo.BASE_URL}/testSample`, { params: { start, limit } });
  } catch (err) {
    return err;
  }
}
export const addOne = async({writer,content,password}:any)=>{
  try{
    return await axios.post(`${serverInfo.BASE_URL}/testSample/add`,{writer,content,password})
  }catch(err){
    return err;
  }
}
