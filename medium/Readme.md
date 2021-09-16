## medium 문제 정리 및 풀이

<details>
<summary>01~10번째 챌린지</summary>
<div markdown="1-10">

### 2. Get Return Type

> `ReturnType<T>`를 제네릭을 사용하지 않고 구현해보자.

```ts
// 예시
const fn = (v: boolean) => {
    if (v)
      return 1
    else
      return 2
  }
  
  type a = MyReturnType<typeof fn> // should be "1 | 2"
```

```ts
type MyReturnType<T> =  T extends (...args : any[]) => infer R ? R : any;
// 입력된 타입 T가 함수이면 함수의 반환타입이 사용되고, 그렇지 않으면 any타입이 사용된다.
// infer R를 응용하는 법
```

<hr />

### 3. Omit

> `Omit<T, K>`을 제네릭을 사용하지 않고 구현해보자. 
> `T` 타입의 모든 속성에서 `K`를 제외하고 타입을 구성한다.

```ts
// 예시
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

```ts
type MyOmit<T, K extends keyof T> = {
    [P in keyof T as P extends K ? never: P ]:T[P];
}
/*
    Omit은 Pick과 Exclude의 응용이므로
    type MyOmit<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>>;
    로 표현 할 수 있다

    type Pick<T, K extends keyof T> = { [P in K]: T[P] } 이며
    type Exclude<T, U> = T extends U ? never : T 이므로
    [P in keyof T as P extends K ? never: P ]:T[P] 이다.

    T의 키 값들을 갖는 P가 K와 비교해서 맞다면 무시(never)하고,
    그렇지 않다면 P(T의 키 값인)로서 T 타입 내 속성으로 포함시킨 T[P]를 리턴
    Omit은 생략이란 뜻이므로 (T의 키 값 중 하나인)K를 포함시켜서는 안 된다
*/
```

<hr />

### 8. Readonly 2

> 두 개의 요소 T와 K를 갖는 제네릭 `MyReadonly2<T, K>`를 구현해보자.
> K는 T에 포함된 속성 셋이며 Readonly 값이어야 하며 T 내부의 나머지 값들의 타입은 readonly여선 안된다.

```ts
// 예시
interface Todo {
  title: string
  description: string
  completed: boolean
}

