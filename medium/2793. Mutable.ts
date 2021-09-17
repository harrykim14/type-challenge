/*
  2793 - Mutable
  -------
  by jiangshan (@jiangshanmeta) #medium #readonly #object-keys
  
  ### Question
  
  Implement the generic ```Mutable<T>``` which makes all properties in ```T``` mutable (not readonly).
  
  For example
  
  ```typescript
  interface Todo {
    readonly title: string
    readonly description: string
    readonly completed: boolean
  }
  
  type MutableTodo = Mutable<T> // { title: string; description: string; completed: boolean; }
  
  ```
  
  > View on GitHub: https://tsch.js.org/2793
*/


/* _____________ Your Code Here _____________ */

type Mutable<T> = {
    -readonly [P in keyof T]: T[P] // 옵셔널 체이닝과 같이 readonly로 제거할 때엔 -readonly 키워드를 사용한다.
}

/* _____________ Test Cases _____________ */
import { Equal, Expect, ExpectFalse, NotEqual } from '@type-challenges/utils'

interface Todo1 {
  title: string
  description: string
  completed: boolean
  meta: {
    author: string
  }
}

type cases = [
  Expect<Equal<Mutable<Readonly<Todo1>>, Todo1>>,
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/2793/answer
  > View solutions: https://tsch.js.org/2793/solutions
  > More Challenges: https://tsch.js.org
*/

