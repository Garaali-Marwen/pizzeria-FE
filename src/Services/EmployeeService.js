import axios from "axios";
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/employee'

class EmployeeService {

    getEmployeeById(id) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/${id}`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}})
    }

    addEmployee(employee) {
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, employee, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}})
    }

    passwordVerification(password, employeeId){
        return axios.post(`${PIZZERIA_API_BASE_URL}/password/verification/${employeeId}`, password, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }

    updateEmployeeImage(formData){
        return axios.put(`${PIZZERIA_API_BASE_URL}/update/image`, formData, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }

    updateEmployeePassword(password, employeeId){
        return axios.put(`${PIZZERIA_API_BASE_URL}/update/password/${employeeId}`, password, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }

    updateEmployee(formData){
        return axios.put(`${PIZZERIA_API_BASE_URL}/update`, formData, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }
}

const employeeServiceInstance = new EmployeeService();
export default employeeServiceInstance;