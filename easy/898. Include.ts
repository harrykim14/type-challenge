/*
  898 - Includes
  -------
  by null (@kynefuk) #easy #array
  
  ### Question
  
  Implement the JavaScript `Array.includes` function in the type system. A type takes the two arguments. The output should be a boolean `true` or `false`.
  
  For example
  
  ```ts
  type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
  ```
  
  > View on GitHub: https://tsch.js.org/898
*/


/* _____________ Your Code Here _____________ */

//  type Includes<T extends any[], U> = U extends T[keyof T] ? true : false;

// type Includes<T extends readonly any[], U> = {
//    [K in T[number]]: true // readonlyでタプルとして定義し、そのタプルを展開し、各Keyに対してtrueを入力
// }[U] extends true ? true : false　
// タプルのなかでUのKeyが存在するとtrueを、でないとfalseを返す
// -> Expect<Equal<Includes<[false, 2, 3, 5, 6, 7], false>, true>> を満たせない

type Includes<T extends readonly any[], U> 
    = T['length'] extends 0 // タプルTの配列に何も入ってない場合の処理
    ? false 
    : (T extends [infer A, ...infer B] //　タプルの最初の値をAに、残りをBとして分離
        ? ([A] extends [U] // 比較するUの入った配列とAの入った配列が同じかどうか判別
            ? ([U] extends [A] 
                ? true // 同じだとTrueを
                : Includes<B, U>) // 違うと残りの因数で再帰処理
        : Includes<B, U>) 
        : never)

/* _____________ Test Cases _____________ */
import { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'>, true>>,
  Expect<Equal<Includes<['Kars', 'Esidisi','Wamuu', 'Santana'], 'Dio'>, false>>,
  Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 7>, true>>,
  Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 4>, false>>,
  Expect<Equal<Includes<[1, 2, 3], 2>, true>>,
  Expect<Equal<Includes<[1, 2, 3], 1>, true>>,
  Expect<Equal<Includes<[{}], { a: 'A' }>, false>>,
  Expect<Equal<Includes<[boolean, 2, 3, 5, 6, 7], false>, false>>,
  Expect<Equal<Includes<[true, 2, 3, 5, 6, 7], boolean>, false>>,
  Expect<Equal<Includes<[false, 2, 3, 5, 6, 7], false>, true>>,
]



/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/898/answer
  > View solutions: https://tsch.js.org/898/solutions
  > More Challenges: https://tsch.js.org
*/

