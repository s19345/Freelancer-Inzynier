import {create} from 'zustand'

const useAuthStore = create((set) => ({
    token: null,
    isLoggedIn: false,
    user: null,
    loading: false,
    error: null,
    successMessage: null,
    setToken: (token) => set({token}),
    setIsLoggedIn: (isLoggedIn) => set({isLoggedIn}),
    setUser: (user) => set({user}),
    setLoading: (loading) => set({loading}),
    setError: (error) => set({error}),
    setSuccessMessage: (message) => set({successMessage: message}),

    logout: () => set({
        user: null,
        token: null,
        isLoggedIn: false,
        loading: false,
        error: null,
        successMessage: null,
    }),
}))

export default useAuthStore;