/*
  1367 - Remove Index Signature
  -------
  by hiroya iizuka (@hiroyaiizuka) #medium 
  
  ### Question
  
  Implement `RemoveIndexSignature<T>` , exclude the index signature from object types.
  
  For example:
  
  ```
  
  type Foo = {
    [key: string]: any;
    foo(): void;
  }
  
  type A = RemoveIndexSignature<Foo>  // expected { foo(): void }
  
  ```
  
  > View on GitHub: https://tsch.js.org/1367
*/


/* _____________ Your Code Here _____________ */

// 첫 번째 시도: P가 string이거나 number라면 never를 반환하도록 하였으나 실패
// type RemoveIndexSignature<T> = {
//     [P in keyof T] : P extends [string | number] ? never : T[P];
// }
type RemoveIndexSignature<T> = {
    [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P];
    // 타입을 구성하는 삼항연산자에서는 유니온 타입으로 extends 키워드를 사용할 수 없다
}

/* _____________ Test Cases _____________ */
import { Equal, Expect } from '@type-challenges/utils'


type Foo = {
  [key: string]: any;
  foo(): void;
}


type Bar = {
  [key: number]: any;
  bar(): void;
}

type Baz = {
  bar(): void;
  baz: string
}


type cases = [
  Expect<Equal< RemoveIndexSignature<Foo>, { foo(): void }>>,
  Expect<Equal< RemoveIndexSignature<Bar>, { bar(): void }>>,
  Expect<Equal< RemoveIndexSignature<Baz>, { bar(): void, baz: string }>>
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/1367/answer
  > View solutions: https://tsch.js.org/1367/solutions
  > More Challenges: https://tsch.js.org
*/

