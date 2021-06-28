import axios from 'axios'

const url = "http://recruit-api.yonple.com/recruit/963921";
export default {
    getList : async(params:any, type = "a" )=>{
        try {

            return (await axios.get(`${url}/${type}-posts`,{params})).data;
        } catch (err) {
            console.error(err);
            return err;
        }
    },
    getDetail : async(id:number|string,type = 'a')=>{
        try {
            return (await axios.get(`${url}/${type}-posts/${id}`)).data;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

}
