import { atom } from "recoil";

export const userAtom = atom({
    key: 'userAtom',
    default: {
        username: "",
        type: ""
    }
})

export const isSignedInAtom = atom({
    key: 'isSignedInAtom',
    default: false
})