import axios from "axios";
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/order'

class OrderService {

    getAllTodayOrders(pageNumber, pageSize) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/all/today/${pageNumber}/${pageSize}`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getAllTodayOrdersForMap() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/all`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getOrderById(orderId) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/${orderId}`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    addOrder(order) {
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, order, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    updateOrder(order) {
        return axios.put(`${PIZZERIA_API_BASE_URL}/update`, order, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getOrdersForActualDay() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/day`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getOrdersForActualWeek() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/week`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getOrdersForActualMonth() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/month`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    countOrdersByClient_Id(id) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/client/${id}`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getOrdersByOrderTypeAndDate() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/type`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getOrdersByClient_Id(id, pageNumber, pageSize) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/client/orders/${id}/${pageNumber}/${pageSize}`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getOrdersOfTodayByClient_IdOrderByDateDesc(id, pageNumber, pageSize) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/client/orders/today/${id}/${pageNumber}/${pageSize}`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getOrdersByClient_IdAndState_PendingOrderByDateDesc(id, pageNumber, pageSize) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/client/orders/pending/${id}/${pageNumber}/${pageSize}`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getOrdersByClient_IdAndState_ReadyOrderByDateDesc(id, pageNumber, pageSize) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/client/orders/ready/${id}/${pageNumber}/${pageSize}`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

}

const orderServiceInstance = new OrderService();
export default orderServiceInstance;