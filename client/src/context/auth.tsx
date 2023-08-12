import apiClient from "@/lib/apiClient";
import React, { useContext, useEffect } from "react";

interface AuthContextType {
    user: null | {
        id: Number;
        email: string;
        userName: string;
    };
    login: (token: string) => void;
    logout: () => void;
}

interface AuthContextProps {
    children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthContextProps) => {
    const [user, setUser] = React.useState<null | {
        id: Number;
        email: string;
        userName: string;
    }>(null);
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            apiClient.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;

            apiClient
                .get("/users/find")
                .then((response) => {
                    setUser(response.data.user);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

    const login = async (token: string) => {
        localStorage.setItem("auth_token", token);
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
            apiClient
                .get("/users/find")
                .then((response) => {
                    setUser(response.data.user);
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        delete apiClient.defaults.headers["Authorization"];
        setUser(null);
    };
    const value = { user, login, logout };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
