import axios from 'axios'
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/item'
class ItemService {

    getAllItems(pageNumber, pageSize){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all/${pageNumber}/${pageSize}`)
    }

    findAllItems(){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all`)
    }

    getItemsByItemIngredientsIsNull(){
        return axios.get(`${PIZZERIA_API_BASE_URL}/drinks`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }

    addItem(formData) {
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, formData, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }

    editItem(formData) {
        return axios.put(`${PIZZERIA_API_BASE_URL}/update`, formData, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }
}

const itemServiceInstance = new ItemService();
export default itemServiceInstance;