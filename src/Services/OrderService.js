import axios from "axios";
import UserService from "./UserService";
const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/order'

class OrderService{

    getAllTodayOrders(pageNumber, pageSize){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all/today/${pageNumber}/${pageSize}`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }

    getOrderById(orderId){
        return axios.get(`${PIZZERIA_API_BASE_URL}/${orderId}`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }

    addOrder(order) {
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, order, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }

    updateOrder(order) {
        return axios.put(`${PIZZERIA_API_BASE_URL}/update`, order, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }

}
const orderServiceInstance = new OrderService();
export default orderServiceInstance;