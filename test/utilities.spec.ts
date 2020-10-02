import { Utilities } from "../src";
import { Person } from "./Person";
import { expect } from "chai";

describe('Utilities', () => {
    describe('fromJson', () => {
        const template = { firstName: 'P', lastName: 'Sherman', age: 42 };

        describe('Success scenarios', () => {
            it('Should deserialize properly', () => {
                const input = JSON.stringify(template);

                const actual = Utilities.fromJson<Person>(input, Person);

                expect(actual).to.eql(template);
            });
        });

        describe('Error scenarios', () => {
            it('Should throw an error when JSON does not match schema', function () {
                const input = JSON.stringify({ ...template, age: '10 ' });

                expect(() => Utilities.fromJson(input, Person)).to.throw(TypeError);
            });

        });
    });
});