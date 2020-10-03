import 'reflect-metadata';

const ValidatorKey = Symbol('Validation.Configs');
const ValidationStorage = Symbol('ValidationStorage');

namespace Factories {
    export function PrimitiveDecoratorFactory(typename: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'): PropertyDecorator {
        return function validator(target, propertyKey) {
            const meta = Reflect.getMetadata(ValidatorKey, target) || {};
            meta[propertyKey] = {
                type: typename
            };
            Reflect.defineMetadata(ValidatorKey, meta, target);
        }
    }
}

export const Validate: ClassDecorator = (target) => {
    const meta = Reflect.getMetadata(ValidatorKey, target.prototype);
    const keys = Object.keys(meta);
    const propertyMap: PropertyDescriptorMap = {};


    const proxy = new Proxy(target, {
        construct(target, args) {
            // @ts-ignore
            const inst = new target(...args);
            inst[ValidationStorage] = {};
            Utilities.applyValidators(inst, inst[ValidationStorage], meta);
            keys.forEach(key => {
                propertyMap[key] = {
                    get() {
                        return inst[ValidationStorage][key];
                    },
                    set(value: any) {
                        if (typeof value !== meta[key].type) throw new TypeError(`${key} must be ${meta[key].type}`);
                        inst[ValidationStorage][key] = value;
                    }
                }
            });
            Object.defineProperties(inst, propertyMap);
            return inst;
        }
    });

    return proxy;
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

    export function applyValidators(source: any, target: any, rules: { [key: string]: { type: string } }) {
        const keys = Object.keys(rules);
        keys.forEach(key => {
            if (typeof source[key] !== rules[key].type) throw new TypeError(`${key} must be ${rules[key].type}`);
            target[key] = source[key];
        });
    }

    export function fromJson<T>(data: string, type: new () => T) {
        const meta = Reflect.getMetadata(ValidatorKey, type.prototype);
        const object = JSON.parse(data);
        const instance = new type();
        applyValidators(object, instance, meta);
        return instance as T;
    }
}
