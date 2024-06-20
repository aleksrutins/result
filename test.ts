import { assert } from "jsr:@std/assert";
import { Result } from "./mod.ts";

function expectToThrow(fn: () => void) {
    try {
        fn();
        assert(false);
    } catch(_: unknown) {
        assert(true);
    }
}

Deno.test("ok", async t => {
    const okResult = Result.ok('hello, world') as Result<string, string>;

    await t.step('unwrap', () => assert(okResult.unwrap() == 'hello, world'));
    await t.step('unwrapOr', () => assert(okResult.unwrapOr('something else') == 'hello, world'));
    await t.step('unwrapOrElse', () => assert(okResult.unwrapOrElse(() => 'something else again') == 'hello, world'))
    await t.step('ok', () => assert(okResult.ok()))
    await t.step('map', () => assert(okResult.map(x => x + ", Joe").unwrap() == 'hello, world, Joe'))
    await t.step('mapError', () => assert(okResult.mapError(x => x + ", Joe").unwrap() == 'hello, world'))
});

Deno.test("error", async t => {
    const errorResult = Result.error('hello, world') as Result<string, string>;

    await t.step('unwrap', () => expectToThrow(() => errorResult.unwrap()));
    await t.step('unwrapOr', () => assert(errorResult.unwrapOr('something else') == 'something else'));
    await t.step('unwrapOrElse', () => assert(errorResult.unwrapOrElse(() => 'something else again') == 'something else again'))
    await t.step('ok', () => assert(!errorResult.ok()))
    await t.step('map', () => assert(errorResult.map(x => x + ", Joe").error == 'hello, world'))
    await t.step('mapError', () => assert(errorResult.mapError(x => x + ", Joe").error == 'hello, world, Joe'))
});