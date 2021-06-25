import axios from "axios";
import React from "react";
import serverInfo from '../serverInfo.json'




export default {
  getList : async (params:any)=>{
    try {
      return await axios.get(`${serverInfo.BASE_URL}/testSample`, { params});
    } catch (err) {
      return err;
    }
  },
  addOne : async(params:any)=>{
    try{
      delete params.bno;
      return await axios.post(`${serverInfo.BASE_URL}/testSample/add`,params)
    }catch(err){
      return err;
    }
  
  },
  edit : async(bno:number|string,params:any)=>{
    try {
      delete params.password;
      delete params.writer;
      return await axios.patch(`${serverInfo.BASE_URL}/testSample/edit/${bno}`,params);
    } catch (err) {
      return err;
    }
  },
  pwCheck : async(bno:number|string,password:string)=>{
    try {
      return await axios.post(`${serverInfo.BASE_URL}/testSample/pwCheck/${bno}`,{password});
    } catch (err) {
      return err;
    }
  },
  deleteOne : async(bno:number|string,params:any)=>{
    try {
      return await axios.delete(`${serverInfo.BASE_URL}/testSample/delete/${bno}`,{data:params});
    } catch (err) {
      return err;
    }
  }
  

};