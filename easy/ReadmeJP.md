## 難度イージーの解答整理など

### 4. Pick

> typescriptに内装されているジェネリックPick<T, K>を使わず具現してみよう。
> `T`から `K`のプロパティセットを選択して構成する。

```ts
// 例
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
- 知っておきたい：extendsとkeyofキーワード

```ts
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P] // [P in K]からKは キーリスト、Pはvalueなので
    // TタイプからプロパティPに該当するタイプをキーとして当てはめる
}
```
---

### 7. Readonly

> ジェネリック`Readonly<T>`を具現してみよう。
> `T`のすべてのフィールドがリードオンリーに設定されたタイプを生成し、値を上書きできないようにする。

```ts
// 例
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
    //　定義自体 { readonly T : P }　で定義するので、そのまま前にreadonlyをつける
}
// type MyReadonly<T> = Readonly<T>
```
---
### 11. Tuple to Object

> 配列が与えられた時、当配列をkey/valueを持つオブジェクトタイプに変換しよう

```ts
// 例
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

const result: TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

```ts
type TupleToObject<T extends readonly any[]> = {
    //　T extends readonly any[]として定義する事でタプルだということを明確にする
    [P in T[number]]: P
    // タプルは配列をオブジェクト化したものみたいに０番からフィールドが与えられているのでT[number]で参照できる
    // よってT[number]はキーになるしタイプのフィールドを循環、Pに当てはめることで値を取り出す
}
```

- タプルに関する詳しい内容は[このページ](https://www.typescriptlang.org/ko/docs/handbook/release-notes/typescript-4-0.html)(韓国語ページ)を参考にしました。

---

### 14. First of Array

> 配列内の最初の因子を持つジェネリック`First<T>`を具現してみよう。

```ts
// 例
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

```ts
// 最初トライしてた方法 
type First<T extends any[]> = T[number] extends never ? never : T[0];
// T[number]を通じて一つのタプルにし、T[number]に値がない場合っをガード(never処理)、配列の長さが1以上ならT[0]をリターンすることに

// 二回目のトライ
type First<T extends any[]> = T extends [infer P, ...any] ? P : never
// inferキーワードを使ってtypescriptエンジンがランタイム状況でタイプを推論できるようにしｔ、その値をＰに当てはめる
// 基本的にパラメータの値であるPとして推論される(どんなタイプでも可)
// よって最初の値であるPと...any(スプレッド構文)に分けてPをリターンすると一番最初の要素をリターンすることになる
```

---

### 18. Length of Tuple

> タプルが与えられた時、タプルの長さをリターンするジェネリック`Length<T>`を完成しましょう。

```ts
// 例
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla>  // expected 4
type spaceXLength = Length<spaceX> // expected 5
```

```ts
type Length<T extends readonly any[]> = T['length'];
// Tをタプルにするべくreadonly any[]を使うとタプルオブジェクトの内部に自動的にlengthフィールドが生成されるのでT['length']として参照できるようになる
```

---

### 43. Exclude

> `Exclude<T, U>`を具現してみよう

```ts
// 例文なし
```

```ts
type MyExclude<T, U>  = T extends U ? never : T
// タイプTとタイプUを比較し同一タイプであれば無視し、その逆の場合はTのタイプをリターンする
// タイプTもしくはタイプUがユニオンで与えられた場合は個々のの積集合が無視される
```

---

### 189. Awaited

> Promiseみたいに包まれてるタイプがあると仮定しよう。どうやって内部のタイプを持ってこれるのでしょうか。
> 例えばどうやって`Promise<ExampleType>`のExampleTypeのタイプが分かりますか？

```ts
type Awaited<T> = T extends Promise<infer K> ? K : never;
// infer KでPromiseが使うKのタイプをリターンする
```

---

### 268. IF

> Cという条件でtruthy Tタイプをリターンするか、falsy Fタイプをリターンするユーティル`If<C, T, F>`を具現してみよう。
> この場合Cはtrueもしくはfalseどちらにもなれる。

```ts
// 例
  type A = If<true, 'a', 'b'>  // expected to be 'a'
  type B = If<false, 'a', 'b'> // expected to be 'b'
```

```ts
type If<C extends boolean, T, F> = C extends true ? T : F;
// Cという条件文がbooleanタイプだとしたらCがtrueタイプであればTを、falseだとFをリターンする
```

---

### 533. Concat

> タイプシステム上でJavascriptが提供する`Array.concat` メソッドを具現してみよう。
> タイプは二つの因子を持ち、出力は必ず入力値が順番に入った新しい配列であるべき。

```ts
// 例
type Result = Concat<[1], [2]> // expected to be [1, 2]
```

```ts
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];
// スプレッド構文を使うためには与えられたTとUが配列であることを定義する必要がある
```

---

### 898. Includes

> タイプシステムでJavascriptの`Array.includes`メソッドを具現してみよう。
> タイプは二つの因子を持ち、出力は必ずtrueもしくはfalseであること。

```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```

```ts
// 最初にトライした方法
type Includes<T extends any[], U> = U extends T[keyof T] ? true : false;
// 1) objectの内部までは比較できなかった
// 2) booleanタイプとtrue、falseの比較ができなかった

// 二回目のトライ
type Includes<T extends readonly any[], U> = {
    [K in T[number]]: true // Tのタプルを生成し配列内の項目をkeyに、そのkeyにはtrueを付与
}[U] extends true ? true : false　// タプルT内部にUの値で参照し、その値がtrueだとしたらその項目がTの中にあるのでtrueをリターン
// 1) タプルの内部にfalseがtrueの値を持つことで元の値がfalseなのにtrueをリターンする

// 三度目のトライ
type Includes<T extends readonly any[], U> 
    = T['length'] extends 0 // タプルTの長さが０場合の処理
    ? false 
    : (T extends [infer A, ...infer B] // タプルを分割できたら
        ? ([A] extends [U] // 比較値であるUとAの値を比較
            ? ([U] extends [A] 
                ? true // 同じだとしたらtrueを
                : Includes<B, U>) // 違う場合Uを使用して再帰
            : Includes<B, U>)
        : never) 
```

---

### 3057. Push

> `Array.push`メソッドをジェネリックバージョンで具現してみよう。

```ts
// 例
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

```ts
type Push<T extends unknown[], U extends unknown> = [...T, U]; 
// concatと同じくTとUが何かしらの配列である事を定義し、UをpushできるようにTをスプレッド構文で展開し、配置
```

---

### 3060. Unshift

> `Array.unshift`メソッドをtypescriptバージョンで具現してみよう。

```ts
//例
type Result = Unshift<[1, 2], 0> // [0, 1, 2,]
```

```ts
type Unshift<T extends unknown[], U extends unknown> = [U, ...T];
// pushとは逆方向に具現、Uが２個以上の値を持つ配列のタイプだとしたらスプレッド構文が使えるので後は順に配置するだけ
```