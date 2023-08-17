import axios from "axios";
const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/employee'

class EmployeeService{

    getEmployeeById(id){
        return axios.get(`${PIZZERIA_API_BASE_URL}/${id}`)
    }
}
const employeeServiceInstance = new EmployeeService();
export default employeeServiceInstance;