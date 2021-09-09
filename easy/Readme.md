## easy 문제 정리 및 풀이

### 4. Pick

> typescript에 내장된 Pick<T, K>를 제네릭을 사용하지 않고 구현해보자
> 'T'에서 'K' 속성셋을 선택하여 구성한다

```ts
// 예시
interface Todo {
    title: string
    description: string
    completed: boolean
  }
  
  type TodoPreview = MyPick<Todo, 'title' | 'completed'>
  
  const todo: TodoPreview = {
      title: 'Clean room',
      completed: false,
  }
```
- 알아두어야 할 것들: extends와 keyof 키워드

```ts
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P] // [P in K]에서 K는 key 목록, P는 key 요소
    // 따라서 T 인터페이스의 P 속성에 해당하는 타입을 키로 지정한다
}
```
---

### 7. Readonly

> `Readonly<T>`를 제네릭을 사용하지 않고 구현해보기
> T의 모든 속성이 읽기전용으로 설정된 타입을 생성하여 값을 덮어쓰기 할 수 없도록 한다

```ts
// 예시
interface Todo {
    title: string
    description: string
  }
  
  const todo: MyReadonly<Todo> = {
    title: "Hey",
    description: "foobar"
  }
  
  todo.title = "Hello" // Error: cannot reassign a readonly property
  todo.description = "barFoo" // Error: cannot reassign a readonly property
```

```ts
type MyReadonly<T> = {
    readonly [P in keyof T] : T[P];
}
// type MyReadonly<T> = Readonly<T>
```
---
### 11. Tuple to Object

> 배열이 주어질 때 해당 배열을 key/value를 갖는 객체 타입으로 변환하기

```ts
// 예시
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

const result: TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

```ts
type TupleToObject<T extends readonly any[]> = {
    [P in T[number]]: P
}
```

- 더 많은 정보는 [이 페이지](https://www.typescriptlang.org/ko/docs/handbook/release-notes/typescript-4-0.html)를 참고하면 좋습니다.

---

### 14. First of Array

> 배열 내 첫번째 인자를 갖는 제네릭 First<T>를 구현해보자

```ts
// 예시
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

```ts
// 첫 번째 방법 
type First<T extends any[]> = T[number] extends never ? never : T[0];
// T[number]를 통해 any[]를 하나의 튜플로 만들고 number값이 never라면 never를(배열의 길이가 0일 때를 가드), 길이가 1 이상이라면 T[0]값을 리턴하도록 함

// 두 번째 방법
type First<T extends any[]> = T extends [infer P, ...any] ? P : never
// infer 키워드는 ts가 엔진이 런타임 상황에서 타입을 추론할 수 있도록 하고 그 값을 P에 할당 해 줌
// 기본적으로 파라미터 값인 `(type parameter) P` 로 추론됨 (어떤 타입도 가질 수 있게 됨)
// 따라서 첫번째 값인 P와 ...any로 나누어 P를 리턴하면 가장 첫번째 값을 리턴하게 됨
```

---

### 18. Length of Tuple

> 튜플이 주어졌을 때 튜플의 길이를 가져오는 제네릭 Length를 완성하세요

```ts
// 예시
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla>  // expected 4
type spaceXLength = Length<spaceX> // expected 5
```

```ts
type Length<T extends readonly any[]> = T['length'];
// T를 튜플로 만들기 위해 readonly any[]로 지정하면 튜플 내에 length가 자동적으로 생성되며 이를 통해 T['length'] 키/값을 사용할 수 있게 된다
```

---

### 43. Exclude

> Exclude<T, U>를 구현해보자

```ts
type MyExclude<T, U>  = T extends U ? never : T
// 타입 T가 타입 U를 상속하거나 동일 타입이라면 무시(never)하고 아닐 경우 타입 값을 리턴합니다. 
// 타입 T 또는 타입 U가 유니온 타입으로 온다면 각각의 교집합이 무시(never)됩니다.
```

---

### 189. Awaited

