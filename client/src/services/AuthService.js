const API_URL = "http://localhost:3200/auth/";

class AuthService {
    register(user) {
        return fetch(API_URL + "register", {
            method: "POST",
            body: JSON.stringify({
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName
            }),
            headers: { "Content-Type": "application/json" }
        });
    }

    signIn(email, password) {
        return fetch(API_URL + "sign-in", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" }

        })
            .then(response => response.json())
            .then(response => {
                if (response.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response));
                }

                return response;
            });
    }

    signOut() {
        localStorage.removeItem("user");
        window.location.reload();
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();