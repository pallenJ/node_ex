import axios from 'axios'

const url = "http://recruit-api.yonple.com/recruit/963921";
export default {
    getList : async(params:any, type = "a" )=>{
        try {

            console.log(`${url}/${type}-posts`);
            console.log(`${JSON.stringify(params)}`);
            console.log(`${JSON.stringify(params.search)}`);
            return (await axios.get(`${url}/${type}-posts`,{params})).data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }    
}