> Promise 같은 감싸진 타입이 있다고 가정해봅시다. 우리는 어떻게 이 내부의 타입을 가져올 수 있을까요? 
> 예를 들어 우리는 어떻게 `Promise<ExampleType>`의 ExampleType을 가져올 수 있을까요?

```ts
type Awaited<T> = T extends Promise<infer K> ? K : never;
// infer K 제네릭을 사용해 Promise가 사용하는 제네릭의 타입을 파라미터로 받아 해당 K의 타입을 리턴한다
```

---

### 268. IF

> C라는 조건에서 truthy T 타입을 리턴하거나 falsy F 타입을 리턴하는 If 유틸을 구현해보자
> 이 때, C는 true와 false, T와 F, 어느 타입도 될 수 있다

```ts
// 예시
  type A = If<true, 'a', 'b'>  // expected to be 'a'
  type B = If<false, 'a', 'b'> // expected to be 'b'
```

```ts
type If<C extends boolean, T, F> = C extends true ? T : F;
// C라는 조건문이 boolean 값을 가졌을 때 C가 true 타입이라면 T를, 아니라면 F를 리턴해주면 된다
```

---

### 533. Concat

> 타입 시스템에서 자바스크립트가 제공하는 `Array.concat` 메서드를 구현해보자.
> 타입은 두 개의 인자를 갖고 출력은 반드시 입력값들이 순차적으로 들어간 새로운 배열이어야 한다.

```ts
// 예시
type Result = Concat<[1], [2]> // expected to be [1, 2]
```

```ts
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];
// ...과 같은 spread operation을 사용하기 위해서는 T와 U가 배열임을 명시해야 한다
```

---

### 898. Includes

> 타입 시스템에서 자바스크립트의 `Array.includes` 메서드를 구현해보자.
> 타입은 두 개의 인자를 갖고 출력은 반드시 true나 false 여야만 한다.

```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```

```ts
// 첫 번째 방법
type Includes<T extends any[], U> = U extends T[keyof T] ? true : false;
// 1) object의 내부까지 비교할 수 없음
// 2) boolean 타입과 true, false의 타입비교를 할 수 없음

// 두 번째 방법
type Includes<T extends readonly any[], U> = {
    [K in T[number]]: true // T의 튜플을 생성하여 배열 내 항목을 key로, 해당 key에는 true 값을 부여
}[U] extends true ? true : false　// 튜플 T 내부에 U 값으로 true를 갖는다면 해당 항목이 T에 있는 것이므로 true를 리턴
// 1) false값에 true를 부여함으로서 false값을 갖는다면 해당 값 또한 true를 리턴하게 됨

// 세 번째 방법
type Includes<T extends readonly any[], U> 
    = T['length'] extends 0 // 튜플 T의 길이가 0일 때의 처리
    ? false 
    : (T extends [infer A, ...infer B] // 튜플을 A값과 나머지 B로 처리
        ? ([A] extends [U] // 비교 값인 U와 A를 비교하고
            ? ([U] extends [A] 
                ? true // 같다면 true를
                : Includes<B, U>) // 다르다면 U를 사용해 재귀
        : Includes<B, U>) 
        : never)
```

---

### 3057. Push

> `Array.push` 메서드를 제네릭 버전으로 구현해보자

```ts
// 예시
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

```ts
type Push<T extends unknown[], U extends unknown> = [...T, U]; 
// concat과 마찬가지로 T와 U가 무엇인가의 배열 타입임을 명시하고 U를 push할 수 있도록 T를 spread operation을 통해 전개 한 후에 배치
```

---

### 3060. Unshift

> `Array.unshift` 메서드를 타입 버전으로 구현해보자

```ts
type Result = Unshift<[1, 2], 0> // [0, 1, 2,]
```

```ts
type Unshift<T extends unknown[], U extends unknown> = [U, ...T];
// push와는 반대로 진행한다 U가 만약 둘 이상의 값을 갖는 배열 타입이라면 ...U로 처리 할 수 있다
```