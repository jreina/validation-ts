import 'reflect-metadata';

const ValidateAsString = Symbol('ValidateAsString');
const validatorKey = Symbol('Validation.Configs');

namespace Factories {
    export function PrimitiveDecoratorFactory(typename: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'): PropertyDecorator {
        return function validator(target, propertyKey) {
            const meta = Reflect.getMetadata(validatorKey, target) || {};
            meta[propertyKey] = {
                type: typename
            };
            Reflect.defineMetadata(validatorKey, meta, target);
        }
    }
}

export const Validate: ClassDecorator = <T>(target) => {
    const meta = Reflect.getMetadata(validatorKey, target.prototype);

    const proxy = new Proxy(target, {
        construct(target, args, newTarget) {
            const inst = new target(...args);
            
        }
    });

    class WrappedCtr extends target {
        constructor(...rest) {
            super(rest);
        }
    }

    return target;
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
        const meta = Reflect.getMetadata(validatorKey, type.prototype);
        const object = JSON.parse(data);
        const instance = new type();
        applyValidators(object, instance, meta);
        return instance as T;
    }
}
