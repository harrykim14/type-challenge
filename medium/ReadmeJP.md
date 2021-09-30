## 難度ミディアムの解答整理など

<details>
<summary>01~10番目のチャレンジ</summary>
<div markdown="1-10">

### 2. Get Return Type

> `ReturnType<T>`を内装ジェネリックを使わず具現してみよう。

```ts
// 例
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
// 入力されたタイプTが関数であれば関数のリターンタイプが、でないとanyをリターン
// infer Rの応用法として熟知しておくこと
```

<hr />

### 3. Omit

> `Omit<T, K>`を内装ジェネリックを使わず具現してみよう。 
> `T`タイプのすべてのプロパティで`K`を除いてタイプを構成する。

```ts
// 例
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
    OmitはPickとExcludeと応用なので
    type MyOmit<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>>;
    として表現できる

    type Pick<T, K extends keyof T> = { [P in K]: T[P] } で
    type Exclude<T, U> = T extends U ? never : T なので
    [P in keyof T as P extends K ? never: P ]:T[P] である。

    Tのキーを持つPをKと比較してマッチすれば無視(never)し、
    そうでない場合はP(Tのキーの略称)をTタイプ内のフィールドで、T[P]を値として設定
    Omitは省略の意味をもつのでTのフィールドの中からKに値するフィールドを省略する
*/
```

<hr />

### 8. Readonly 2

> 二つの要素TとKを持つジェネリック`MyReadonly2<T, K>`を具現してみよう。
> `K`は`T`に属するプロパティで`readonly`、`T`内部の残りの値は`readonly`ではない。

```ts
// 例
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
// 一回目のトライ
 [P in keyof T as P extends K ? readonly P : P]: T[P] ;
// アプローチは良かったもののreadonlyを直接リターン文には使えない

// 二回目のトライ
type MyReadonly2<T, K = unknown> = {
  readonly [P in keyof T as P extends K ? P : never]: T[P]
} & T
// readonly Pick<T, K>とTの残りを & 演算子で結ぶ
// エラー: Type 'false' does not satisfy the constraint 'true

// 三つ目のトライ 
type MyReadonly2<T, K extends keyof T = keyof T> = {
  // = keyof Tはパタメータが一つだけだった場合の宣言
  [P in keyof T as P extends K ? never : P]: T[P]
  // Excludeでフィルターしたタイプはそのまま維持
} & { 
  readonly [P in K]: T[P] 
  // Pickでフィルターしたタイプ内の属性はreadonlyとして処理
}
```

<hr/>

### 9. Deep Readonly

> 再帰的にサブオブジェクトを持つ一つのオブジェクトを全てreadonly化するジェネリック`DeepReadonly<T>`を具現してみよう。 
> このチャレンジではオブジェクトを扱う方法を学びます。配列、関数、クラスなどは考えなくてもよいでしょう。しかし、自ら多くのケースを想定し、チャレンジしてみましょう。

```ts
// 例
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
} // 再帰を利用し、キーの値ごとに内部に入りreadonly化する(深く入れない場合はundefinedになるので、その場合に再帰から脱出)
```

<hr/>

### 10. Tuple to Union

>  与えられた一つのタプルの値たちをユニオンとしてカバーするジェネリック`TupleToUnion<T>`を具現してみよう。

```ts
// 例
type Arr = ['1', '2', '3']

const a: TupleToUnion<Arr> // expected to be '1' | '2' | '3'
```

```ts
// 一つ目の方法：タプルを展開し、一つずつ取り出す方法(itor式)
type TupleToUnion<T> = T extends unknown[] ? T[number] : never;

// 二つ目の方法：再帰を使った方法
type TupleToUnion<T> = T extends [infer A,...infer B] ? ( A | TupleToUnion<B> ) : never;
```

<hr/>

### 12. Chainable Options

> チェーンナブルオプションは普通Javascriptで使われる。しかし、Typescriptに移す場合はそれを適切にタイプ返還できますか？
> このチャレンジでは二つの関数`option(key, value)`と`get()`を持つオブジェクトやクラスをタイピングするでしょう。
> `option`では与えられたキーと値で現状の構成を拡張でき、`get`を通じて最終結果に接近できます。
> `key`は`string`タイプだけで、`value`はどのタイプでも良いでしょう。

