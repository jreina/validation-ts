# Validation Decorators
*Decorator-based validators for classes*

## Why?
Validation in TypeScript is quite fractured and everyone does it differently. The existing solutions are great but become cumbersome to maintain. I want a way to do validation that feels intuitive and is apparent from looking at a model definition.

## Using
```typescript
import { Validators, Utilities } from "../src";

class Person {
    @Validators.String
    name!: string;
}
const data = '{"name":"P Sherman"}';
const instance = Utilities.fromJson<Person>(data, Person);

const badData = '{"name":null}';
const invalid = Utilities.fromJson<Person>(badData, Person); // throws a TypeError
```