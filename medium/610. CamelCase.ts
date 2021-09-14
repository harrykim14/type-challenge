/*
  610 - CamelCase
  -------
  by Johnson Chu (@johnsoncodehk) #medium #template-literal
  
  ### Question
  
  `for-bar-baz` -> `forBarBaz`
  
  > View on GitHub: https://tsch.js.org/610
*/


/* _____________ Your Code Here _____________ */
// 첫 번째 시도: `Expect<Equal<CamelCase<'foo--bar----baz'>, 'foo-Bar---Baz'>>`를 통과하지 못함
type Failed_CamelCase<S> 
    = S extends `${infer Front}-${infer Target}${infer Remains}` // '-' 문자 앞 부분, '-' 문자, '-'의 바로 다음 문자(Target), 나머지로 분리
        ? Target extends Uppercase<Target> // 타겟 문자가 대문자라면
            ? `${Front}-${Target}${CamelCase<Remains>}` // 타겟을 그대로 둔 채로 나머지를 매개변수로 하여 CamelCase로 재귀
            : `${Front}${Uppercase<Target>}${CamelCase<Remains>}` // 대문자가 아니라면 -를 지우고 Uppercase를 적용 후 나머지를 재귀
        : S;

// 두 번째 시도: Capitalize를 사용하여 해결
type CamelCase<S>
    = S extends `${infer Front}${infer Remains}` // 두 부분으로 나누고
        ? Front extends '-' // 앞 문자가 '-'라면
            ? Remains extends Capitalize<Remains> // 나머지 부분이 이미 Capitalize된 문자열인지 확인
                ? `${Front}${CamelCase<Remains>}` // 참이라면 '-'를 없애지 않고 나머지 문자열을 매개변수로 재귀
                : CamelCase<Capitalize<Remains>> // 거짓이라면 '-'를 제거하고 나머지 문자열로 재귀
            : `${Front}${CamelCase<Remains>}` // Capitalize되지 않았다면 '-'를 제거하고 나머지 문자열로 재귀
        : S

/* _____________ Test Cases _____________ */
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<CamelCase<'foo-bar-baz'>, 'fooBarBaz'>>,
  Expect<Equal<CamelCase<'foo-Bar-Baz'>, 'foo-Bar-Baz'>>,
  Expect<Equal<CamelCase<'foo-bar'>, 'fooBar'>>,
  Expect<Equal<CamelCase<'foo_bar'>, 'foo_bar'>>,
  Expect<Equal<CamelCase<'foo--bar----baz'>, 'foo-Bar---Baz'>>,
  Expect<Equal<CamelCase<'a-b-c'>, 'aBC'>>,
  Expect<Equal<CamelCase<'a-b-c-'>, 'aBC-'>>,
  Expect<Equal<CamelCase<'ABC'>, 'ABC'>>,
  Expect<Equal<CamelCase<'-'>, '-'>>,
  Expect<Equal<CamelCase<''>, ''>>,
  Expect<Equal<CamelCase<'😎'>, '😎'>>,
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/610/answer
  > View solutions: https://tsch.js.org/610/solutions
  > More Challenges: https://tsch.js.org
*/