```ts
// 例
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
    // キーであるKはstringだけで、リターンタイプはオブジェクトなので<R extends {}>で定義
    // このジェネリックは再帰してチェイニングするのでリターンタイプとして以前チェーンで生成されたオブジェクトを＆演算子で追加
    get(): R
}
```

<hr/>

### 15. Last of Array

> 与えられた配列`T`の最後の因子を持つジェネリック`Last<T>`を具現してみよう。

```ts
// 例
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type tail1 = Last<arr1> // expected to be 'c'
type tail2 = Last<arr2> // expected to be 1
```

```ts
// スプレッド構文を使って配列の最後の要素と残りで分け、最後の要素だけリターン
type Last<T extends unknown[]> = T extends [...remains: unknown, last: infer L] ? L : never;
```

<hr />

### 16. Pop

> 与えられた配列`T`から最後の要素を取り除いた配列をリターンするジェネリック`Pop<T>`を具現してみよう。

```ts
// 例
type arr1 = ['a', 'b', 'c', 'd']
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
```

```ts
// Last of Array問題とは反対に配列を分け、残り(R)をリターン
type Pop<T extends unknown[]> = T extends [...remains: infer R, last: unknown] ? R : never; 
```

<hr />

### 20. Promise.all

> Promiseのような一つのオブジェクトを受け、そのリターン値がPromise状態からリゾルブされた`Promise<T>`のタイプを持つ関数`PromiseAll`のタイプを定義しましょう。

```ts
// 例
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

// expected to be `Promise<[number, number, string]>`
const p = Promise.all([promise1, promise2, promise3] as const)
```

```ts
// PromiseAllが持つパラメータvalueはタプル構造の配列なのでreadonlyで処理された[...T]をパラメータとして定義
declare function PromiseAll<T extends unknown[]>(values: readonly [...T]): Promise<{
    [P in keyof T]: T[P] extends Promise<infer R> ? R : T[P]
    // 返還型のPromiseはキーに対しての値(T[P])がもしPromiseならそのPromiseが持つジェネリックのタイプ(infer R)をリターンし、Promiseでない場合はT[P]をリターン
}>
```

<hr />

### 62. Type Lookup

> たまにはユニオン属性でタイプ内部を覗きたい時があります。
> 今回のチャレンジでは`type`のフィールドを持つユニオン`Cat | Dog`内に相応するプロパティを覗いてみましょう。
> 言い直すと、`Dog`タイプを`Lookup<Dog | Cat, 'dog'>`で、`Cat`タイプを`Lookup<Dog | Cat, 'cat'>`で取得してみましょう。

```ts
// 例
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
// Uの内部からデストラクチャリング文法をつかって`type`というキーを持つプロパティだけ持ってきます
// そこでU['type']でフィルター
// U extends { type: 'cat' }かU extends { type: 'dog' }でU(DogかCat)タイプをリターン
type LookUp<U extends { type: string }, T extends U['type']> = U extends { type: T } ? U : never;
```

<hr />

</div>
</details>

<details>
<summary>11~20番目のチャレンジ</summary>
<div markdown="11-20">

### 106. Trim Left

> 与えられた文字列タイプを受け、左側の空欄を消す`TrimLeft<T>`を具現してみよう。

```ts
// 例
type trimed = TrimLeft<'  Hello World  '> // expected to be 'Hello World  '
```

```ts
// 一つ目の方法
type TrimLeft<S extends string> = 
  S extends `${infer First}${infer Rest}` 
  // Sを頭文字と残りで分ける
    ? First extends ' '| '\n' | '\t' 
    // もし頭文字が' '(空欄)、'\n'(改行)、'\t'(タブ)なら
      ? TrimLeft<Rest> : S // 残りの文字をTrimLeftのパラメータとして使って再帰
    : never // 頭文字が空欄、改行、タブではない場合無視

// もっと便利な二つ目の方法
type TrimLeft<S extends string> =  S extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : S
// 最初からFirstの代わりに空欄と改行、タブを探して当て、残りで再帰
```

- **Typescriptの文法内で文字列を扱う方法は使えそうなので(有効性の検証や正規表現など)覚えておこう**

<hr/>

### 108. Trim

> 文字列の左右をなくすジェネリック`Trim<T>`を具現してみよう。

```ts
// 例
type trimed = Trim<'  Hello World  '> // expected to be 'Hello World'
```

