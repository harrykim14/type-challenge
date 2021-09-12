## medium 문제 정리 및 풀이

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