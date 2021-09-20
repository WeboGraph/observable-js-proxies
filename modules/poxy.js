class ProxyObject {
    observer = new Set()

    constructor (value = {}) {
        for (let [k, v] of Object.entries(value)) {
            if (typeof v === 'object' && !v.isProxy) {
                value[k] = new makeObservable(v)
            }

            this[k] = value[k]
        }
    }

    handler () {
        return ((observer) => ({
            get: (target, key) => (key === 'isProxy') ? true : target[key],
            set (target, prop, value) {
                observer.forEach(o => {
                    const [name, callback, once = false] = o

                    if (name === prop) {
                        callback(value)
                        if (once) {
                            observer.delete(o)
                        }
                    }
                })
    
                const preparedValue = (typeof value === 'object' && !value.isProxy) ? makeObservable(value) : value
                return Reflect.set(target, prop, preparedValue)
            }
        }))(this.observer)
    }

    observe (name, callback, once) {
        this.observer.add([name, callback, once])

        return this[name]
    }
}


function makeObservable (value) {
    if (typeof value === 'object' && !value.isProxy) {
        const observable = new ProxyObject(value)
        return new Proxy(observable, observable.handler())
    } else {
        return value
    }
}


export default makeObservable