```ts
// タイプ正義なしで使用すると長くなってコードが分かりにくいのでLeftとRightを別々に定義し
type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : S;
type TrimRight<S extends string> = S extends  `${infer L}${' ' | '\n' | '\t'}` ? TrimRight<L> : S;
// TrimRightのパラメータとしてTrimLeft<S>のタイプ推論値を使う
type Trim<S extends string> = TrimRight<TrimLeft<S>>;
```

<hr />

### 110. Capitalize

> 残りの文字はそのままで、頭文字だけ大文字になるジェネリック`Capitalize<T>`を具現してみよう。

```ts
// 例
type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'
```

```ts
type Capitalize<S extends string> = S extends `${infer First}${infer Remains}` ? `${Uppercase<First>}${Remains}` : S;
// Typescriptの内装ジェネリック`Uppercase<S>`を使うと残りは前に習った文字の分解式
```

<hr/>

### 116. Replace

> 与えられた文字列`S`内にある`From`文字列を`To`文字列に変えるジェネリック`Replace<S, From, To>`を具現してみよう。

```ts
// 例
type replaced = Replace<'types are fun!', 'fun', 'awesome'> // expected to be 'types are awesome!'
```

```ts
type Replace<S extends string, From extends string, To extends string> 
    = '' extends From // 文字列になんもない場合の例外処理分
        ? S 
        : S extends `${infer Front}${From}${infer Last}` 
        // 文字列の中に`From`があれば`From`を中心として文字列を分ける
            ? `${Front}${To}${Last}` // `From`文字列の部分に`To`文字列を代入してリターン
            : S;
```

- 例外処理はいつも大事。

<hr/>

### 119. ReplaceAll 

> 与えられた文字列`S`の中にある全ての`From`文字列を`To`文字列に変えるジェネリック`ReplaceAll<S, From, To>`を具現してみよう。

```ts
// 例
type replaced = ReplaceAll<'t y p e s', ' ', ''> // expected to be 'types'
```

```ts
type ReplaceAll<S extends string, From extends string, To extends string> 
= From extends '' // 例外処理文
    ? S 
    : S extends `${infer Front}${From}${infer Last}` // ここまで前の問題と同じ方法
        ? `${Front}${To}${ReplaceAll<Last, From, To>}` 
        // 当たりの文字列は前から変えていくので変えた後の残りの文字列をReplaceAllのパラメータとして使う
        : S;
```

<hr />

### 191. Append Argument

> 関数Fnを最初のパラメータに、Aを二番目のパラメータとして使用し、もともと関数であるFnのパラメータにAが加われたオーバーロード関数を生成するジェネリック`AppendArgument<Fn, A>`を具現してみよう。

```ts
// 例
type Fn = (a: number, b: string) => number

type Result = AppendArgument<Fn, boolean> 
// expected be (a: number, b: string, x: boolean) => number
```

```ts
type AppendArgument<Fn, A> 
    = Fn extends (...arg:[...infer Args]) => infer R // 関数のパラメータを配列化してConcatみたいにAを追加
        ? (...arg:[...Args, A]) => R // 与えられた関数のリターンタイプは同じである
        : never
```

<hr />

### 296. Permutation 

> ユニオンで受けたタイプを順列で返還するジェネリック`Permutation<U>`を具現してみよう。

```ts
// 例
type perm = Permutation<'A' | 'B' | 'C'>; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
```

```ts
type Permutation<T, U = T> 
    = [U] extends [never] // 二番目のパラメータがない場合空の配列をリターン
        ? [] 
        : T extends never // `もう巡回できない場合`とはExcludeで配列に何も存在しない時
            ? [] 
            : [T, ...Permutation<Exclude<U, T>>] // Tを配列に位置させてTとUを除いた残りで再帰
```