const todo: MyReadonly2<Todo, 'title' | 'description'> = {
  title: "Hey",
  description: "foobar",
  completed: false,
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
todo.completed = true // OK
```

```ts
// 첫 번째 시도
 [P in keyof T as P extends K ? readonly P : P]: T[P] ;
// 접근 자체는 좋았으나 readonly가 return문에 쓰일 수 없음

// 두 번째 시도
type MyReadonly2<T, K = unknown> = {
  readonly [P in keyof T as P extends K ? P : never]: T[P]
} & T
// readonly Pick<T, K>와 T의 나머지를 & 연산자로 엮기
// 에러: Type 'false' does not satisfy the constraint 'true

// 세 번째 방법 (성공) 
type MyReadonly2<T, K extends keyof T = keyof T> = {
  // = keyof T는 매개변수가 하나만 왔을 때를 위한 선언문
  [P in keyof T as P extends K ? never : P]: T[P]
  // Exclude로 필터된 타입 내 속성은 그대로 유지
} & { 
  readonly [P in K]: T[P] 
  // Pick으로 필터된 타입 내 속성은 readonly를 적용
}
```

<hr/>

### 9. Deep Readonly

> 재귀적으로 서브 객체를 갖는 하나의 객체를 전부 readonly로 만드는 제네릭 `DeepReadonly<T>`를 구현하세요 
> 이번 챌린지에서는 객체를 다루는 법에 대해서 배울것입니다. 배열, 함수, 클래스 등은 고려하지 않아도 됩니다. 하지만 스스로 더 많은 케이스들에 대해서 생각해보고 도전해보세요.

```ts
// 예시
type X = { 
  x: { 
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

type Expected = { 
  readonly x: { 
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey' 
}

const todo: DeepReadonly<X> // should be same as `Expected`
```

```ts
type DeepReadonly<T> = {
    readonly [P in keyof T]: keyof T[P] extends undefined ? T[P] : DeepReadonly<T[P]>
} // 재귀를 이용하여 key값 마다 내부로 들어가 readonly를 적용 (더 못 들어가면 undefined가 되므로 그 경우에는 빠져나옴)
```

<hr/>

### 10. Tuple to Union

>  주어진 하나의 튜플의 값들을 유니온으로 커버하는 제네릭 `TupleToUnion<T>`를 구현하세요.

```ts
// 예시 
type Arr = ['1', '2', '3']

const a: TupleToUnion<Arr> // expected to be '1' | '2' | '3'
```

```ts
// 첫 번째 방법 : 튜플을 전개하여 하나씩 꺼내는 방법(itor)
type TupleToUnion<T> = T extends unknown[] ? T[number] : never;

// 두 번째 방법 : 재귀적 방법으로 푸는 법
type TupleToUnion<T> = T extends [infer A,...infer B] ? ( A | TupleToUnion<B> ) : never;
```

<hr/>

### 12. Chainable Options

> 체이너블 옵션은 보통 자바스크립트에서 사용된다. 하지만 타입스크립트로 전환한다고 했을 때, 그것을 적절하게 타입으로 변환할 수 있을까요?
> 이번 챌린지에서는 두 개의 함수 `option(key, value)`과 `get()`을 갖는 객체나 클래스를 타이핑하게 됩니다.
> `option`에서는 주어진 키와 값으로 현재 구성 유형을 확장할 수 있고 `get`을 통해 최종 결과물에 접근해야 합니다.
> `key`는 `string` 타입만 받아야 하며 `value`는 아무 타입이나 받을 수 있습니다.

```ts
// 예시
declare const config: Chainable

const result = config
  .option('foo', 123)
  .option('name', 'type-challenges')
  .option('bar', { value: 'Hello World' })
  .get()

// expect the type of result to be:
interface Result {
  foo: number
  name: string
  bar: {
    value: string
  }
}
```

```ts
type Chainable<R extends {} = {}> = {
    option<K extends string, V>(key: K, value: V): Chainable<{[P in K]: V} & R>
    // key값인 K는 string만 받아야 하고 리턴 타입은 object여야 하므로 <R extends {}>로 명시
    // 이 제네릭은 재귀적으로 체이닝 되어야 하므로 리턴 타입에서 이전 체인에서 생성된 객체를 & 키워드로 추가
    get(): R
}
```

<hr/>

### 15. Last of Array

> 주어진 배열 `T`의 마지막 인자를 갖는 제네릭 `Last<T>`를 구현하세요.

```ts
// 예시
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type tail1 = Last<arr1> // expected to be 'c'
type tail2 = Last<arr2> // expected to be 1
```

```ts
// 배열을 spread operation을 사용해 마지막 요소와 나머지로 나누고 마지막 요소만을 리턴
type Last<T extends unknown[]> = T extends [...remains: unknown, last: infer L] ? L : never;
```

<hr />

### 16. Pop

> 주어진 배열 `T`에서 마지막 요소를 제외한 배열을 가지는 제네릭 `Pop<T>`를 구현하세요.

```ts
// 예시
type arr1 = ['a', 'b', 'c', 'd']
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
```

```ts
// 15번 Last of Array와 반대로 접근하여 배열의 마지막 값을 제외한 나머지 타입을 리턴
type Pop<T extends unknown[]> = T extends [...remains: infer R, last: unknown] ? R : never; 
```

<hr />

### 20. Promise.all

> Promise처럼 생긴 하나의 객체를 받고, 그 반환값이 Promise 상태에서 해제된 값(`Promise<T>`)의 타입을 갖는 함수 `PromiseAll`의 타입을 정의하세요.

```ts
// 예제
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

// expected to be `Promise<[number, number, string]>`
const p = Promise.all([promise1, promise2, promise3] as const)
```

```ts
// PromiseAll이 갖는 매개변수 value는 튜플 구조를 갖는 배열이므로 readonly 처리된 [...T]가 된다
declare function PromiseAll<T extends unknown[]>(values: readonly [...T]): Promise<{
    [P in keyof T]: T[P] extends Promise<infer R> ? R : T[P]
    // 반환형의 Promise는 해당 키 값(T[P])이 만약 Promise라면 해당 Promise가 갖는 제네릭의 타입(infer R)을 반환하며 Promise가 아니라면 그대로 T[P]를 반환하도록 함
}>
```

<hr />

### 62. Type Lookup

> 가끔은 우리가 유니온 속성을 통해 속성 내부를 들여다보고 싶을 때가 있습니다.
> 이번 챌린지에서는 `type` 필드를 각각 갖는 유니온 `Cat | Dog` 내 상응하는 타입을 찾을겁니다.
> 바꿔 말하자면, 우리는 `Dog` 타입을 `Lookup<Dog | Cat, 'dog'>`로, `Cat` 타입을 `Lookup<Dog | Cat, 'cat'>`으로 얻어 낼 겁니다.

```ts
// 예시
interface Cat {
    type: 'cat'
    breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
  }
  
  interface Dog {
    type: 'dog'
    breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
    color: 'brown' | 'white' | 'black'
  }
  
  type MyDogType = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`
```

```ts
// Union은 string 타입인 type 속성을 갖고, 이 유니온 내에 `type`이라는 키를 갖는 T(동물의 종류)로 필터링
// U extends { type: 'cat' } 이거나 U extends { type: 'dog' }일 때 해당하는 U(Dog | Cat) 타입을 리턴
type LookUp<U extends { type: string }, T extends U['type']> = U extends { type: T } ? U : never;
```

<hr />

</div>
</details>

<details>
<summary>11~20번째 챌린지</summary>
<div markdown="11-20">

### 106. Trim Left

> 주어진 문자열 타입을 받아 왼쪽 빈 칸을 없애는 `TrimLeft<T>`를 구현하세요.

```ts
// 예시
type trimed = TrimLeft<'  Hello World  '> // expected to be 'Hello World  '
```

```ts
// 첫 번째 방법
type TrimLeft<S extends string> = 
  S extends `${infer First}${infer Rest}` 
  // S를 앞글자와 나머지로 분류
    ? First extends ' '| '\n' | '\t' 
    // 만약 앞글자가 ' '(빈칸) '\n'(줄바꿈) '\t'(탭) 이라면
      ? TrimLeft<Rest> : S // 나머지 값을 재귀적으로 TrimLeft의 제네릭 인자로 넘김
    : never // 앞글자가 빈칸, 줄바꿈, 탭이 아니라면 리턴하지 않는다 

// 더 간편한 두 번째 방법
type TrimLeft<S extends string> =  S extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : S
// 처음부터 First 대신 빈칸, 줄바꿈, 탭을 찾아 나머지를 재귀적으로 호출
```

- **타입스크립트의 타입 문법 내에서 문자열을 다루는 방법은 유용할 것 같으니 잘 알아두자**

<hr/>

### 108. Trim

> 문자열의 좌우측 빈칸을 없애는 제네릭 `Trim<T>`를 구현하세요.

```ts
// 예시
type trimed = Trim<'  Hello World  '> // expected to be 'Hello World'
```

```ts
// 타입 정의 없이 사용하면 길어지므로 Left와 Right를 따로 정의 한 후에
type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : S;
type TrimRight<S extends string> = S extends  `${infer L}${' ' | '\n' | '\t'}` ? TrimRight<L> : S;
// TrimRight의 매개변수로 TrimLeft<S>의 결과값을 넘겨주면 된다
type Trim<S extends string> = TrimRight<TrimLeft<S>>;
```

<hr />

### 110. Capitalize

> 나머지 문자는 그대로이면서 문자열의 맨 처음 글자만 대문자가 되는 제네릭 `Capitalize<T>`를 구현하세요.

```ts
// 예시
type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'
```

```ts
type Capitalize<S extends string> = S extends `${infer First}${infer Remains}` ? `${Uppercase<First>}${Remains}` : S;
// 문자열을 앞뒤로 나누는 것은 앞 문제들로 배웠으니 Uppercase<S> 제네릭이 있다는 것을 알면 금방 풀 수 있는 문제
```

<hr/>

### 116. Replace

> 주어진 문자열 `S` 내에 있는 `From` 문자열을 `To` 문자열로 대체하는 제네릭 `Replace<S, From, To>`을 구현하세요.

```ts
// 예시
type replaced = Replace<'types are fun!', 'fun', 'awesome'> // expected to be 'types are awesome!'
```

```ts
type Replace<S extends string, From extends string, To extends string> 
    = '' extends From // 문자열이 아무것도 없을 때의 예외 처리용 구문
        ? S 
        : S extends `${infer Front}${From}${infer Last}` // 문자열 내에 `From`이 있다면 `From`을 중심으로 나누기
            ? `${Front}${To}${Last}` // `From` 문자열만 `To` 문자열로 변환시켜 리턴
            : S;
```

- 예외 처리를 잊지 말 것

<hr/>

### 119. ReplaceAll 

> 주어진 문자열 `S` 내에 있는 모든 `From` 문자열을 `To` 문자열로 바꾸는 제네릭 `ReplaceAll<S, From, To>`를 구현하세요.

```ts
// 예시
type replaced = ReplaceAll<'t y p e s', ' ', ''> // expected to be 'types'
```

```ts
type ReplaceAll<S extends string, From extends string, To extends string> 
= From extends '' // 문자열이 아무것도 없을 때의 예외 처리용 구문
    ? S 
    : S extends `${infer Front}${From}${infer Last}` // 문자열 내에 `From`이 있다면 `From`을 중심으로 나누기
        ? `${Front}${To}${ReplaceAll<Last, From, To>}` 
        // 해당 문자열은 앞에서부터 바꿔나가므로 바뀐 문자열을 제외한 Last 문자열들만 ReplaceAll의 매개변수로 재귀
        : S;
```

<hr />

### 191. Append Argument

> 함수 Fn을 첫 번째 인수로, A를 두번째 인수로 사용하고 원래 함수인 Fn의 매개변수로 A가 추가된 오버로드 함수 를 생성하는 제네릭 `AppendArgument<Fn, A>`을 구현하세요.

```ts
// 예시
type Fn = (a: number, b: string) => number

type Result = AppendArgument<Fn, boolean> 
// expected be (a: number, b: string, x: boolean) => number
```

```ts
type AppendArgument<Fn, A> 
    = Fn extends (...arg:[...infer Args]) => infer R 
        ? (...arg:[...Args, A]) => R // 주어진 함수의 리턴 타입은 동일해야 함
        : never
```

<hr />

### 296. Permutation 

> 유니온 값으로 받은 타입을 순열로 변환하는 제네릭을 구현하세요.

```ts
// 예시
type perm = Permutation<'A' | 'B' | 'C'>; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
```

```ts
type Permutation<T, U = T> 
    = [U] extends [never] // 두 번째 매개변수가 없다면 빈 배열을 리턴
        ? [] 
        : T extends never // 더이상 순회할 수 없을 때란 Exclude로 배열 내에 아무 요소가 없을 때임
            ? [] 
            : [T, ...Permutation<Exclude<U, T>>] // T를 배열에 위치시키고 T와 U를 제외한 나머지 요소로 재귀
```

- 순열 알고리즘에 대한 내용은 [이 페이지](https://minusi.tistory.com/entry/%EC%88%9C%EC%97%B4-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-Permutation-Algorithm)를 참고할 것

<hr/>

### 298. Length of String

> 문자열의 길이를 계산하는 제네릭 `LengthOfString<S>`를 구현하세요.

```ts
type SplitString<S> 
  = S extends `${infer First}${infer Remains}` 
    ? [First, ...SplitString<Remains>] // 재귀적으로 문자열을 분리하여 배열화
    : [];
type LengthOfString<S extends string> = SplitString<S>['length']; // 튜플에 정의된 length 값을 리턴
```

<hr/>

### 459. Flatten 

> 배열 내 모든 요소의 깊이가 같아지도록 하는 제네릭 `Flatten<A>`를 구현하세요.

```ts
// 예시
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
```

```ts
type Flatten<T>  
    = T extends unknown[] 
        ? T extends [infer A, ...infer R] 
            ? [...Flatten<A>, ...Flatten<R>] // 재귀적으로 배열 내 모든 요소를 나누어 순환 (Divide)
            : [] 
        : [T]; // 단 하나의 요소가 남는다면 해당 요소를 반환 (and Conquer)
```

<hr/>

### 527. Append to object

> 인터페이스에 새 필드를 추가하는 제네릭을 구현하세요. 이 제네릭은 세 개의 매개변수를 가집니다. 반환값은 반드시 새 필드를 갖는 객체여야 합니다.

```ts
// 예시
type Test = { id: '1' }
type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }
```

```ts
type merge<T> = {
    [P in keyof T]: T[P]
}
type AppendToObject<T, U extends string, V> = merge<{ [key in U]:V } & T>
```

<hr/>

</div>
</details>

<details>
<summary>21~30번째 챌린지</summary>
<div markdown="21-30">

### 529. Absolute

> 문자열이나 큰 정수, 정수를 받아 문자열로 된 절대값을 출력하는 제네릭 `Absolute`를 구현하세요.

```ts
// 예시
type Test = -100;
type Result = Absolute<Test>; // expected to be "100"
```

```ts
type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer S}` ? `${S}` : `${T}`;
```

<hr/>

### 531. String to Union

> 제네릭 `StringToUnion<S>`를 구현하세요. 매개변수로 문자열을 갖습니다. 출력은 반드시 입력한 문자열의 철자들이어야 합니다.

```ts
// 예시
type Test = '123';
type Result = StringToUnion<Test>; // expected to be "1" | "2" | "3"
```

```ts
type StringToUnion<T extends string> 
    = T extends `${infer First}${infer Remains}` 
        ? First | StringToUnion<Remains> // 문자열을 나누어 재귀하면서 철자 하나씩 유니온에 추가시킴
        : never
```

<hr />

### 599. Merge

> 두 타입을 하나의 새 타입으로 합치세요. 두번째로 주어진 타입의 키는 첫번째로 주어진 타입을 덮어쓸 수 있습니다.

```ts
// 첫 번째 방법
type CreateMergedType<T> = {
    [P in keyof T]: T[P]
}
type Merge<F, S> = CreateMergedType<{
    [P in keyof F as P extends keyof S ? never : P]: F[P]
    // S 내 키 중에 F 내 키와 같은 키는 반환하지 않는다
} & S>

// 두 번째 방법
type Merge<F, S> = {
    [P in keyof (F & S)] : P extends keyof S // F와 S의 키들을 전부 순회하며 S에 있는 키인지 검사
    ? S[P] // S의 필드를 먼저 채워넣고
    : P extends keyof F 
        ? F[P] // 그 후에 F의 필드를 채워넣음 (공통된 부분은 override 되지 않음)
        : never 
};
```

<hr />

### 610. CamelCase

> KebabCase로 표현된 문자열을 CamelCase로 치환하는 제네릭 `CamelCase<S>`를 구현하세요. 문자열은 `-` 문자로 나누어져 있을 수도 있고, 이 문자로 나누어져있을 경우 해당 문자를 지우고 그 다음에 특수 문자가 아닌 알파벳이 온다면 해당 알파벳을 대문자로 변환하세요.

```ts
// 예시
type result = CamelCase<for-bar-baz> // expected 'forBarBaz'
```

```ts
// 첫 번째 시도: `Expect<Equal<CamelCase<'foo--bar----baz'>, 'foo-Bar---Baz'>>`를 통과하지 못함
type Failed_CamelCase<S> 
    = S extends `${infer Front}-${infer Target}${infer Remains}` // '-' 문자 앞 부분, '-' 문자, '-'의 바로 다음 문자(Target), 나머지로 분리
        ? Target extends Uppercase<Target> // 타겟 문자가 대문자라면
            ? `${Front}-${Target}${CamelCase<Remains>}` // 타겟을 그대로 둔 채로 나머지를 매개변수로 하여 CamelCase로 재귀
            : `${Front}${Uppercase<Target>}${CamelCase<Remains>}` // 대문자가 아니라면 -를 지우고 Uppercase를 적용 후 나머지를 재귀
        : S;

// 두 번째 시도: Capitalize를 사용하여 해결
type CamelCase<S>
    = S extends `${infer Front}${infer Remains}` // 두 부분으로 나누고
        ? Front extends '-' // 앞 문자가 '-'라면
            ? Remains extends Capitalize<Remains> // 나머지 부분이 이미 Capitalize된 문자열인지 확인
                ? `${Front}${CamelCase<Remains>}` // 참이라면 '-'를 없애지 않고 나머지 문자열을 매개변수로 재귀
                : CamelCase<Capitalize<Remains>> // 거짓이라면 '-'를 제거하고 나머지 문자열로 재귀
            : `${Front}${CamelCase<Remains>}` // Capitalize되지 않았다면 '-'를 제거하고 나머지 문자열로 재귀
        : S
```

<hr />

### 612. KebabCase

> 주어진 문자열을 KebabCase로 치환하는 제네릭 `KebabCase<S>`를 구현하세요. 

```ts
// 예시
type result = KebabCase<FooBarBaz> // expected 'for-bar-baz'
```

```ts
type KebabCase<S, T extends string = ''> 
    = S extends `${infer First}${infer Remains}` // 주어진 문자열을 두 부분으로 나누기
        ? First extends Lowercase<First> // 첫 글자가 소문자라면
            ? `${First}${KebabCase<Remains, '-'>}` // 그대로 두고 나머지 부분과 앞에 붙일 '-' 문자를 설정
            : `${T}${Lowercase<First>}${KebabCase<Remains, '-'>}` 
            // First가 대문자라면 소문자로 바꾸고 앞에 '-'를 붙인다
        : S
```

<hr />

### 645. Diff

> `O`와 `O1`의 차집합인 객체를 반환하는 제네릭 `Diff<O, O1>`을 구현하세요.

```ts
// 예시 없음
```

```ts
// Pick과 Exclude를 쓰는 방법
type Diff<O, O1> = Pick<O1 & O, Exclude<keyof O1, keyof O>>

// 이는 Omit으로 줄여 쓸 수 있다
type Diff<O, O1> = Omit<O & O1, keyof (O | O1) >
```

<hr />

### 949. AnyOf

> 파이썬 같은 `any` 함수를 타입 시스템에서 구현하세요. 매개변수로 배열을 받으며 배열 내에 하나라도 `true`값이 있다면 `true`를 리턴합니다. 빈 배열이 주어진다면 `false`를 리턴합니다.

```ts
// 예시
type Sample1 = AnyOf<[1, "", false, [], {}]>; // expected to be true.
type Sample2 = AnyOf<[0, "", false, [], {}]>; // expected to be false.
```

```ts
type AnyOf<T extends readonly any[]> 
    = T[number] extends infer Args | {} // 튜플 T 내에 있는 객체와 요소들을 나눔
        ? Exclude<Args, 0 | '' | [] | false> extends never // 요소들 중에 0, '', [], false는 never처리
            ? false 
            : true
        : false
```

- 참고: 파이썬의 any 함수

```python
def any(iterable): # itarable을 매개변수로 받는 any 함수
    for element in iterable: # itarable 객체를 돌며
        if element: # element가 true라면 True를 리턴
            return True
    return False # 파이썬의 Falsy 오브젝트는 False, None, 0, 0.0, 0L, Oj, "", [], (), {} 가 있다
```


<hr />

### 1042. IsNever

> `T` 타입을 받는 제네릭 `IsNever<T>`를 구현하세요. 타입이 `never`라면 `true`를, 아니라면 `false`를 출력하세요.

```ts
// 예시
type A = IsNever<never>  // expected to be true
type B = IsNever<undefined> // expected to be false
type C = IsNever<null> // expected to be false
type D = IsNever<[]> // expected to be false
type E = IsNever<number> // expected to be false
```

```ts
// type IsNever<T> = T extends never ? true : false; 로 적어서는 안된다
type IsNever<T> = [T] extends [never] ? true : false; 
```

<hr />

### 1097. IsUnion 

> 유니온인 타입 `T`를 받았을 때 `true`를 출력하는 제네릭 `IsUnion<T>`를 구현하세요.

```ts
// 예시
type case1 = IsUnion<string>  // false
type case2 = IsUnion<string|number>  // true
type case3 = IsUnion<[string|number]>  // false
```

```ts
// type IsUnion<T> = T extends infer L | infer R ? true : false;
type IsUnion<T, K = T> 
    = T extends K 
        ? [K] extends [T] 
            ? false 
            : true 
        : never;
```

<hr />

### 1130. ReplaceKeys

> 세 개의 매개변수를 받아 유니온 타입 내의 키들을 바꾸는 제네릭 `ReplaceKeys<U, T, Y>`를 구현하세요.
> 만약 타입에 `Y`로 설정하고자 하는 키가 없다면 건너뛰세요.

```ts
// 예시
type NodeA = {
  type: 'A'
  name: string
  flag: number
}

type NodeB = {
  type: 'B'
  id: number
  flag: number
}

type NodeC = {
  type: 'C'
  name: string
  flag: number
}


type Nodes = NodeA | NodeB | NodeC

type ReplacedNodes = ReplaceKeys<Nodes, 'name' | 'flag', {name: number, flag: string}> 
// {type: 'A', name: number, flag: string} | {type: 'B', id: number, flag: string} | {type: 'C', name: number, flag: string} 
// would replace name from string to number, replace flag from number to string.

type ReplacedNotExistKeys = ReplaceKeys<Nodes, 'name', {aa: number}> 
// {type: 'A', name: never, flag: number} | NodeB | {type: 'C', name: never, flag: number} 
// would replace name to never
```

```ts
type ReplaceKeys<U, T, Y> = {
    [P in keyof U] : P extends T // U의 키들이 T에 존재한다면
        ? P extends keyof Y  // 또한 Y의 키가 P(U의 키들)에 있다면
            ? Y[P] // Y[P]로 키를 설정
            : never // 아니라면 never
        : U[P]; // Y의 키가 없다면 U의 키로 유지
}
```

<hr />

</div>
</details>

<details>
<summary>31~40번째 챌린지</summary>
<div markdown="31-40">

### 1367. Remove Index Signature

> 객체 타입들에서 숫자나 문자열의 키로 접근 가능한 인덱스 시그니처(index signature)를 삭제하는 제네릭 `RemoveIndexSignature<T>`를 구현하세요

```ts
// 예시
type Foo = {
  [key: string]: any;
  foo(): void;
}

type A = RemoveIndexSignature<Foo>  // expected { foo(): void }
```

```ts
// 첫 번째 시도: P가 string이거나 number라면 never를 반환하도록 하였으나 실패
// type RemoveIndexSignature<T> = {
//     [P in keyof T] : P extends [string | number] ? never : T[P];
// }
type RemoveIndexSignature<T> = {
    [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P];
    // 타입을 구성하는 삼항연산자에서는 유니온 타입으로 extends 키워드를 사용할 수 없다
}
```

- 인덱스 시그니처에 관한 내용은 [이 페이지](https://heropy.blog/2020/01/27/typescript/)와 [이 페이지](https://radlohead.gitbook.io/typescript-deep-dive/type-system/index-signatures)에서 확인할 수 있다.

<hr />

### 1978. Percentage Parser

> 제네릭 `Percentage Parser<T>`를 구현하세요. 정규표현식 `/^(\+|\-)?(\d*)?(\%)?$/`에 따라 `T`를 세 파트로 나누세요. 구조는 반드시 [`plus or miuns`, `number`, `unit` ] 이 되어야 합니다. 해당하지 않는다면 빈 문자열로 남겨두세요.

```ts
// 예시
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

```ts
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
```

<hr />

### 2070. Drop Char

> 문자열에서 주어진 문자를 없애는 제네릭 `DropChar<S, C>`를 구현하세요.

```ts
// 예시
type Butterfly = DropChar<' b u t t e r f l y ! ', ' '> // 'butterfly!'
```

```ts
type DropChar<S, C extends string> 
    = S extends `${infer Front}${C}${infer Remains}`
        ? DropChar<`${Front}${Remains}`, C>
        : S
```

<hr />

### 2257. MinusOne (미해결)

> (반드시 양수인) 숫자가 타입으로 주어질 때 1을 빼는 제네릭 `MinusOne<N>`을 구현하세요.

```ts
// 예시
type Zero = MinusOne<1> // 0
type FiftyFour = MinusOne<55> // 54
```

```ts
```

<hr />

### 2595. PickByType

> `T`에서 `U`에 해당하는 타입 셋만 가지는 제네릭 `PickByType<T, U>`를 구현하세요.

```ts
// 예시
type OnlyBoolean = PickByType<{
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}, boolean> // { isReadonly: boolean; isEnable: boolean; }
```

```ts
type PickByType<T, U> = {
    [P in keyof T as T[P] extends U ? P : never]: T[P];
}
```

<hr />

### 2688. StartsWith

> 주어진 문자열 `T`가 정확하게 `U`로 시작하는지 확인하는 제네릭 `StartsWith<T, U>`를 구현하세요.

```ts
type a = StartsWith<'abc', 'ac'> // expected to be false
type b = StartsWith<'abc', 'ab'> // expected to be true
type c = StartsWith<'abc', 'abcd'> // expected to be false
```

```ts
type StartsWith<T extends string, U extends string> = T extends `${U}${infer remains}` ? true : false;
```

### 2693. EndsWith

>주어진 문자열 `T`가 정확하게 `U`로 끝나는지 확인하는 제네릭 `EndsWith<T, U>`를 구현하세요.

```ts
type EndsWith<T extends string, U extends string> = T extends `${infer Front}${U}` ? true : false;
```

### 2757. PartialByKeys 

> 매개변수로 두 타입 `T`와 `K`를 받는 제네릭 `PartialByKeys<T, K>`를 구현하세요. `K`는 타입 `T` 내의 요소이며 반드시 옵셔널로 설정되어야 합니다. `K`가 주어지지 않는다면 제네릭 `Partial<T>`처럼 모든 필드가 옵셔널로 설정되어야 합니다.

```ts
// 예시
interface User {
  name: string
  age: number
  address: string
}

type UserPartialName = PartialByKeys<User, 'name'> // { name?:string; age:number; address:string }
```

```ts
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
```

<hr />

### 2759. RequiredByKeys 

> 매개변수로 두 타입 `T`와 `K`를 받는 제네릭 `RequiredByKeys<T, K>`을 구현하세요. `K`는 타입 `T` 내의 요소이며 반드시 필요한 값으로 설정되어야 합니다. `K`가 주어지지 않는다면 제네릭 `Require<T>`처럼 모든 필드가 반드시 필요한 값으로 설정되어야 합니다.

```ts
// 예시
interface User {
  name?: string
  age?: number
  address?: string
}

type UserPartialName = RequiredByKeys<User, 'name'> // { name: string; age?: number; address?: string }
```

```ts
type CombineType<T> = {
    [P in keyof T] : T[P]
}

type RequiredByKeys<T, K = keyof T> = CombineType<{
    [P in keyof T as P extends K ? P : never] -?: T[P] // 옵셔널 타입을 제거할 때엔 -?를 사용한다
} & {
    [P in keyof T as P extends K ? never: P] : T[P]
}>
```

</div>
</details>