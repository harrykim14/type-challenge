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