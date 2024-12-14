import {create} from "zustand";

interface useStoreModalProps {
    isOpen: boolean;
    onClose:()=> void;
    onOpen:()=> void;
}

export const useStoreModal =
    create<useStoreModalProps>
    ((set) =>
        ({
    isOpen:false,
    onOpen: ()=> set({isOpen:true}),
    onClose: ()=> set({isOpen:false}),

}))