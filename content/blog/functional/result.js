import {Option} from './option.js';

/**
 * Represents the possible types of results.
 */
export class ResultVariant {
  /**
   * The result is successful.
   */
  static Ok = new ResultVariant();

  /**
   * The result is an error.
   */
  static Err = new ResultVariant();
}

/**
 * Represents either success (Ok) or failure (Err).
 * @template T The type of the successful value.
 * @template E The type of the error value.
 */
export class Result {
  /**
   * The type of this Result.
   * @type {ResultVariant}
   */
  #variant;

  /**
   * The value contained in this Result.
   * @type {T|E}
   */
  #value;

  /**
   * Initializes a new instance of the Result class.
   * @param variant {ResultVariant} The type of the result.
   * @param value {T|E} The value of the result.
   */
  constructor(variant, value) {
    this.#variant = variant;
    this.#value = value;
  }

  /**
   * Creates a new error Result containing the given error value.
   * @param error {E} The error value to store in the Result.
   * @returns {Result<T, E>} The new Result.
   * @constructor
   */
  static Err(error) {
    return new Result(ResultVariant.Err, error);
  }

  /**
   * Creates a new successful Result containing the given value.
   * @param value {T} The value to store in the Result.
   * @returns {Result<T, E>} The new Result.
   * @constructor
   */
  static Ok(value) {
    return new Result(ResultVariant.Ok, value);
  }

  /**
   * Returns the given result if this is Ok.
   * Returns this if Err.
   * @template U The type of the successful value in the provided Result.
   * @param otherResult {Result<U, E>} The Result to return if this is Ok.
   * @returns {Result<U, E>} The provided Result or Err.
   */
  and(otherResult) {
    return this.andThen(() => otherResult);
  }