- 順列アルゴリズムに関する内容は[このページ](https://minusi.tistory.com/entry/%EC%88%9C%EC%97%B4-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-Permutation-Algorithm)を参照しました。(韓国語ページ)

<hr/>

### 298. Length of String

> 文字列の長さを計算するジェネリック`LengthOfString<S>`を具現してみよう。

```ts
// 例文なし
```

```ts
type SplitString<S> 
  = S extends `${infer First}${infer Remains}` 
    ? [First, ...SplitString<Remains>] // 再帰を使って文字列を一文字ずつ分けて配列化
    : [];
type LengthOfString<S extends string> = SplitString<S>['length']; //　タプルに定義し、タプル内部のlength値を参照
```

<hr/>

### 459. Flatten 

> 配列の中の全ての要素の深さ(Depth)が同じになるジェネリック`Flatten<A>`を具現してみよう。

```ts
// 例
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
```

```ts
type Flatten<T>  
    = T extends unknown[] 
        ? T extends [infer A, ...infer R] 
            ? [...Flatten<A>, ...Flatten<R>] // 再帰と再帰した結果をスプレッド構文で分ける(Divide)
            : [] 
        : [T]; // 再帰ができない場合は配列にただ一つだけ残っている場合なのでそのままリターン(and Conquer)
```

<hr/>

### 527. Append to object

> インターフェースに新しいフィールドを追加するジェネリックを具現してみよう。このジェネリックは三つのパラメータを持ちます。リターン値は必ず新しいフィールドを持つオブジェクトです。

```ts
// 例
type Test = { id: '1' }
type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }
```

```ts
type merge<T> = {
    [P in keyof T]: T[P]
}
type AppendToObject<T, U extends string, V> = merge<{ [key in U]:V } & T>
// Uで与えられたキーでVの値を持つタイプを生成し、元のタイプTを＆演算子で結び、mergeジェネリックで一つのタイプにまとめる
```

<hr/>

</div>
</details>

<details>
<summary>21~30番目のチャレンジ</summary>
<div markdown="21-30">

### 529. Absolute

> 文字列か大きい整数、整数を受け、文字列の絶対値を出力するジェネリック`Absolute`を具現してみよう。

```ts
// 例
type Test = -100;
type Result = Absolute<Test>; // expected to be "100"
```

```ts
type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer S}` ? `${S}` : `${T}`;
// バッククォートを使って文字列に
```

<hr/>

### 531. String to Union

> ジェネリック`StringToUnion<S>`を具現してみよう。パラメータで文字列をもらいます。出力は必ず入力した文字列のスペルです。

```ts
// 例
type Test = '123';
type Result = StringToUnion<Test>; // expected to be "1" | "2" | "3"
```

```ts
type StringToUnion<T extends string> 
    = T extends `${infer First}${infer Remains}` 
        ? First | StringToUnion<Remains> // 文字列を分けて再帰しながらスペル一つ一つをユニオンに追加する
        : never
```

<hr />

### 599. Merge

> 二つのタイプを一つのタイプにしましょう。二番目に与えられたタイプのキーは一番目のタイプを上書きできます。

```ts
// 一つ目の方法
type CreateMergedType<T> = {
    [P in keyof T]: T[P]
}
type Merge<F, S> = CreateMergedType<{
    [P in keyof F as P extends keyof S ? never : P]: F[P]
    // S内のキーの中でF内のキーと同じキーは返還しない
} & S>

// 二つ目の方法
type Merge<F, S> = {
    [P in keyof (F & S)] : P extends keyof S // FとSのキーを全部回りながらSにあるキーか検証
    ? S[P] // Sのフィールドを最初に入れて
    : P extends keyof F 
        ? F[P] // そのあとでFのフィールドを入れる事で共通する部分はoverrideしないようにする
        : never 
};
```

<hr />

### 610. CamelCase

> KebabCaseで表現した文字列をCamelCaseに変えるジェネリック`CamelCase<S>`を具現してみよう。文字列は`-`で分けているかもしれないし、もし`-`で分けられている場合はこの文字を消して、その次に特殊文字でないアルファベットが来たら大文字に変えましょう。

```ts
// 例
type result = CamelCase<for-bar-baz> // expected 'forBarBaz'
```

```ts
// 一回目のトライ: テスト`Expect<Equal<CamelCase<'foo--bar----baz'>, 'foo-Bar---Baz'>>`でエラー
type Failed_CamelCase<S> 
    = S extends `${infer Front}-${infer Target}${infer Remains}` // '-'文字の前の部分、'-', '-'の次の文字(Target)、残りで分ける
        ? Target extends Uppercase<Target> // ターゲット文字が大文字なら
            ? `${Front}-${Target}${CamelCase<Remains>}` // ターゲットをそのままにして残りで再帰
            : `${Front}${Uppercase<Target>}${CamelCase<Remains>}` // 大文字でないと`-`を消してUppercaseでターゲットを大文字化する
        : S;

// 二回目のトライ: Capitalizeを使用して解決
type CamelCase<S>
    = S extends `${infer Front}${infer Remains}` // 二つに分けて
        ? Front extends '-' // Frontが'-'なら
            ? Remains extends Capitalize<Remains> // 残りがCapitalizeされた文字列か検証
                ? `${Front}${CamelCase<Remains>}` // Trueなら'-'を消さずに残りの文字列で再帰
                : CamelCase<Capitalize<Remains>> // Falseなら'-'を消し、残りで再帰
            : `${Front}${CamelCase<Remains>}` // Capitalizeされなかったら'-'を消して残りの文字列で再帰
        : S
```

<hr />

### 612. KebabCase

> 与えられた文字列をKebabCaseに変えるジェネリック`KebabCase<S>`を具現してみよう。

```ts
// 例
type result = KebabCase<FooBarBaz> // expected 'for-bar-baz'
```

```ts
type KebabCase<S, T extends string = ''> 
    = S extends `${infer First}${infer Remains}` // 与えられた文字列を二つに分ける
        ? First extends Lowercase<First> // 最前の文字が小文字だったら
            ? `${First}${KebabCase<Remains, '-'>}` // そのまま置いといて残りと前につける'-'文字をパラメータで再帰
            : `${T}${Lowercase<First>}${KebabCase<Remains, '-'>}` 
            // Firstが大文字なら小文字に変えて前に'-'を付ける
        : S
```

<hr />

### 645. Diff

> `O`と`O1`の差集合オブジェクトを返還するジェネリック`Diff<O, O1>`を具現してみよう。

```ts
// 例文なし
```

```ts
// PickとExcludeを使う方法
type Diff<O, O1> = Pick<O1 & O, Exclude<keyof O1, keyof O>>

// 上の文はOmitで略せる
type Diff<O, O1> = Omit<O & O1, keyof (O | O1) >
```

<hr />

### 949. AnyOf

> Pythonの関数`any`をタイプシステムで具現してみよう。パラメータで配列を受け、配列の中に一つでも`true`値があれば`true`をリターンします。空の配列が与えられると`false`をリターンします。

```ts
// 例
type Sample1 = AnyOf<[1, "", false, [], {}]>; // expected to be true.
type Sample2 = AnyOf<[0, "", false, [], {}]>; // expected to be false.
```

```ts
type AnyOf<T extends readonly any[]> 
    = T[number] extends infer Args | {} // タプルTの中の要素をオブジェクトとパラメータで分ける
        ? Exclude<Args, 0 | '' | [] | false> extends never // 要素の中に0、''、[]、falseは無視(never)
            ? false 
            : true
        : false
```

- 参照: Pythonのany関数

```python
def any(iterable): # itarableをパラメータとして受けるany関数
    for element in iterable: # itarableのオブジェクトを回りながら
        if element: # elementがtrueならTrueをリターン
            return True
    return False # PythonのFalsyはFalse、None、0、0.0、0L、Oj、""、[]、()、{}がある
```


<hr />

### 1042. IsNever

> `T`タイプを受けるジェネリック`IsNever<T>`を具現してみよう。タイプが`never`なら`true`を、違う場合は`false`を出力しよう。

```ts
// 例
type A = IsNever<never>  // expected to be true
type B = IsNever<undefined> // expected to be false
type C = IsNever<null> // expected to be false
type D = IsNever<[]> // expected to be false
type E = IsNever<number> // expected to be false
```

```ts
// type IsNever<T> = T extends never ? true : false; で書いたら全部neverに処理されるので[]処理
type IsNever<T> = [T] extends [never] ? true : false; 
```

<hr />

### 1097. IsUnion 

> ユニオンのタイプ`T`を受け、`true`を出力するジェネリック`IsUnion<T>`を具現してみよう。

```ts
// 例
type case1 = IsUnion<string>  // false
type case2 = IsUnion<string|number>  // true
type case3 = IsUnion<[string|number]>  // false
```

```ts
// type IsUnion<T> = T extends infer L | infer R ? true : false;
type IsUnion<T, K = T> // ユニオンを比較するためにパラメータとして二つ使う
    = T extends K 
        ? [K] extends [T] // 逆も一緒の場合は一つだけなので
            ? false // falseをリターン
            : true // 逆が違うとユニオン
        : never;
```

<hr />

### 1130. ReplaceKeys

> 三つのパラメータを受けてユニオンタイプ内のキーを変えるジェネリック`ReplaceKeys<U, T, Y>`を具現してみよう。
> もしタイプに`Y`に設定しようとするキーがない場合はスルーしましょう。

```ts
// 例
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
    [P in keyof U] : P extends T // UのキーがTに存在するのであれば
        ? P extends keyof Y  // またYのキーがP(Uのキー)にあれば
            ? Y[P] // Y[P]でキーを設定
            : never // でないと無視(never)
        : U[P]; // Yのキーがない場合はそのままUのキーで設定
}
```

<hr />

</div>
</details>

<details>
<summary>31~40番目のチャレンジ</summary>
<div markdown="31-40">

### 1367. Remove Index Signature

> オブジェクトタイプから数字や文字列のキーでアプローチできるインデックスシグネチャー(index signature)を削除するジェネリック`RemoveIndexSignature<T>`を具現してみよう。

```ts
// 例
type Foo = {
  [key: string]: any;
  foo(): void;
}

