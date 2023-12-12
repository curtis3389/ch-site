/**
 * Represents the possible types of Options.
 */
export class OptionVariant {
  /**
   * The Option doesn't contain a value.
   * @type {OptionVariant}
   */
  static None = new OptionVariant();

  /**
   * The Option contains a value.
   * @type {OptionVariant}
   */
  static Some = new OptionVariant();
}

/**
 * Represents an optional value.
 * Every option can either have Some value or None.
 * @template T
 */
export class Option {
  /**
   * The type of this Option.
   * @type {OptionVariant}
   */
  #variant;

  /**
   * The value contained in this Option, if any.
   * @type {T,undefined}
   */
  #value;

  /**
   * Initializes a new instance of the Option class.
   * @param variant {OptionVariant} The type of the Option.
   * @param value {T?} (Optional) The value contained in the Option.
   */
  constructor(variant, value) {
    this.#variant = variant;
    this.#value = value;
  }

  /**
   * Creates a new Option that doesn't contain a value.
   * @returns {Option<T>} The new Option.
   * @constructor
   */
  static None() {
    return new Option(OptionVariant.None);
  }

  /**
   * Creates a new Option containing the given value.
   * @param value {T} The value to store in the Option.
   * @returns {Option<T>} The new Option.
   * @constructor
   */
  static Some(value) {
    return new Option(OptionVariant.Some, value);
  }

  /**
   * Returns None if this is None.
   * Returns the given Option if this is Some.
   * @template U The type of the value in the provided Option.
   * @param optionB {Option<U>} The value to return if this is Some.
   * @returns {Option<U>} The provided Option or None.
   */
  and(optionB) {
    if (this.isNone()) {
      return this;
    }

    return optionB;
  }

