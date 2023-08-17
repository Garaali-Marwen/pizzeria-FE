import axios from 'axios'
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/itemIngredient'
class ItemIngredientService {

    getAllItemIngredients(){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all`)
    }

    addItemIngredient(itemIngredient) {
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, itemIngredient, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }
}

const item_ingredientServiceInstance = new ItemIngredientService();
export default item_ingredientServiceInstance;