
/*
  119 - ReplaceAll
  -------
  by Anthony Fu (@antfu) #medium #template-literal
  
  ### Question
  
  Implement `ReplaceAll<S, From, To>` which replace the all the substring `From` with `To` in the given string `S`
  
  For example
  
  ```ts
  type replaced = ReplaceAll<'t y p e s', ' ', ''> // expected to be 'types'
  ```
  
  > View on GitHub: https://tsch.js.org/119
*/


/* _____________ Your Code Here _____________ */

type ReplaceAll<S extends string, From extends string, To extends string> 
= From extends '' // 문자열이 아무것도 없을 때의 예외 처리용 구문
    ? S 
    : S extends `${infer Front}${From}${infer Last}` // 문자열 내에 `From`이 있다면 `From`을 중심으로 나누기
        ? `${Front}${To}${ReplaceAll<Last, From, To>}` 
        // 해당 문자열은 앞에서부터 바꿔나가므로 바뀐 문자열을 제외한 Last 문자열들만 ReplaceAll의 매개변수로 재귀
        : S;

/* _____________ Test Cases _____________ */
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<ReplaceAll<'foobar', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<ReplaceAll<'foobarbar', 'bar', 'foo'>, 'foofoofoo'>>,
  Expect<Equal<ReplaceAll<'t y p e s', ' ', ''>, 'types'>>,
  Expect<Equal<ReplaceAll<'foobarbar', '', 'foo'>, 'foobarbar'>>,
  Expect<Equal<ReplaceAll<'barfoo', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<ReplaceAll<'foobarfoobar', 'ob', 'b'>, 'fobarfobar'>>,
  Expect<Equal<ReplaceAll<'foboorfoboar', 'bo', 'b'>, 'foborfobar'>>,
  Expect<Equal<ReplaceAll<'', '', ''>, ''>>,
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/119/answer
  > View solutions: https://tsch.js.org/119/solutions
  > More Challenges: https://tsch.js.org
*/

