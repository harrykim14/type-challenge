/*
  1978 - Percentage Parser
  -------
  by SSShuai1999 (@SSShuai1999) #medium 
  
  ### Question
  
  Implement PercentageParser<T extends string>.
  According to the `/^(\+|\-)?(\d*)?(\%)?$/` regularity to match T and get three matches.
  
  The structure should be: [`plus or minus`, `number`, `unit`]
  If it is not captured, the default is an empty string.
  
  For example:
  ```ts
  type PString1 = ''
  type PString2 = '+85%'
  type PString3 = '-85%'
  type PString4 = '85%'
  type PString5 = '85'
  
  type R1 = PercentageParser<PString1>  // expected ['', '', '']
  type R2 = PercentageParser<PString2>  // expected ["+", "85", "%"]
  type R3 = PercentageParser<PString3>  // expected ["-", "85", "%"]
  type R4 = PercentageParser<PString4>  // expected ["", "85", "%"]
  type R5 = PercentageParser<PString5>  // expected ["", "85", ""]
  ```
  
  > View on GitHub: https://tsch.js.org/1978
*/


/* _____________ Your Code Here _____________ */

type Sign = '+' | '-';
type Unit = '%'

type PercentageParser<A extends string> 
    = A extends `${Sign}${infer Remains}` // 주어진 문자열 A내에 Sign이 있는지부터 확인
        ? A extends `${infer Sign}${infer Nums}${Unit}` // Remains 내에 '%' 문자가 있는지 확인
            ? [Sign, Nums, Unit] // 있다면 세 부분으로 나누기
            : A extends `${infer Sign}${infer Nums}` // 없다면 Remains가 전부 숫자이므로 
                ? [Sign, Nums, ''] // Unit 부분을 빈 문자열로 리턴
                : A extends `${Sign}` // Sign만 있다면 
                    ? [Sign, '', ''] // Sign만 포함된 배열을 리턴해야하며
                    : ['', '', ''] // 아무것도 없는 빈 배열이라면 빈 문자열만 포함된 해당 배열을 리턴
        : A extends `${infer Nums}${Unit}` // Sign이 없지만 Unit은 포함하는 문자열이라면
            ? ['', Nums, Unit] 
            : ['', A, ''];
        


/* _____________ Test Cases _____________ */
import { Equal, Expect } from '@type-challenges/utils'

type Case1 = ['', '', '']
type Case2 = ['+', '', '']
type Case3 = ['+', '1', '']
type Case4 = ['+', '100', '%']
type Case5 = ['', '10', '%']
type Case6 = ['-', '99', '%']

type cases = [
    Expect<Equal<PercentageParser<''>, Case1>>,
    Expect<Equal<PercentageParser<'+'>, Case2>>,
    Expect<Equal<PercentageParser<'+1'>, Case3>>,
    Expect<Equal<PercentageParser<'+100%'>, Case4>>,
    Expect<Equal<PercentageParser<'10%'>, Case5>>,
    Expect<Equal<PercentageParser<'-99%'>, Case6>>,
]

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/1978/answer
  > View solutions: https://tsch.js.org/1978/solutions
  > More Challenges: https://tsch.js.org
*/

