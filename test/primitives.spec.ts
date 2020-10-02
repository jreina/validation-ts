import { expect } from 'chai';

import { MyClass } from './MyClass';

const mutations = {
    name: 10,
    age: '43',
    mouseCount: 2,
    isSmoker: 'true',
    instance: 'Symbol',
    address: '{}',
    greet: 'Hello, my name is P. Sherman'
};

describe('Validate', () => {

    const template = {
        name: 'P. Sherman',
        age: 43,
        mouseCount: BigInt(1),
        isSmoker: true,
        instance: Symbol(),
        address: {
            street: '42 Wallaby Way',
            city: 'Syndey',
            country: 'Australia'
        },
        greet: function () {
            console.log(`Hello, my name is ${this.name}`);
        }
    };

    describe('Error scenarios', () => {

        it('Should throw an error when a property is changed to an invalid value after model creation', () => {
            const instance = new MyClass(template);

            // @ts-ignore
            expect(() => instance.age = 'Hello').to.throw(TypeError);
        });

        [...Object.entries(mutations)].forEach(([key, val]) => {
            it(`Should throw an error when ${key} is a ${typeof val}`, function () {
                expect(() => {
                    const a = new MyClass({ ...template, [key]: val });
                }).to.throw(TypeError);
            })
        });
    });

    describe('Success scenarios', () => {
        it('Should not throw any errors when validation passes', () => {
            expect(() => new MyClass(template)).to.not.throw();
        });

        it('Should not affect values on one instance when another instance is changed', () => {
            const instance1 = new MyClass(template);
            const instance2 = new MyClass(template);

            instance1.age = 22;
            expect(instance1.age).to.eq(22);
            expect(instance2.age).to.eq(template.age);

            instance2.name = 'Bae';
            expect(instance2.name).to.eq('Bae');
            expect(instance1.name).to.eq(template.name);
        });
    });
});