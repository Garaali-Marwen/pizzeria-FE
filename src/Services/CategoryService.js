import axios from "axios";
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/category'

class CategoryService {

    getAllCategories() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/all`)
    }

    addCategory(category) {
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, category,
            {headers: {"Authorization": `Bearer ${UserService.getToken()}`}})
    }

    getCategoryByItemId(id) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/item/${id}`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}})
    }
    getCategoryIncomeForYear(year) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/income/stats/${year}`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}})
    }

    getOrdersCountByItemAndCategory(categoryId) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/${categoryId}/order-item-count`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}})
    }

    updateCategory(category) {
        return axios.put(`${PIZZERIA_API_BASE_URL}/update`,category, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}})
    }
}

const categoryServiceInstance = new CategoryService();
export default categoryServiceInstance;