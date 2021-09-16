/*
  2757 - PartialByKeys
  -------
  by jiangshan (@jiangshanmeta) #medium #object
  
  ### Question
  
  Implement a generic `PartialByKeys<T, K>` which takes two type argument `T` and `K`.
  
  `K` specify the set of properties of `T` that should set to be optional. When `K` is not provided, it should make all properties optional just like the normal `Partial<T>`.
  
  For example
  
  ```typescript
  interface User {
    name: string
    age: number
    address: string
  }
  
  type UserPartialName = PartialByKeys<User, 'name'> // { name?:string; age:number; address:string }
  ```
  
  > View on GitHub: https://tsch.js.org/2757
*/


/* _____________ Your Code Here _____________ */


// type result = PartialByKeys<User, 'name'>
// type result = {
//     name?: string;
// } & {
//     age: number;
//     address: string;
// }
// 이렇게 타입이 추론되기 때문에 이 &로 떨어진 타입을 하나로 묶어줄 필요가 있다

type CombineTypes<T> = {
    [P in keyof T] : T[P]
}

type PartialByKeys<T, K = keyof T> = CombineTypes<{ // K에 값이 없다면 모든 키 값을 옵셔널 처리 해야 한다
    [P in keyof T as P extends K ? P : never]?: T[P] // K 값과 동일한 필드를 옵셔널처리
} & {
    [P in keyof T as P extends K ? never: P] : T[P] // K값과 다른 필드를 그대로 두기
}>

/* _____________ Test Cases _____________ */
import { Equal, Expect, ExpectFalse, NotEqual } from '@type-challenges/utils'

interface User {
  name: string
  age: number
  address: string
}

interface UserPartialName {
  name?: string
  age: number
  address: string 
}

interface UserPartialNameAndAge {
  name?: string
  age?: number
  address: string 
}

type cases = [
  Expect<Equal<PartialByKeys<User, 'name'>, UserPartialName>>,
  Expect<Equal<PartialByKeys<User, 'name' | 'unknown'>, UserPartialName>>,
  Expect<Equal<PartialByKeys<User, 'name' | 'age'>, UserPartialNameAndAge>>,
  Expect<Equal<PartialByKeys<User>, Partial<User>>>,
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/2757/answer
  > View solutions: https://tsch.js.org/2757/solutions
  > More Challenges: https://tsch.js.org
*/