  /**
   * Returns the result of the given function if this is Ok.
   * Returns this if Err.
   * @template T The type of the successful value in this.
   * @template U The type of the successful value in the Result returned by the function.
   * @param operation {(T) => Result<U, E>}  The function to call with this Result's value if Ok.
   * @returns {Result<U, E>} The result of the given function or Err.
   */
  andThen(operation) {
    if (this.isErr()) {
      return this;
    }

    return operation(this.#value);
  }

  /**
   * Converts Result<T, E> to Option<E>.
   * @returns {Option<E>} An Option containing the error value of this or None.
   */
  err() {
    if (this.isErr()) {
      return Option.Some(this.#value);
    }

    return Option.None();
  }

  /**
   * Returns the contained value if Ok.
   * Throws error with the given message if Err.
   * @param message {string?} The error message to provide if Err.
   * @returns {T} The value in this.
   */
  expect(message) {
    if (this.isOk()) {
      return this.#value;
    }

    throw new Error(message);
  }

  /**
   * Returns the contained value if Err.
   * Throws error with the given message if Ok.
   * @param message {string?} The error message to provide if Ok.
   * @returns {E} The value in this.
   */
  expectErr(message) {
    if (this.isErr()) {
      return this.#value;
    }

    throw new Error(message);
  }

  /**
   * Checks if this is an error Result.
   * @returns {boolean} true if this is an error; false otherwise.
   */
  isErr() {
    return this.#variant === ResultVariant.Err;
  }

  /**
   * Returns true if this is an error Result and the error value matches the
   * given predicate.
   * @param predicate {(E) => boolean} The predicate to check the error value with.
   * @returns {boolean} true if this is an error that matches the predicate; false otherwise.
   */
  isErrAnd(predicate) {
    return this.isErr() && predicate(this.#value);
  }

  /**
   * Checks if this is a successful Result.
   * @returns {boolean} true if this is successful; false otherwise.
   */
  isOk() {
    return this.#variant === ResultVariant.Ok;
  }

  /**
   * Returns true if this is a successful Result and the value maches the given
   * predicate.
   * @param predicate {(T) => boolean} The predicate to check the value with.
   * @returns {boolean} true if this is successful and the value matches the
   * predicate; false otherwise.
   */
  isOkAnd(predicate) {
    return this.isOk() && predicate(this.#value);
  }

  /**
   * Maps the successful value of this Result with the given function.
   * @template T The type of the successful value in this Result.
   * @template U The type to map the successful value to.
   * @param transform {(T) => U} The function to map the successful value from T to U.
   * @returns {Result<U, E>} The mapped Result.
   */
  map(transform) {
    if (this.isErr()) {
      return this;
    }

    return Result.Ok(transform(this.#value));
  }

  /**
   * Maps the error value of this Result with the given function.
   * @template T The type of the successful value in this Result.
   * @template E The type of the error value in this Result.
   * @template F The type to map the error value to.
   * @param transform {(E) => F} The function to map the error value from E to F.
   * @returns {Result<T, F>} The mapped Result.
   */
  mapErr(transform) {
    if (this.isOk()) {
      return this;
    }

    return transform(this.#value);
  }

  /**
   * Returns the given default value if Err.
   * Returns the value transformed by the given function if Ok.
   * @template U The type of the returned value.
   * @param defaultValue {U} The default value to return if Err.
   * @param transform {(T) => U} The function to transform the successful value if Ok.
   * @returns {U} The transformed value or the default value.
   */
  mapOr(defaultValue, transform) {
    return this.mapOrElse(() => defaultValue, transform);
  }

  /**
   * Returns the successful value transformed by the given function if Ok.
   * Returns the error value transformed by the given function if Err.
   * @template T The type of the successful value.
   * @template E The type of the error value.
   * @template U The type of the returned value.
   * @param defaultFn {(E) => U} The function to get the default value if Err.
   * @param transform {(T) => U} The function to transform the successful value if Ok.
   * @returns {U} The transformed value or the default value.
   */
  mapOrElse(defaultFn, transform) {
    if (this.isOk()) {
      return transform(this.#value);
    }

    return defaultFn(this.#value);
  }

  /**
   * Converts Result<T, E> to Option<T>.
   * @returns {Option<T>} An Option containing the successful value of this or None.
   */
  ok() {
    if (this.isOk()) {
      return Option.Some(this.#value);
    }

    return Option.None();
  }

  /**
   * Returns this if Ok.
   * Returns the given Result if this is Err.
   * @template T The type of the successful value of this Result.
   * @template F The type of the error value of the returned Result.
   * @param otherResult {Result<T, F>} The Result to return if this is Err.
   * @returns {Result<T, F>} This Result or the given Result.
   */
  or(otherResult) {
    return this.orElse(() => otherResult);
  }

  /**
   * Returns this if Ok.
   * Returns operation(E) if Err.
   * @template T The type of the successful value of this Result.
   * @template E The type of the error value of this Result.
   * @template F The type of the error value of the returned Result.
   * @param operation {(E) => Result<T, F>} The function to get an alternative
   * Result if this is Err.
   * @returns {Result<T, F>} This Result or the Result returned by the function.
   */
  orElse(operation) {
    if (this.isOk()) {
      return this;
    }

    return operation(this.#value);
  }

  /**
   * Returns the successful value if Ok.
   * Throws an error if Err.
   * @returns {T} The successful value of this.
   */
  unwrap() {
    return this.expect();
  }

  /**
   * Returns the error value if Err.
   * Throws an error if Ok.
   * @returns {E} The error value of this.
   */
  unwrapErr() {
    return this.expectErr();
  }

  /**
   * Returns the successful value of this or the given default value.
   * @param defaultValue {T} The default value to return if Err.
   * @returns {T} The successful value of this or the default value.
   */
  unwrapOr(defaultValue) {
    return this.unwrapOrElse(() => defaultValue);
  }

  /**
   * Returns the successful value of this if Ok.
   * Returns defaultFn(E) if Err.
   * @param defaultFn {(E) => T} The function to get the default value if Err.
   * @returns {T} The successful value of this or the default value.
   */
  unwrapOrElse(defaultFn) {
    if (this.isOk()) {
      return this.#value;
    }

    return defaultFn(this.#value);
  }
}
