/**
 * This module exports a `Result` class that represents either a success or a failure,
 * and a `ResultError` class that represents an error when unwrapping a `Result`.
 * 
 * @module mod
 */

/**
 * An error thrown when unwrapping an error {@link Result}.
 * 
 * @template E The type of the error.
 */
export class ResultError<E> extends Error {
    /**
     * Constructs a new `ResultError`.
     * 
     * @param err The error to wrap.
     */
    constructor(err: E) {
        super((err as { toString: () => string}).toString())
        this.name = "ResultError";
    }
}

/**
 * A value representing either success or failure.
 * 
 * @template V The type in case of success.
 * @template E The type in case of failure.
 */
export class Result<V, E> {
    /**
     * The value in case of success.
     */
    readonly value?: V

    /**
     * The error in case of failure.
     */
    readonly error?: E

    /**
     * Private constructor to enforce the use of static methods for construction.
     */
    private constructor(value?: V, error?: E) {
        this.value = value;
        this.error = error;
    }

    /**
     * Creates a successful result.
     * 
     * @param value The value in case of success.
     * @returns A result representing a success.
     */
    static ok<V>(value: V): Result<V, never> {
        return new Result(value, undefined as never);
    }
    
    /**
     * Creates a failed result.
     * 
     * @param error The error in case of failure.
     * @returns A result representing a failure.
     */
    static error<E>(error: E): Result<never, E> {
        return new Result(undefined as never, error);
    }

    /**
     * Unwraps the result, throwing an error if it represents a failure.
     * 
     * @throws {ResultError} If the result represents a failure.
     * @returns The value in case of success.
     */
    unwrap(): NonNullable<V> {
        if(this.error) throw new ResultError(this.error);

        return this.value!;
    }

    /**
     * Unwraps the result, returning a fallback value if it represents a failure.
     * 
     * @param fallback The value to return in case of failure.
     * @returns The value in case of success, or the fallback value in case of failure.
     */
    unwrapOr(fallback: NonNullable<V>): NonNullable<V> {
        return this.value ?? fallback;
    }

    /**
     * Unwraps the result, returning a fallback value produced by a function if it represents a failure.
     * 
     * @param fallback A function that produces a value to return in case of failure.
     * @returns The value in case of success, or the fallback value produced by the function in case of failure.
     */
    unwrapOrElse(fallback: () => NonNullable<V>): NonNullable<V> {
        return this.value ?? fallback();
    }

    /**
     * Checks if the result represents a success.
     * 
     * @returns `true` if the result represents a success, `false` otherwise.
     */
    ok(): boolean {
        return this.error == null
    }

    /**
     * Transforms the value in case of success.
     * 
     * @param next A function that transforms the value.
     * @returns A new result with the transformed value in case of success, or the original result in case of failure.
     */
    map<R>(next: (value: V) => R): Result<R, E> {
        if(this.ok()) return Result.ok(next(this.value!));
        else return Result.error(this.error!);
    }

    /**
     * Transforms the error in case of failure.
     * 
     * @param next A function that transforms the error.
     * @returns A new result with the transformed error in case of failure, or the original result in case of success.
     */
    mapError<R>(next: (error: E) => R): Result<V, R> {
        if(!this.ok()) return Result.error(next(this.error!));
        else return Result.ok(this.value!);
    }
}