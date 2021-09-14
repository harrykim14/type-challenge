/*
  612 - KebabCase
  -------
  by Johnson Chu (@johnsoncodehk) #medium #template-literal
  
  ### Question
  
  `FooBarBaz` -> `for-bar-baz`
  
  > View on GitHub: https://tsch.js.org/612
*/


/* _____________ Your Code Here _____________ */

type KebabCase<S, T extends string = ''> 
    = S extends `${infer First}${infer Remains}` // 주어진 문자열을 두 부분으로 나누기
        ? First extends Lowercase<First> // 첫 글자가 소문자라면
            ? `${First}${KebabCase<Remains, '-'>}` // 그대로 두고 나머지 부분과 앞에 붙일 '-' 문자를 설정
            : `${T}${Lowercase<First>}${KebabCase<Remains, '-'>}` 
            // First가 대문자라면 소문자로 바꾸고 앞에 '-'를 붙인다
        : S

/* _____________ Test Cases _____________ */
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<KebabCase<'FooBarBaz'>, 'foo-bar-baz'>>,
  Expect<Equal<KebabCase<'fooBarBaz'>, 'foo-bar-baz'>>,
  Expect<Equal<KebabCase<'foo-bar'>, 'foo-bar'>>,
  Expect<Equal<KebabCase<'foo_bar'>, 'foo_bar'>>,
  Expect<Equal<KebabCase<'Foo-Bar'>, 'foo--bar'>>,
  Expect<Equal<KebabCase<'ABC'>, 'a-b-c'>>,
  Expect<Equal<KebabCase<'-'>, '-'>>,
  Expect<Equal<KebabCase<''>, ''>>,
  Expect<Equal<KebabCase<'😎'>, '😎'>>,
]

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/612/answer
  > View solutions: https://tsch.js.org/612/solutions
  > More Challenges: https://tsch.js.org
*/

