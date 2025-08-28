import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {USERS_BACKEND_URL} from "../settings";

const useAuthStore = create(
    persist(
        (set, get) => ({
            token: null,
            isLoggedIn: false,
            user: null,
            loading: false,
            error: null,
            successMessage: null,

            setToken: (token) => {
                set({token, isLoggedIn: !!token});
            },

            setIsLoggedIn: (isLoggedIn) => set({isLoggedIn}),
            setUser: (user) => set({user}),
            setLoading: (loading) => set({loading}),
            setError: (error) => set({error}),
            setSuccessMessage: (message) => set({successMessage: message}),
            resetError: () => set({error: null, successMessage: null}),

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isLoggedIn: false,
                    loading: false,
                    error: null,
                    successMessage: null,
                });
            },

            changePassword: async ({oldPassword, newPassword1, newPassword2}) => {
                set({loading: true, error: null, successMessage: null});
                try {
                    const token = get().token;
                    const response = await fetch(`${USERS_BACKEND_URL}password/change/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Token ${token}`,
                        },
                        body: JSON.stringify({
                            old_password: oldPassword,
                            new_password1: newPassword1,
                            new_password2: newPassword2,
                        }),
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.detail || "Błąd zmiany hasła");
                    }

                    set({successMessage: "Hasło zostało zmienione pomyślnie!"});
                } catch (err) {
                    set({error: err.message});
                } finally {
                    set({loading: false});
                }
            },

            fetchUser: async () => {
                set({loading: true, error: null});
                const token = get().token;
                try {
                    const res = await fetch(`${USERS_BACKEND_URL}user/`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Token ${token}`,
                        },
                    });

                    if (!res.ok) {
                        set({error: 'Nie udało się pobrać danych użytkownika', loading: false});
                        return null;
                    }

                    const data = await res.json();
                    set({user: data, loading: false, error: null});
                    return data;
                } catch (error) {
                    set({error: 'Błąd sieci przy pobieraniu danych użytkownika', loading: false});
                    return null;
                }
            },

            updateUserData: async (updatedData) => {
                set({loading: true, error: null, successMessage: null});
                const token = get().token;

                try {
                    const res = await fetch(`${USERS_BACKEND_URL}user/`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Token ${token}`,
                        },
                        body: JSON.stringify(updatedData),
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        set({error: JSON.stringify(errorData), loading: false});
                        return false;
                    }

                    const data = await res.json();
                    set({
                        user: data,
                        loading: false,
                        error: null,
                        successMessage: 'Dane użytkownika zostały zaktualizowane'
                    });
                    return true;
                } catch (error) {
                    set({error: 'Błąd aktualizacji danych', loading: false});
                    return false;
                }
            },

            registerUser: async (formData) => {
                set({loading: true, error: null, successMessage: null});
                try {
                    const res = await fetch(`${USERS_BACKEND_URL}registration/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
                    const data = await res.json();

                    if (!res.ok) {
                        return {success: false, errors: data};
                    }

                    return {success: true};
                } catch (err) {
                    return {success: false, errors: {general: [err.message]}};
                } finally {
                    set({loading: false});
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                isLoggedIn: state.isLoggedIn,
                user: state.user,
            }),
        }
    )
);

export default useAuthStore;
