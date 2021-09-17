/*
  2946 - ObjectEntries
  -------
  by jiangshan (@jiangshanmeta) #medium #object
  
  ### Question
  
  Implement the type version of ```Object.entries```
  
  For example 
  
  ```typescript
  interface Model {
    name: string;
    age: number;
    locations: string[] | null;
  }
  type modelEntries = ObjectEntries<Model> // ['name', string] | ['age', number] | ['locations', string[] | null];
  ```
  
  > View on GitHub: https://tsch.js.org/2946
*/


/* _____________ Your Code Here _____________ */

// 첫 번째 시도
// type ObjectEntries<T> = {
//     [P in keyof T]: [P, T[P]]
// }
// type result = ObjectEntries<Model>
// type result = { 
//     name: ["name", string];
//     age: ["age", number];
//     locations: ["locations", string[]]; => null은 표시되지 않음
// } => { 키: ["키", 값] }으로 표현됨

// 두 번째 시도
// type ObjectEntries<T> = {
//     [P in keyof T]: [P, T[P]]
// }[keyof T] // T의 키 값으로 순회하며 객체 내 배열을 꺼냄
// type result = ObjectEntries<Model>
// type result = ["name", string] | ["age", number] | ["locations", string[]]
// 키 "location"의 값으로 string[] 만 출력됨

// 세 번째 시도
type ObjectEntries<T> = {
    -readonly [P in keyof T] -? // 타입 T의 필드값을 전부 Mutable하며 Required한 값으로 변경
    : [P, T[P] extends (infer R | undefined) ? R : never ]  // undefined 값 체크
}[keyof T] 
type result = ObjectEntries<Model>
// null이 표시가 되지 않는 것은 개발 환경 문제 (PlayGround에서는 null이 인식되었음)


/* _____________ Test Cases _____________ */
import { Equal, Expect, ExpectFalse, NotEqual } from '@type-challenges/utils'

interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}

type ModelEntries = ['name', string] | ['age', number] | ['locations', string[] | null];



type cases = [
  Expect<Equal<ObjectEntries<Model>,ModelEntries>>,
  Expect<Equal<ObjectEntries<Partial<Model>>,ModelEntries>>,
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/2946/answer
  > View solutions: https://tsch.js.org/2946/solutions
  > More Challenges: https://tsch.js.org
*/

