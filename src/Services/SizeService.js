import axios from "axios";
import UserService from "./UserService";
const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/size'

class SizeService{

    getSizeById(sizeId){
        return axios.get(`${PIZZERIA_API_BASE_URL}/${sizeId}`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }
}
const sizeServiceInstance = new SizeService();
export default sizeServiceInstance;