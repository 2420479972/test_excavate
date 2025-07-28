import { createStorage } from '@wagmi/vue'
// Using IndexedDB via https://github.com/jakearchibald/idb-keyval
import { del, get, set } from 'idb-keyval'

export const storage = createStorage({
    storage: {
        async getItem(name) {
            return get(name)
        },
        async setItem(name, value) {
            await set(name, value)
        },
        async removeItem(name) {
            await del(name)
        },
    },
})