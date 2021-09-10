/*
  3 - Omit
  -------
  by Anthony Fu (@antfu) #medium #union #built-in
  
  ### Question
  
  Implement the built-in `Omit<T, K>` generic without using it.
  
  Constructs a type by picking all properties from `T` and then removing `K`
  
  For example
  
  ```ts
  interface Todo {
    title: string
    description: string
    completed: boolean
  }
  
  type TodoPreview = MyOmit<Todo, 'description' | 'title'>
  
  const todo: TodoPreview = {
    completed: false,
  }
  ```
  
  > View on GitHub: https://tsch.js.org/3
*/


/* _____________ Your Code Here _____________ */

// type Pick<T, K extends keyof T> = { [P in K]: T[P] };
// T 타입의 키를 갖는 K를 P itor로 순환함으로써 T[P]를 반환

// type Exclude<T, U> = T extends U ? never : T;
//

// type MyOmit<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>>;

type MyOmit<T, K extends keyof T> = {
    [P in keyof T as P extends K ? never: P ]:T[P];
} // T의 키 값들을 갖는 P가 K와 비교해서 맞다면 무시(never)하고 
  // 그렇지 않다면 P(T의 키 값인)로서 T 내부에 포함시켜 리턴
  // Omit은 생략이란 뜻이므로 (T의 키 값 중 하나인)K를 포함시켜서는 안 된다
  
  
  /* _____________ Test Cases _____________ */
  import { Equal, Expect } from '@type-challenges/utils'
  
  type cases = [
    Expect<Equal<Expected1, MyOmit<Todo, 'description'>>>,
    Expect<Equal<Expected2, MyOmit<Todo, 'description' | 'completed'>>>
  ]
  
  interface Todo {
    title: string
    description: string
    completed: boolean
  }
  
  interface Expected1 {
    title: string
    completed: boolean
  }
  
  interface Expected2 {
    title: string
  }
  
  
  
  /* _____________ Further Steps _____________ */
  /*
    > Share your solutions: https://tsch.js.org/3/answer
    > View solutions: https://tsch.js.org/3/solutions
    > More Challenges: https://tsch.js.org
  */
  
  