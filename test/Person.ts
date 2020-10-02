import { Validators } from "../src";

export class Person {
    @Validators.String
    firstName!: string;
    @Validators.String
    lastName!: string;
    @Validators.Number
    age!: number;
}