/*
  3192 - Reverse
  -------
  by jiangshan (@jiangshanmeta) #medium #tuple
  
  ### Question
  
  Implement the type version of ```Array.reverse```
  
  For example:
  
  ```typescript
  type a = Reverse<['a', 'b']> // ['b', 'a']
  type b = Reverse<['a', 'b', 'c']> // ['c', 'b', 'a']
  ```
  
  > View on GitHub: https://tsch.js.org/3192
*/


/* _____________ Your Code Here _____________ */

// 첫 번째 방법: 배열을 세 부분으로 나누는 법
type Reverse<T> 
    = T extends [infer Front, ...infer Remains, infer Last] 
        ? Remains extends [] 
            ? [Last, Front]
            : [Last, ...Reverse<Remains>, Front] 
        : T;

// 두 번째 방법: 배열을 두 부분으로 나누는 법
// type Reverse<T> = T extends [infer First, ...infer Remains] 
//                     ? [...Reverse<Remains>, First]
//                     : [];

/* _____________ Test Cases _____________ */
import { Equal, Expect, ExpectFalse, NotEqual } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Reverse<['a', 'b']>, ['b', 'a']>>,
  Expect<Equal<Reverse<['a', 'b', 'c']>, ['c', 'b', 'a']>>
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/3192/answer
  > View solutions: https://tsch.js.org/3192/solutions
  > More Challenges: https://tsch.js.org
*/

