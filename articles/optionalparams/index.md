# genopts for optional parameters

## Overview

This is an idiom for quickly building golang APIs that consume optional parameters.

## "Motivating" example

RPC clients typically have functions that consume both required and optional parameters. For example a function doing a search will take a *required* search query and *optional* limit & *optional* sort direction. If you were to write this as a Go function it would be:

```go
func Search(query string, limit int, sort string) { 
  ... process `query`, `limit`, and `sort` ...
}
```

So, if the caller doesn't supply values for `limit` and `sort` you'd like these default to `20` and `"ASC"`, respectievly, so you'd like to write the following, but you can't:

```go
func Search(query string, limit int = 20, sort string = "ASC") { 
  ... process `query`, `limit`, and `sort` ...
}
```

Even without this syntax, I think the best you can do is to note that the parameters are optional by name, and pass go-defaults, e.g.

```go
func Search(query string, optLimit int, optSort string) {
  limit := 20
  if optLimit != 0 {
    limit = optLimit
  }
  sort := "ASC"
  if optSort != "" {
    sort = optSort
  }

  ... process `query`, `limit`, and `sort` ...
}
```

So calls to `Search` would look like:

```go
Search("some query", 0, "")
Search("some query", 10, "")
Search("some query", 0, "DESC")
Search("some query", 100, "DESC")
```

This still has the property that when you evolve `Search` to have another optional parameter, say `verbose` or `debug`, you need to change all the callers and the signature gets longer. The calls from above would now look like:

```go
Search("some query", 0, "", false, false)
Search("some query", 10, "", false, false)
Search("some query", 0, "DESC", false, false)
Search("some query", 100, "DESC", false, false)
```



This can be mitigated with refactoring tools, but it's still annoying.

## The solution and idiom

Instead you can use the following pattern with [genopts](https://github.com/spudtrooper/genopts)  to generate wrappers and (optionally) [goutil/or](https://github.com/spudtrooper/goutil/or) to incorporate the defult values.

```go
//go:generate --function Search "limit:int" "sort:string"
func Search(query string, optss...SearchOption) { 
  opts := MakeSearchOptions(optss...)

  limit := or.Int(opts.Limit(), 20)
  sort := or.String(opts.Sort(), "ASC")

  ... process `query`, `limit`, and `sort` ...
}
```

then calls to `Search` look like

```go
Search("some query")
Search("some query", SearchLimit(10))
Search("some query", SearchSort("DESC"))
Search("some query", SearchLimit(100), SearchSort("DESC"))
```

and when you add `debug` and `verbose`, they would be unchanged. You would expand the function a little:

```go
//go:generate --function Search "limit:int" "sort:string" debug verbose
func Search(query string, optss...SearchOption) { 
  opts := MakeSearchOptions(optss...)

  limit := or.Int(opts.Limit(), 20)
  sort := or.String(opts.Sort(), "ASC")
  debug := opts.Debug()
  verbose := opts.Verbose()

  ... process `query`, `limit`, `sort`, `debug`, and `verbose` ...
}
```

You can see some [real examples](https://github.com/search?q=%22go%3Agenerate+genopts%22&type=code).