/*
  3243 - FlattenDepth
  -------
  by jiangshan (@jiangshanmeta) #medium #array
  
  ### Question
  
  Recursively flatten array up to depth times.
  
  For example:
  
  ```typescript
  type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2> // [1, 2, 3, 4, [5]]. flattern 2 times
  type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, [[5]]]. Depth defaults to be 1
  ```
  
  If the depth is provided, it's guaranteed to be positive integer.
  
  > View on GitHub: https://tsch.js.org/3243
*/


/* _____________ Your Code Here _____________ */

// type FlattenDepth<T, U extends number = 1> 
//     = T extends [infer First, ...infer Remains]
//         ? First extends unknown[]
//             ? [First, ...FlattenDepth<Remains, U>] 
//             // Type instantiation is excessively deep and possibly infinite.
//             // 무한루프에 빠져버림
//             : [...FlattenDepth<First, U>, ...FlattenDepth<Remains, U>]
//         : [First, ...FlattenDepth<Remains, U>]

type FlattenDepth<T, K extends number = 1, U extends unknown[] = []> // 무한 루프를 회피하기 위해 빈 배열을 받아 이 배열의 길이를 이용
    = T extends [infer First, ...infer Remains] // 두 부분으로 나누고
        ? First extends unknown[] // 만약 First가 배열이고
            ? U['length'] extends K // 그리고 배열 U의 길이가 K와 같다면 (처음엔 길이가 0이다)
                ? [First, ...FlattenDepth<Remains, K, U>] // 한 번의 flatten 과정이 있었으므로 배열의 나머지 부분으로 재귀
                : [...FlattenDepth<First, K, [0, ...U]>, ...FlattenDepth<Remains, K, U>] 
                // U의 길이가 K와 다르다면 U에 임의로 0을 추가하여 길이를 늘림 (무한루프 탈출을 위함)
            : [First, ...FlattenDepth<Remains, K, U>] // First가 배열이 아니라면 나머지 요소에 배열이 있을 수도 있으니 나머지 요소로 재귀
        : T; // First가 배열이 아니라면 T를 그대로 반환

type result = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>;
// [[[5]]]와 같이 배열 내에 하나의 요소만 갖는 2중 이상의 배열을 가진다면 ...FlattenDepth<Remains, K, U>는 실행되지 않을 수도 있다
/* _____________ Test Cases _____________ */
import { Equal, Expect, ExpectFalse, NotEqual } from '@type-challenges/utils'

type cases = [
  Expect<Equal<FlattenDepth<[]>, []>>,
  Expect<Equal<FlattenDepth<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<FlattenDepth<[1, [2]]>, [1, 2]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, [[5]]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 3>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 19260817>, [1, 2, 3, 4, 5]>>,
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/3243/answer
  > View solutions: https://tsch.js.org/3243/solutions
  > More Challenges: https://tsch.js.org
*/

