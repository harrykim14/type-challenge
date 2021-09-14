/*
  599 - Merge
  -------
  by ZYSzys (@ZYSzys) #medium #object
  
  ### Question
  
  Merge two types into a new type. Keys of the second type overrides keys of the first type.
  
  > View on GitHub: https://tsch.js.org/599
*/


/* _____________ Your Code Here _____________ */
// 첫 번째 방법
// type CreateMergedType<T> = {
//     [P in keyof T]: T[P]
// }
// type Merge<F, S> = CreateMergedType<{
//     [P in keyof F as P extends keyof S ? never : P]: F[P]
// } & S>

// 두 번째 방법
type Merge<F, S> = {
    [P in keyof (F & S)] : P extends keyof S // F와 S의 키들을 전부 순회하며 S에 있는 키인지 검사
    ? S[P] // S의 필드를 먼저 채워넣고
    : P extends keyof F 
        ? F[P] // 그 후에 F의 필드를 채워넣음 (공통된 부분은 override 되지 않음)
        : never 
};

/* _____________ Test Cases _____________ */
import { Equal, Expect } from '@type-challenges/utils'

type Foo = {
  a: number;
  b: string;
};
type Bar = {
  b: number;
  c: boolean;
};

type cases = [
  Expect<Equal<Merge<Foo, Bar>, {
	a: number;
	b: number;
	c: boolean;
  }>>
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/599/answer
  > View solutions: https://tsch.js.org/599/solutions
  > More Challenges: https://tsch.js.org
*/

