import authHeader from "./authHeader";

const API_URL = "http://localhost:3200/";

class UserService {
    getImages(id) {
        return fetch(`${API_URL}images/${id}`, {
            method: "GET",
            headers: authHeader()
        })
    }

    uploadImages(id, form) {
        form.append("id", id);

        return fetch(API_URL + "images", {
            method: "POST",
            headers: authHeader(),
            body: form
        })
    }

    deleteImage(id) {
        return fetch(`${API_URL}image/${id}`, {
            method: "DELETE",
            headers: authHeader()
        })
    }
}

export default new UserService();