  /**
   * Returns None if this is None.
   * Returns optionFn(T) if this is Some.
   * @template T The type of the value in this Option.
   * @template U The type of the value in the returned Option.
   * @param optionFn {(T) => U} The function to call with the value of this.
   * @returns {Option<U>} None or the Option returned by the function.
   */
  andThen(optionFn) {
    if (this.isNone()) {
      return this;
    }

    return optionFn(this.#value);
  }

  /**
   * Returns the contained value if Some.
   * Throws an Error with the given message if None.
   * @param message {string?} The error message to provide if None.
   * @returns {T} The value in this Option.
   */
  expect(message) {
    if (this.isNone()) {
      throw new Error(message);
    }

    return this.#value;
  }

  /**
   * Returns None if this is None.
   * Returns Some(T) if predicate(T) returns true.
   * Returns None if predicate(T) returns false.
   * @param predicate {(T) => boolean} The predicate function to filter this Option by.
   * @returns {Option<T>}
   */
  filter(predicate) {
    if (this.isNone()) {
      return this;
    }

    if (!predicate(this.#value)) {
      return Option.None();
    }

    return this;
  }

  /**
   * Converts Option<Option<T>> to Option<T>.
   * @returns {Option<T>} None if this is None; otherwise the contained Option.
   */
  flatten() {
    if (this.isNone()) {
      return this;
    }

    if (this.#value instanceof Option && this.#value.isSome()) {
      return this.#value;
    }

    return Option.None();
  }

  /**
   * Returns this Option if Some.
   * Returns the given Option if None.
   * @param optionB {Option<T>} The Option to return if this is None.
   * @returns {Option<T>} This Option if Some or the other Option.
   */
  or(optionB) {
    return this.orElse(() => optionB);
  }

  /**
   * Returns this Option if Some.
   * Returns result of the given function if None.
   * @param optionFn {() => Option<T>} The function that provides the fallback Option.
   * @returns {Option<T>} This Option if Some or result of the given function.
   */
  orElse(optionFn) {
    if (this.isSome()) {
      return this;
    }

    return optionFn();
  }

  /**
   * Checks if this Option does NOT contain a value.
   * @returns {boolean} true if no value; false if this has a value.
   */
  isNone() {
    return this.#variant === OptionVariant.None;
  }

  /**
   * Checks if this Option CONTAINS a value.
   * @returns {boolean} true if this has a value; false otherwise.
   */
  isSome() {
    return this.#variant === OptionVariant.Some;
  }

  /**
   * Returns true if this is Some and the value matches the given predicate.
   * @param predicate {(T) => boolean} The predicate to check this Option's value with.
   * @returns {boolean} true if this contains a value matching the predicate; false otherwise.
   */
  isSomeAnd(predicate) {
    return this.isSome() && predicate(this.#value);
  }

  /**
   * Maps this from Option&lt;T&gt; to Option&lt;U&gt; using the given function.
   * @template T The type of the value in this Option.
   * @template U The type of the value in the returned Option.
   * @param transform {(T) => U} The function to transform the value from T to U.
   * @returns {Option<U>} The transformed Option.
   */
  map(transform) {
    if (this.isNone()) {
      return this;
    }

    return Option.Some(transform(this.#value));
  }

  /**
   * Returns the contained value transformed by the given function if Some.
   * Returns the given default value if None.
   * @template T The type of the value in this Option.
   * @template U The type of the value returned.
   * @param defaultValue {U} The default value to return if None.
   * @param transform {(T) => U} The function to transform the value by if Some.
   * @returns {U} The transformed value or the default value.
   */
  mapOr(defaultValue, transform) {
    return this.mapOrElse(() => defaultValue, transform);
  }

  /**
   * Returns the contained value transformed by the given function if Some.
   * Returns the result of the given function if None.
   * @template T The type of the value in this Option.
   * @template U The type of the value returned.
   * @param defaultFn {() => U} The function to get the default value if None.
   * @param transform {(T) => U} The function to transform the value by if Some.
   * @returns {U} The transformed value or the default value.
   */
  mapOrElse(defaultFn, transform) {
    if (this.isNone()) {
      return defaultFn();
    }

    return transform(this.#value);
  }

  /**
   * Returns the contained value if this is Some.
   * Throws an Error if this is None.
   * @returns {T} The value contained in this Option.
   */
  unwrap() {
    return this.expect();
  }

  /**
   * Returns the contained value if this is Some.
   * Returns the given default value if this is None.
   * @param defaultValue {T} The value to return if this is None.
   * @returns {T} The value contained in this Option or the default value.
   */
  unwrapOr(defaultValue) {
    return this.unwrapOrElse(() => defaultValue);
  }

  /**
   * Returns the contained value if this is Some.
   * Returns the result of the given function if this is None.
   * @param computeDefault {() => T} The function to get the default value if None.
   * @returns {T} The value contained in this Option or the default value.
   */
  unwrapOrElse(computeDefault) {
    return this.isSome()
      ? this.#value
      : computeDefault();
  }

  /**
   * Unzips an Option containing a tuple of two options.
   * If this is Some([a, b]), this returns [Some(a), Some(b)].
   * @returns {Option<T>[]} A tuple of Options.
   */
  unzip() {
    if (this.isNone()) {
      return [Option.None(), Option.None()];
    }

    return [
      Option.Some(this.#value[0]),
      Option.Some(this.#value[1]),
    ];
  }

  /**
   * Returns Some if exactly one of this and optionB are Some.
   * Returns None if both Options are None or Some.
   * @param optionB {Option<T>} The other option to XOR this with.
   * @returns {Option<T>} The XORed Option.
   */
  xor(optionB) {
    if (this.isNone() && optionB.isNone()) {
      return this;
    }

    if (this.isSome() && optionB.isSome()) {
      return Option.None();
    }

    return this.isSome()
      ? this
      : optionB;
  }

  /**
   * Zips this Option with another Option.
   * If this and optionB are Some, returns Some([T, U]).
   * Returns None otherwise.
   * @template T The type of the value in this Option.
   * @template U The type of the value in the provided Option.
   * @param optionB {Option<U>} The Option to zip with this.
   * @returns {Option<[T, U]>} The zipped Option.
   */
  zip(optionB) {
    if (this.isSome() && optionB.isSome()) {
      return Option.Some([this.#value, optionB.#value]);
    }

    return Option.None();
  }
}
