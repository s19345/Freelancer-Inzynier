import {create} from 'zustand';

const useGlobalInfoStore = create((set) => ({
    message: null,
    type: 'info',

    setMessage: (message) => set({message}),
    clearMessage: () => set({message: null}),
    setType: (type) => set({type}),
    resetType: () => set({type: 'info'}),
}));

export default useGlobalInfoStore;