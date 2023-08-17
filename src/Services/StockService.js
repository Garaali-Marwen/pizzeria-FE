import axios from "axios";
import UserService from "./UserService";
const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/stockItem'

class StockService{

    getStock(pageNumber, pageSize){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all/${pageNumber}/${pageSize}`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }

    addStockItem(stockItem){
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, stockItem,  { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }

    updateStockItem(stockItem){
        return axios.put(`${PIZZERIA_API_BASE_URL}/update`, stockItem,  { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }


}
const stockServiceInstance = new StockService();
export default stockServiceInstance;