type A = RemoveIndexSignature<Foo>  // expected { foo(): void }
```

```ts
// 一回目のトライ: Pがstringかnumberならneverを返還するようにしたが失敗
// type RemoveIndexSignature<T> = {
//     [P in keyof T] : P extends [string | number] ? never : T[P];
// }
type RemoveIndexSignature<T> = {
    [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P];
    // タイプを構成する三項演算子ではユニオンタイプでextendsキーワードを使用できない
}
```

- インデックスシグネチャーに関する内容は[このページ](https://heropy.blog/2020/01/27/typescript/)と[このページ](https://radlohead.gitbook.io/typescript-deep-dive/type-system/index-signatures)で参照しました。（どちらも韓国語ページ）

<hr />

### 1978. Percentage Parser

> ジェネリック`Percentage Parser<T>`を具現してみよう。正規表現式`/^(\+|\-)?(\d*)?(\%)?$/`により`T`を三つのパートに分けましょう。ストラクチャーは必ず[ `plus or miuns`, `number`, `unit` ]になります。該当しない場合は空の文字列に残しましょう。

```ts
// 例
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
    = A extends `${Sign}${infer Remains}` // 与えられた文字列Aの中にSignがあるかから確認
        ? A extends `${infer Sign}${infer Nums}${Unit}` // Remains内に'%'文字を確認
            ? [Sign, Nums, Unit] // あるとしたら三つのパートに分ける
            : A extends `${infer Sign}${infer Nums}` // 無ければRemainsは全部数字なので
                ? [Sign, Nums, ''] // Unitを空の文字にしてリターン
                : A extends `${Sign}` // Signだけなら
                    ? [Sign, '', ''] // Signだけの配列を
                    : ['', '', ''] // 空の文字だと配列に''を三つ入れてリターン
        : A extends `${infer Nums}${Unit}` // SignはないけどUnitはある文字列の場合をここで処理
            ? ['', Nums, Unit] 
            : ['', A, ''];
