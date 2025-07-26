import {create} from 'zustand';

// const useGlobalInfoStore = create((set) => ({
//     message: null,
//     type: 'info',
//
//     setMessage: (message) => set({ message }),
//     clearMessage: () => set({ message: null }),
//
//     setType: (type) => set({ type }),
//     resetType: () => set({ type: 'info' }),
// }));
//
// export default useGlobalInfoStore;

const useGlobalInfoStore = create((set) => ({
    message: null,
    type: 'info',
    timeoutId: null,

    setMessage: (message) => set({message}),
    clearMessage: () => set({message: null}),
    setType: (type) => set({type}),
    resetType: () => set({type: 'info'}),
    setTimeoutId: (timeoutId) => set({timeoutId}),
}));

export default useGlobalInfoStore;