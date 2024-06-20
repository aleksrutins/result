# @asr/result

[![JSR](https://jsr.io/badges/@asr/result)](https://jsr.io/@asr/result)
[![JSR Score](https://jsr.io/badges/@asr/result/score)](https://jsr.io/@asr/result)

A simple library for result-based error handling, inspired by Rust's `Result`.

A code block is worth a thousand words:
```ts
import { Result } from '@asr/result';

const okResult = Result.ok('hello, world');
const errorResult = Result.error('not OK');

okResult.unwrap() // 'hello, world'
errorResult.unwrap() // ResultError: not OK

errorResult.unwrapOr('rescued from certain doom') // 'rescued from certain doom'

errorResult.unwrapOrElse(() => 'another value') // 'another value'

okResult.ok() // true
errorResult.ok() // false

okResult.map(it => it + ", Joe").unwrap() // 'hello, world, Joe'
errorResult.mapError(it => it + ", Houston").error // 'not OK, Houston'
```