```

<hr />

### 2070. Drop Char

> 文字列で与えられた文字を消すジェネリック`DropChar<S, C>`を具現してみよう。

```ts
// 例
type Butterfly = DropChar<' b u t t e r f l y ! ', ' '> // 'butterfly!'
```

```ts
type DropChar<S, C extends string> 
    = S extends `${infer Front}${C}${infer Remains}`
        ? DropChar<`${Front}${Remains}`, C>
        : S
```

<hr />

### 2257. MinusOne (未解決)

> (必ず陽の数字な)数字がタイプで与えられた時、１を引くジェネリック`MinusOne<N>`を具現してみよう。

```ts
// 例
type Zero = MinusOne<1> // 0
type FiftyFour = MinusOne<55> // 54
```

```ts
//　未解決問題
```

<hr />

### 2595. PickByType

> `T`から`U`のタイプだけ持つタイプを構成するジェネリック`PickByType<T, U>`を具現してみよう。

```ts
// 例
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

> 与えられた文字列`T`が正確に`U`で始まるか検証するジェネリック`StartsWith<T, U>`を具現してみよう。

```ts
// 例
type a = StartsWith<'abc', 'ac'> // expected to be false
type b = StartsWith<'abc', 'ab'> // expected to be true
type c = StartsWith<'abc', 'abcd'> // expected to be false
```

```ts
type StartsWith<T extends string, U extends string> = T extends `${U}${infer remains}` ? true : false;
```

### 2693. EndsWith

> 与えられた文字列`T`が正確に`U`で終わるか検証するジェネリック`EndsWith<T, U>`を具現してみよう。

