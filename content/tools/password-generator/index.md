+++
date = 2024-04-25
title = "Memorable Password Generator"
description = "Generates passwords you can remember"
+++

## Password Generator

<div id="password-generator-component"></div>

## Overview

This password generator is a copy of [xkpasswd](https://xkpasswd.net), which was inspired by [this xkcd comic](https://xkcd.com/936/).
I originally created a Bash script version of xkpasswd (see below) to do password generation locally and with my local [`dict`](https://wiki.archlinux.org/title/Dictd) wordlist.
I decided to create a copy of the xkpasswd tool so that I could have a web version with the following tweaks:

1. uses the wordlist from my machine
2. uses randomness I trust
3. does everything locally in the browser

Also, this is just practice with [ESBuild](https://esbuild.github.io/), [Preact](https://preactjs.com/), and minimalist UI design.

## Advantages

I love this pattern for making strong but memorable passwords!

If every character in a 12-character password is totally random, e.g. `QR(/2Vuv{gsn`, then you need to memorize a sequence of 12 pieces of information.

With this pattern you can have passwords longer than 32 characters, e.g. `??96&claudio&DOWNPLAYS&necks&MISCOMMUNICATION&80??`, by memorizing only 9 things: the pattern, the padding symbol, the first number, the separator symbol, the 4 words, and the last number.

## Tweaks

### Wordlist

The wordlist this uses is from Debian Bookworm with the following dictionaries installed: [dict-foldoc](https://packages.debian.org/bookworm/dict-foldoc), [dict-gcide](https://packages.debian.org/bookworm/dict-gcide), [dict-jargon](https://packages.debian.org/bookworm/dict-jargon), [dict-vera](https://packages.debian.org/bookworm/dict-vera), [dict-wn](https://packages.debian.org/bookworm/dict-wn). I haven't filtered it, so...apologies.

### Randomness

This version uses [`window.crypt.getRandomValues`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) for cryptographically strong randomness.

The Bash version uses `/dev/urandom` for good response times. You could switch it to `/dev/random` if you're okay with the occasional delay.

### Everything Local in the Browser

There's no server backend to this. It's written in [TypeScript](https://www.typescriptlang.org/) and uses [Preact](https://preactjs.com/) for the UI. The wordlist is in the JavaScript bundle, and the all the work is done in the browser.

### UI Design

I started the UI with a minimalist copy of the original. I've kept it minimal because I enjoy the aesthetics and it eases change. Some design aspects are affected by the framework; for example, the UI for customizing the separator alphabet is heavily influenced by React's data model.

## Bash Version

My version of xkpasswd in Bash is actually pretty great to use daily.
It runs locally with your machine's dictionary and `/dev/urandom`
and it's also a good reference for `sed`, `tr`, and creating functions:

```bash
#!/bin/bash
function random_word {
    cat /usr/share/dict/words | sed -E '/[^a-zA-Z]/d' | shuf -n 1
}

function random_symbol {
    cat /dev/urandom | tr -dc '[:punct:]' | head -c 1
}

function random_digit {
    cat /dev/urandom | tr -dc '[:digit:]' | head -c 1
}

function to_upper {
    echo $1 | tr '[:lower:]' '[:upper:]'
}

function to_lower {
    echo $1 | tr '[:upper:]' '[:lower:]'
}

padding_symbol=$(random_symbol)
separator_symbol=$(random_symbol)
first_number=$(echo "$(random_digit)$(random_digit)")
last_number=$(echo "$(random_digit)$(random_digit)")
first_word=$(to_lower $(random_word))
second_word=$(to_upper $(random_word))
third_word=$(to_lower $(random_word))
fourth_word=$(to_upper $(random_word))

echo "$padding_symbol$padding_symbol$first_number$separator_symbol$first_word$separator_symbol$second_word$separator_symbol$third_word$separator_symbol$fourth_word$separator_symbol$last_number$padding_symbol$padding_symbol"
```

<script src="bundle.js"></script>
