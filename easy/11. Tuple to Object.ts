/*
  11 - Tuple to Object
  -------
  by sinoon (@sinoon) #easy 
  
  ### Question
  
  Give an array, transform into an object type and the key/value must in the given array.
  
  For example
  
  ```ts
  const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
  
  const result: TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
  ```
  
  > View on GitHub: https://tsch.js.org/11
*/


/* _____________ Your Code Here _____________ */

type TupleToObject<T extends readonly any[]> = {
    [P in T[number]]: P
}


/* _____________ Test Cases _____________ */
import { Equal, Expect } from '@type-challenges/utils'

const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
// as constで定義した場合、1.配列のインターフェースを満たす
// 2. インデックスのタイプも不変で、コンパイラーが正確な値を覚えている
/*
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as constと定義した場合、
{
    0: 'tesla',
    1: 'model 3',
    2: 'model X',
    3: 'model Y',
    readonly length: 4,
} 
と同じである
*/

type cases = [
  Expect<Equal<TupleToObject<typeof tuple>, { tesla: 'tesla'; 'model 3': 'model 3'; 'model X': 'model X'; 'model Y': 'model Y'}>>,
]
/*
上で定義したtupleが
{ 
    tesla: 'tesla'; 
    'model 3': 'model 3'; 
    'model X': 'model X'; 
    'model Y': 'model Y'
} と同じタイプになるにはKey値もValueと同じである必要がある
よって、[P in T[number]]: PになるとT[0]のKey値もPとして定義した
*/

type error = TupleToObject<[[1, 2], {}]>



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/11/answer
  > View solutions: https://tsch.js.org/11/solutions
  > More Challenges: https://tsch.js.org
*/

// https://blog.cometkim.kr/posts/typescript-tuples/　を参考にしました。