```ts
// 例文なし
```

```ts
type EndsWith<T extends string, U extends string> = T extends `${infer Front}${U}` ? true : false;
```

### 2757. PartialByKeys 

> パラメータで二つのタイプ`T`と`K`を受けるジェネリック`PartialByKeys<T, K>`を具現してみよう。`K`はタイプ`T`内の要素で必ずオプショナルで設定されます。`K`が与えられなかった場合はジェネリック`Partial<T>`のように全てのフィールドがオプショナルで設定されます。

```ts
// 例
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
// そのままだとタイプ推論がこのような形になるので一つのタイプにくくる必要がある

// 一つにくくるためのジェネリック
type CombineTypes<T> = {
    [P in keyof T] : T[P]
}

type PartialByKeys<T, K = keyof T> = CombineTypes<{ // Kが与えられない場合はTを入れてＴを全部オプショナルで設定
    [P in keyof T as P extends K ? P : never]?: T[P] // Kと同じフィールドをオプショナルで設定
} & {
    [P in keyof T as P extends K ? never: P] : T[P] // Kと違うフィールドはそのままに
}>
```

<hr />

### 2759. RequiredByKeys 

> パラメータで二つのタイプ`T`と`K`を受けるジェネリック`RequiredByKeys<T, K>`を具現してみよう。`K`はタイプ`T`の中の要素で必ずRequiredに設定されます。`K`が与えられなかった場合ジェネリック`Require<T>`のように全てのフィールドが必ず必要なフィールドに設定されます。

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
    [P in keyof T as P extends K ? P : never] -?: T[P] // オプショナルタイプを外すときは-?キーワードを使う
} & {
    [P in keyof T as P extends K ? never: P] : T[P]
}>
```

<hr />

### 2793. Mutable

> 全てのフィールドが修正できるオブジェクトにするジェネリック`Mutable<T>`を具現してみよう。

```ts
// 例
interface Todo {
  readonly title: string
  readonly description: string
  readonly completed: boolean
}

type MutableTodo = Mutable<T> // { title: string; description: string; completed: boolean; }
```

```ts
type Mutable<T> = {
    -readonly [P in keyof T]: T[P] //  readonlyを取り消す時は-readonlyキーワードを使う
}
```

</div>
</details>

<details>
<summary>41~47番目のチャレンジ</summary>
<div markdown="41-47">

### 2852. OmitByType

> タイプ`T`から`U`タイプではないフィールドだけで構成するジェネリック`OmitByType<T, U>`を具現してみよう。

```ts
// 例
type OmitBoolean = OmitByType<{
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}, boolean> // { name: string; count: number }
```

```ts
type OmitByType<T, U> = {
    [P in keyof T as T[P] extends U ? never : P] : T[P]
} // Omit<T, U>でT[P]を使うだけ
```
<hr />

### 2946. ObjectEntries

> タイプシステムで`Object.entries`を具現してみよう。

```ts
// 例
interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}
type modelEntries = ObjectEntries<Model> // ['name', string] | ['age', number] | ['locations', string[] | null];

```

```ts
//　一回目のトライ
type ObjectEntries<T> = {
    [P in keyof T]: [P, T[P]]
}
// type result = ObjectEntries<Model>
// type result = { 
//     name: ["name", string];
//     age: ["age", number];
//     locations: ["locations", string[]]; => nullは表示されない
// } => { キー: ["キー", 値] }に推論される

// 二回目のトライ
type ObjectEntries<T> = {
    [P in keyof T]: [P, T[P]]
}[keyof T] // Tのキーで巡回しオブジェクト内の配列(["キー", 値])を取り出す
// type result = ObjectEntries<Model>
// type result = ["name", string] | ["age", number] | ["locations", string[]]
// "location"キーの値としてstring[]だけ出力される

