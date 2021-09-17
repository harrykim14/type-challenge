/*
  3188 - Tuple to Nested Object
  -------
  by jiangshan (@jiangshanmeta) #medium #object
  
  ### Question
  
  Given a tuple type ```T``` that only contains string type, and a type ```U```, build an object recursively.
  
  ```typescript
  type a = TupleToNestedObject<['a'], string> // {a: string}
  type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
  type c = TupleToNestedObject<[], boolean> // boolean. if the tuple is empty, just return the U type
  ```
  
  > View on GitHub: https://tsch.js.org/3188
*/


/* _____________ Your Code Here _____________ */

type TupleToNestedObject<T, U> 
    = T extends [infer First, ...infer Remains] 
        ? First extends string
            ? { [P in First]:TupleToNestedObject<Remains, U> }
            : never
        : U
// 재귀적으로 배열을 쪼개는 것 까지는 구현했으나 
// 그 이후에 First값이 string인지(key값으로 설정할 배열 내 요소)를 구분하여야 했음

/* _____________ Test Cases _____________ */
import { Equal, Expect, ExpectFalse, NotEqual } from '@type-challenges/utils'

type cases = [
  Expect<Equal<TupleToNestedObject<['a'], string>, {a: string}>>,
  Expect<Equal<TupleToNestedObject<['a', 'b'], number>, {a: {b: number}}>>,
  Expect<Equal<TupleToNestedObject<['a', 'b', 'c'], boolean>, {a: {b: {c: boolean}}}>>,
  Expect<Equal<TupleToNestedObject<[], boolean>, boolean>>,
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/3188/answer
  > View solutions: https://tsch.js.org/3188/solutions
  > More Challenges: https://tsch.js.org
*/

