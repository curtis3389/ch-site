+++
date = 2023-12-10
title = "Functional Programming Goodies"
description = "Some programming treasures worth pilfering"
draft = true
+++

I'm not a functional programmer, and I have yet to sit down and study a
functional programming language (been looking at Haskell or maybe F#).

But, there are a few wonderful things from the functional programming world that
I want to sing to the sky about.

## Map, Filter, and Reduce (and friends)

Large chunks of most applications can be written as chained calls of the
`map`, `filter`, and `reduce` functions. Getting comfortable with these
gems will save you a ton of typing over the years, and they'll make it easy to
tackle many problems.

### Map

The `map` function applies a mapping function to each element of a collection,
which "maps" each element from an input type `T` to an output type `U`.

Here's how we might write `map` in C#:

```csharp
public static class EnumerableExtensions {
  public static IEnumerable<U> Map<T,U>(this IEnumerable<T> list, Func<T, U> mapElement) {
    foreach (var element in list) {
      yield return mapElement(element);
    }
  }
}
```

The glory of this function is that it lets us lazily apply a function for each
element, so we can easily add 1 to every number:

```csharp
new int[]{1,2,3,4,5}.Map(n => n+1) // [2,3,4,5,6]
```

Or do something more useful like execute a bunch of HTTP requests:

```csharp
var requests = urls.Map(url => SendRequest(url)).ToArray();
Task.WaitAll(requests);
var responses = requests.Map(task => task.Result).ToList();
```

If you're familiar with C#, you might have recognized `map` as the same as the
`Select` method. It is useful for far more than just querying!

### Filter

The `filter` function filters the elements of a collection by checking if a
filter function returns `true` for each element.

Here's how we might write `filter` in C#:

```csharp
public static class EnumerableExtensions {
  public static IEnumerable<T> Filter<T>(this IEnumerable<T> list, Func<T, bool> keepElement) {
    foreach (var element in list) {
      if (keepElement(element)) {
        yield return element;
      }
    }
  }
}
```

The beauty of this function is that it lets us lazily get rid of elements you
don't want, so it's a cinch to get all odd numbers:

```csharp
new int[]{1,2,3,4,5}.Filter(n => n%2 == 1) // [1,3,5]
```

Or do something more useful like get only unsuccessful HTTP requests:

```csharp
// continuing from before
var responses = requests.Map(task => task.Result).ToList();
var failed = responses.Filter(response => respone.IsError).ToList();
```

If you're familiar with C#, you might have recognized `filter` as the same as the
`Where` method. Gee! What a coincidence, eh?

### Reduce

The `reduce` function maps a list of elements to a single element.

Here's how you might write `reduce` in C#:

```csharp
public static class EnumerableExtensions {
  public static U Reduce<T, U>(this IEnumerable<T> list, U starting, Func<U, T, U> reduceElement) {
    var current = starting;
    foreach (var element in list) {
      current = reduceElement(current, element);
    }
    return current;
  }
}
```

The greatness of this function is that it lets us turn a collection into a single value,
so it's trivial to get the sum of a list of numbers:

```csharp
new int[]{1,2,3,4,5}.Reduce(0, (total, next) => total + next) // 15
```

Or do something more useful like get the closest option to your location:

```csharp
var closest = options
  .Map(option => (option, option.GetDistanceTo(currentLocation)))
  .Reduce((null, int.MaxValue), (closest, next) => next.Item2 < closest.Item2
    ? next
    : closest);
```

If you're familiar with C#, you might have recognized `reduce` as the same as the
`Aggregate` method. In C#, we are truly blessed by the programming gods. Praise
 Lovelace! Praise Hopper!

### And Friends!

Once we have `map`, `filter`, and `reduce`, there are various convenience
functions and variations that become available!

#### ForEach

For instance, this variation on `reduce` is great when you want to do something
for each element, and you're already using one of the others:

```csharp
public static class EnumerableExtensions {
  public static U ForEach<T>(this IEnumerable<T> list, Action<T> action) {
    foreach (var element in list) {
      action(element);
    }
  }
}
```

#### First and Last

These get you the first and last elements of a collection, and these can basically be
written as calls to `reduce`:

```csharp
public static class EnumerableExtensions {
  public static U First<T>(this IEnumerable<T> list) =>
    list.Reduce(null, (first, next) => first == null
      ? next
      : first);
  public static U Last<T>(this IEnumerable<T> list) =>
    list.Reduce(null, (_, next) => next);
}
```

The C# versions of these are amazing.

#### Unfold

This one is an oddball, but it is the mirror of `reduce`. In some languages,
`reduce` in known as `fold`. The way I understand `unfold` is that `fold` reduces
the dimensions of a value from `1` to `0`, and `unfold` increases the dimensions
from `0` to `1`.

First, here's how you'd use `unfold` to create the numbers 10 to 1:

```csharp
Unfold(10, b => b == 0
  ? null
  : (b, b-1)) // [10,9,8,7,6,5,4,3,2,1]
```

You can see here that we provide a starting value of `10` and a function that produces
either a signal to stop or the next value to output and the next state value.

Really, we wouldn't use a `null` to signal when to stop, but we haven't looked
at `Option`s yet.

Here's how we might write 'unfold' in C#:

```csharp
public static class EnumerableExtensions {
  public static IEnumerable<T> Unfold<T, U>(U startingState, Func<U, (T, U)?> f) {
    var state = startingState;
    while (state != null) {
      var (nextValue, nextState) = f(state);
      state = nextState;
      yield return nextValue;
    }
  }
}
```

What's crazy about `unfold` is you can easily use it to do stuff like (naively)
generate the Fibonacci sequence:

```csharp
var fibonacci = Unfold((0,1), prevTwo => (
  prevTwo.Item1 + prevTwo.Item2,
  (prevTwo.Item2, prevTwo.Item1 + prevTwo.Item2)
)); // [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...]
```

## Option and Result

The `Option` and `Result` types are functional programming's solution for `null`
and exceptions, respectively. And they're magnificent.

### Option

`Option` is used to represent the presence or absence of a value.

Here's how we might write it in C# (poorly):

```csharp
public abstract class Option<T> {
  public static Option<T> None<T>() => new NoneOption<T>();
  public static Option<T> Some<T>(T value) => new SomeOption<T>(value);
}

public class NoneOption<T> : Option<T> {}

public class SomeOption<T> : Option<T> {
  private readonly T value;
  public SomeOption(T value) {
    this.value = value;
  }
  public T Value => this.value;
}
```

The best thing about `Option` is that it allows us to eliminate null exceptions.
We are always forced to inspect its type and explicitly deal with the possibility
of no value:

```csharp
switch (option) {
  case NoneOption<int> _:
    // handle none case
    break;
  case SomeOption<int> some:
    // use some.Value
    break;
}
```

### Result

`Result` is used to represent the success or failure of an operation, referred to
as `Ok` and `Err` in Rust.

Here's how we might write it in C#:

```csharp
public abstract class Result<T,E> {
  public static Result<T,E> Ok(T value) => new OkResult<T,E>(value);
  public static Result<T,E> Err(E error) => new ErrResult<T,E>(error);
}

public class OkResult<T,E> : Result<T,E> {
  private readonly T value;
  public OkResult(T value) {
    this.value = value;
  }
  public T Value => this.value;
}

public class ErrResult<T,E> : Result<T,E> {
  private readonly E error;
  public ErrResult(E error) {
    this.error = error;
  }
  public E Error => this.error;
}
```

As you can see, this is almost the same as `Option`, but instead of `None`
we have `Err`. This has the same benefits, but for error handling. For any
operation that returns a `Result`, we are force to inspect the `Result` and
handle the possibility that the operation failed.

Being forced to deal with `Result`s is better that exceptions purely because we
are forced. When a method throws an exception, there is nothing in its signature
that tells us so, and there is nothing in the language to stop us from ignoring
exceptions all together.
