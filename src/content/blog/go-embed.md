---
title: "GO Embed: An Interesting Way to Load Static Assets"
slug: go-embed
cover: "../media/gopher.png"
dateTime: 2024-8-29T08:00:00Z
tags:
  - golang
  - low-level
description: "Discussing how `embed` can improve the way we handle static assets in a single-executable Go applications."
---

## Preamble

Go has one of the most interesting standard libraries, and among its many features, the `embed` package stands out as a particularly useful tool. This article will explore how `embed` can improve the way we handle static assets in Go applications.

## Introduction to Go Embed

Introduced in Go 1.16, the `embed` package provides a way to include static files and folders directly into your Go binary at compile time. This feature eliminates the need for separate deployment of assets and simplifies the distribution of Go applications.

## Key Features of Go Embed

### **Compile-Time Inclusion**
Assets are embedded during compilation, ensuring they're always available with your binary which is analogus to [static linking](https://www.geeksforgeeks.org/static-and-dynamic-linking-in-operating-systems/) in a sense that static linking will include  all the compiled code in your binary, and embedding will include files as if they were [base-64 encoded](https://en.wikipedia.org/wiki/Base64) and added as `[]byte` in the code. 

### **Cross-Platform Compatibility**
Embedding files on different operating systems is supported.

### **Type-Safety**
The compiler checks the existence of embedded files, and with intelliSense, it's easy to spot typos and incorrect filepaths, reducing runtime errors.

### **Simplified Deployment**
this is one of the places where I needed it the most while deploying a serverless application to [GCP](https://cloud.google.com/go) that had font rendering, and fonts needed to be loaded from a separate asset directory. 
you wouldn't be able to acess it directly as if it was part of your file system, you should use the path `./serverless_function_source_code/` instead of the root of your project which is unintuitive, it was mentioned in the [GCP documentation](https://cloud.google.com/functions/docs/concepts/execution-environment#memory-file-system) 
so, you got to make a guard to check the execution environment and change all your paths accordingly.

but this solution mitigates this problem all together.

**Ease of Use**
theres a 

## How to Use Go Embed

Using Go Embed is straightforward. Here's a basic example:
> the embed compiler flags must be in the top level of the file and cannot be used inside of a function.
> It will not compile if the flags are not in the top level of the file, or the file or directory does not exist.

```go
package main

import (
    "embed"
    "fmt"
)

//go:embed hello.txt
var content string
// correct ✔️

//go:embed cairo-bold.ttf
var bFont []byte
// correct ✔️


func main() {
    //go:embed video.mp4 
    // incorrect ❌

    fmt.Println(content)
    fmt.Printf("video size is %d\n", len(bVideo)) 
}
```
In this example, the contents of `hello.txt` are embedded into the `content` variable as a string and the `cairo-bold.ttf` is embedded into the `bFont` variable as a byte slice, that can be used with the standard library.

### Advanced Usage

Go Embed isn't limited to just string content. You can embed entire directories, use file systems, and even embed binary data:
```go
//go:embed static/*
var staticFiles embed.FS

func main() {
    data, _ := staticFiles.ReadFile("static/styles.css")
    fmt.Println(string(data))
}
```
## Real World Example
you can use the `embed.FS` in your main entry point and pass it around which I don't think is a good practice.

what is suggest is to use the `embed.FS` as a package that is a sibling to the other packages that are going to use it.



```
project/
    ├── cmd/
    │   ├── your-app-name/
    │   │   ├── main.go         # Application entry point
    │   │   └── ...             # Other application-specific files
    │   └── another-app/
    │       ├── main.go         # Another application entry point
    │       └── ...
    ├── pkg/                     # Public, reusable packages
    |   │   ├── mypackage/
    │   │   ├────── mypackage.go    # Public package code
    │   │   └────── ...
    │   │
    │   ├── assets/
    │   │   ├── assets.go       # asset loader
    │   │   ├── cairo-bold.ttf  # Font file
    │   │   ├── hello.txt       # Text file
    │   │   └── ...
    │   └── ...
    ├── tests/                   # Unit and integration tests
    │   ├── unit/
    │   │   ├── ...
    │   └── integration/
    │       ├── ...
    ├── .gitignore               # Gitignore file
    ├── go.mod                   # Go module file
    ├── go.sum                   # Go module dependencies file
    └── README.md                # Project README

```
```go
// <project>/pkg/assets/assets.go
package assets

import "embed"

//go:embed *
var FS embed.FS
```

and then use it from anywhere in the project.

```go
// <project>/pkg/mypackage/mypackage.go
package mypackage

import "<project>/pkg/assets"

func DoSomethingWithAssets() {
    data, _ := assets.FS.ReadFile("hello.txt")
    fmt.Println(string(data))
}
```


### Benefits in Web Development
For web developers, Go Embed offers significant advantages:

1. **Single Binary Deployment**: Your HTML, CSS, and JavaScript can be part of your Go binary.
2. **Improved Security**: Assets are compiled into the binary, making them harder to tamper with.
3. **Faster Startup Times**: It will speed up your application depending on the size of your assets and the time of I/O operations in the deployment environment.

## Considerations and Limitations

While powerful, Go Embed does have some considerations:

1. **Increased Binary Size**: Embedded assets increase the size of your executable.
2. **Immutability**: Embedded files can't be modified at runtime.
3. **Build-Time Overhead**: Compilation time may increase with large assets.
4. **Compiler Flags**: Go Embed requires the use of the `embed` compiler flag, which is not always expected to be scattered around the project to change the behaviour, especially when it's just a comment not a function invocation.

## Conclusion

Go Embed represents a significant step forward in managing static assets in Go applications. Its integration into the standard library underscores Go's commitment to simplifying development and deployment processes. By leveraging Go Embed, developers can create more self-contained, easily distributable applications, further cementing Go's position as a powerful and practical programming language.

Whether you're building web services, CLI tools, or desktop applications, Go Embed offers a elegant solution to an age-old problem in software distribution. Give it a try in your next project and experience the benefits firsthand!