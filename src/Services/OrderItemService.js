import axios from "axios";
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/orderItem'
class OrderItemService{
    addOrderItem(orderItem) {
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, orderItem, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }

    verifyItemAvailability(itemAvailabilityRequest) {
        return axios.post(`${PIZZERIA_API_BASE_URL}/verify-availability`, itemAvailabilityRequest);
    }
    getOrderItemsByClientId(clientId){
        return axios.get(`${PIZZERIA_API_BASE_URL}/client/${clientId}`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }
    deleteOrderItem(Id){
        return axios.delete(`${PIZZERIA_API_BASE_URL}/delete/${Id}`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }

    updateOrderItem(orderItem){
        return axios.put(`${PIZZERIA_API_BASE_URL}/update`, orderItem, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }
}

const orderItemServiceInstance = new OrderItemService();
export default orderItemServiceInstance;