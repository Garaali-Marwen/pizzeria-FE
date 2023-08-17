import axios from 'axios'
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/ingredient'
class IngredientService {

    getAllIngredientsPagination(pageNumber, pageSize){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all/${pageNumber}/${pageSize}`,
            {headers: {"Authorization" : `Bearer ${UserService.getToken()}`}})
    }

    getAllIngredients(){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all`,
            {headers: {"Authorization" : `Bearer ${UserService.getToken()}`}})
    }

    addIngredient(formData) {
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' , "Authorization" : `Bearer ${UserService.getToken()}`}
        });
    }

    updateIngredient(formData) {
        return axios.put(`${PIZZERIA_API_BASE_URL}/update`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' , "Authorization" : `Bearer ${UserService.getToken()}`}
        });
    }
}

const ingredientServiceInstance = new IngredientService();
export default ingredientServiceInstance;