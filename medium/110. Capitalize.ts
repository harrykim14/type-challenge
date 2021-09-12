/*
  110 - Capitalize
  -------
  by Anthony Fu (@antfu) #medium #template-literal
  
  ### Question
  
  Implement `Capitalize<T>` which converts the first letter of a string to uppercase and leave the rest as-is.
  
  For example
  
  ```ts
  type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'
  ```
  
  > View on GitHub: https://tsch.js.org/110
*/


/* _____________ Your Code Here _____________ */

type Capitalize<S extends string> = S extends `${infer First}${infer Remains}` ? `${Uppercase<First>}${Remains}` : S;
// 문자열을 앞뒤로 나누는 것은 앞 문제들로 배웠으니 Uppercase<S> 제네릭이 있다는 것을 알면 금방 풀 수 있는 문제

/* _____________ Test Cases _____________ */
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Capitalize<'foobar'>, 'Foobar'>>,
  Expect<Equal<Capitalize<'FOOBAR'>, 'FOOBAR'>>,
  Expect<Equal<Capitalize<'foo bar'>, 'Foo bar'>>,
  Expect<Equal<Capitalize<''>, ''>>,
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/110/answer
  > View solutions: https://tsch.js.org/110/solutions
  > More Challenges: https://tsch.js.org
*/

