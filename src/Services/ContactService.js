import axios from 'axios'
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/contact'
class ContactService {

    contact(contact){
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, contact)
    }


}

const contactServiceInstance = new ContactService();
export default contactServiceInstance;