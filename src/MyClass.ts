import { Validate, Validators } from "../src";

@Validate
export class MyClass {
    @Validators.String
    name: string;

    @Validators.Number
    age: number;

    @Validators.BigInt
    mouseCount: BigInt;

    @Validators.Boolean
    isSmoker: boolean;

    @Validators.Symbol
    instance: Symbol;

    @Validators.Undefined
    undefinedRef: undefined;

    @Validators.Object
    address: Object;

    @Validators.Function
    greet: Function

    constructor(data: any) {
        this.name = data.name;
        this.age = data.age;
        this.mouseCount = data.mouseCount;
        this.isSmoker = data.isSmoker;
        this.instance = data.instance;
        this.address = data.address;
        this.greet = data.greet;
    }
}