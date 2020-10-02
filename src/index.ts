import 'reflect-metadata';

const ValidateAsString = Symbol('ValidateAsString');

namespace Factories {
    export function PrimitiveDecoratorFactory(typename: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'): PropertyDecorator {
        return function validator(target, propertyKey) {

            const prop = Symbol(`__v-${propertyKey.toString()}`);
            Object.defineProperties(target, {
                [prop]: {
                    enumerable: false,
                    writable: true
                },
                [propertyKey]: {
                    get() { return this[prop]; },
                    set(value) {
                        if (typeof value !== typename) throw new TypeError(`${propertyKey.toString()} must be ${typename}`);
                        this[prop] = value;
                    },
                    enumerable: true
                }
            })
        }
    }
}

export namespace Validators {
    export const String = Factories.PrimitiveDecoratorFactory('string');

    export const Number = Factories.PrimitiveDecoratorFactory('number');

    export const BigInt = Factories.PrimitiveDecoratorFactory('bigint');

    export const Boolean = Factories.PrimitiveDecoratorFactory('boolean');

    export const Symbol = Factories.PrimitiveDecoratorFactory('symbol');

    export const Undefined = Factories.PrimitiveDecoratorFactory('undefined');

    export const Object = Factories.PrimitiveDecoratorFactory('object');

    export const Function = Factories.PrimitiveDecoratorFactory('function');
}

export namespace Utilities {
    export function fromJson<T>(data: string, type: new () => T) {
        const object = JSON.parse(data);
        const keys = Object.keys(object);
        const instance = new type();
        keys.forEach(key => instance[key] = object[key]);
        return instance as T;
    }
}
