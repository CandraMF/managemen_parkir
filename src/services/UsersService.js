import http from "../http-common"

class UsersService {
    getAll() {
        return  http.get("/user")
    }
    add(user) {
        return  http.post("/user", {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'password': user.password,
        })
    }
    edit(id, name, email) {
        return  http.put("/user", {
            'id': id,
            'name': name,
            'email': email,
        })
    }
    editRole(id, role) {
        return  http.put("/user/editRole", {
            'id': id,
            'role': role,
        })
    }
    changePassword(id, oldPassword, newPassword) {
        return  http.put("/user/changePassword", {
            'id': id,
            'oldPassword': oldPassword,
            'newPassword': newPassword,
        })
    }
    findOne(id){
        return  http.get("/user/"+id)
    }
    delete(id) {
        return http.delete("/user/" + id)
    }
}


export default new UsersService