// 三回目のトライ
type ObjectEntries<T> = {
    -readonly [P in keyof T] -? // タイプTのフィールドを全部MutableでRequiredな値で変更
    : [P, T[P] extends (infer R | undefined) ? R : never ]  // undefinedチェック
}[keyof T] 
type result = ObjectEntries<Model>
// nullが表示されないのは開発環境問題(PlayGroundではnullが認識される)
```

<hr/>

### 3062. Shift

> タイプシステムで`Array.shift`を具現してみよう。

```ts
// 例
type Result = Shift<[3, 2, 1]> // [2, 1]
```

```ts
type Shift<T> = T extends [infer First, ...infer Remains] ? Remains : never;
```

<hr/>

### 3188. Tuple to Nested Object 

> 文字列のタイプしかないタプル`T`とタイプ`U`が与えられた時、再帰的にオブジェクトを生成するジェネリック`TupleToNestedObject<T, U>`を具現してみよう。

```ts
// 例
type a = TupleToNestedObject<['a'], string> // {a: string}
type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
type c = TupleToNestedObject<[], boolean> // boolean. if the tuple is empty, just return the U type
```

```ts
type TupleToNestedObject<T, U> 
    = T extends [infer First, ...infer Remains] 
        ? First extends string
            ? { [P in First]:TupleToNestedObject<Remains, U> }
            : never
        : U
// 再帰で配列を分ける所まではできたがその以降Firstの値が文字か否かを検証する必要があった
```

<hr/>

### 3192. Reverse

> タイプシステムで`Array.reverse`を具現してみよう。

```ts
// 例
type a = Reverse<['a', 'b']> // ['b', 'a']
type b = Reverse<['a', 'b', 'c']> // ['c', 'b', 'a']
```

```ts
// 一回目のトライ: 配列を三つに分ける方法
type Reverse<T> 
    = T extends [infer Front, ...infer Remains, infer Last] 
        ? Remains extends [] 
            ? [Last, Front]
            : [Last, ...Reverse<Remains>, Front] 
        : T;

// 二回目のトライ: 配列を二つに分ける方法
type Reverse<T> = T extends [infer First, ...infer Remains] 
                    ? [...Reverse<Remains>, First]
                    : [];
```

<hr />

### 3196. Flip Arguments

> lodashの`_.flip`をタイプシステムで具現してみよう。ジェネリック`FlipArguments<T>`はパラメータのタイプが反対になった新しい関数をリターンします。

```ts
// 例
type Flipped = FlipArguments<(arg0: string, arg1: number, arg2: boolean) => void> 
// (arg0: boolean, arg1: number, arg2: string) => void
```

```ts
type FlipArguments<T> 
    = T extends (...args: infer P) => infer R 
        ? P extends []
            ? () => R
            : (...args: Reverse<P>) => R 
            // スプレッド構文でパラメータを配列にしてこの配列の並びをを逆にするだけ
        : never;

// 配列になったパラメータを逆にするReverseジェネリックを別に定義
type Reverse<Args> 
  = Args extends [infer First, ...infer Remains] 
    ? [...Reverse<Remains>, First] 
    : []
```

<hr />

### 3243. FlattenDepth

> 与えられた数字だけ配列を平たくするジェネリック`FlattenDepth<T>`を具現してみよう。

```ts
// 例
type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2> // [1, 2, 3, 4, [5]]. flattern 2 times
type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, [[5]]]. Depth defaults to be 1
```

```ts
// type FlattenDepth<T, U extends number = 1> 
//     = T extends [infer First, ...infer Remains]
//         ? First extends unknown[]
//             ? [First, ...FlattenDepth<Remains, U>] 
//             // Type instantiation is excessively deep and possibly infinite.
//             // ここで無限ループに陥る
//             : [...FlattenDepth<First, U>, ...FlattenDepth<Remains, U>]
//         : [First, ...FlattenDepth<Remains, U>]

// 無限ループを回避するために空の配列を定義し、この配列の長さを利用
type FlattenDepth<T, K extends number = 1, U extends unknown[] = []> 
    = T extends [infer First, ...infer Remains] // 二つに分ける
        ? First extends unknown[] // もしもFirstが配列で
            ? U['length'] extends K // そして配列Uの長さがKと同じなら(最初は長さが０)
                ? [First, ...FlattenDepth<Remains, K, U>] // 一回flattenを行うと残りで再帰
                : [...FlattenDepth<First, K, [0, ...U]>, ...FlattenDepth<Remains, K, U>] 
                // Uの長さがKと違うとUに0を追加して長さを増やす(無限ループ回避の為)
            : [First, ...FlattenDepth<Remains, K, U>] // Firstが配列ではない場合残りの要素が配列かもしれないので残りで再帰
        : T; // Firstが配列ではない場合そのままTをリターン

type result = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>;
// [[[5]]]みたいに配列の中に一つだけの要素を持つ二重以上の配列は...FlattenDepth<Remains, K, U>が実行されない場合もある
```

</div>
</details>