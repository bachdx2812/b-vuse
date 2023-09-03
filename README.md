# @bachdx/b-vuse

> Most used vue composables which I would like to make it betters
> to share between my projects

## Prerequisites

This project requires NodeJS (version 16 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
9.6.5
v16.14.0
```

## Table of contents

- [@bachdx/b-vuse](#bachdxb-vuse)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Core Functions](#core-functions)
    - [useBreadcrumb](#usebreadcrumb)
      - [Import](#import)
      - [Usage Example:](#usage-example)
        - [In `page` (component) where you need to change the breadcrumb](#in-page-component-where-you-need-to-change-the-breadcrumb)
        - [In the actual `breadcrumb` rendering `component`](#in-the-actual-breadcrumb-rendering-component)
      - [Notice:](#notice)
      - [Data and Methods](#data-and-methods)
    - [useQuery](#usequery)
      - [Import](#import-1)
      - [Usage Example:](#usage-example-1)
        - [In Pinia Store and components ( maybe )](#in-pinia-store-and-components--maybe-)
        - [To update query ( such as page)](#to-update-query--such-as-page)
      - [Data and Methods](#data-and-methods-1)
  - [Contributing](#contributing)
  - [Authors](#authors)
  - [License](#license)

## Getting Started

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

To install and set up the library, run:

```sh
$ npm i @bachdx/b-vuse
```

Or if you prefer using Yarn:

```sh
$ yarn add @bachdx/b-vuse
```

## Core Functions

### useBreadcrumb

> The breadcrumb control that can share across all components without using localStorage or any storage but still `reactive`

Most of my project using the same structure for breadcrumb as below

![Most Used Breadcrumb and Page Title](./assets/images/breadcrumb-sample.png)

```js
const breadcrumb = {
  title: "Dummy title",
  items: [
    {
      text: "First Item",
      href: "/first-item",
      active: false, // should be false for all items except last one
    },
    {
      text: "Last Item",
      href: "/last-item",
      active: true,
    },
    // ...another last on your demands
  ],
};
```

And the `component` for rendering the _breadcrumb_

```html
<template>
  <div class="row">
    <div class="col-12">
      <div
        class="page-title-box d-flex align-items-center justify-content-between"
      >
        <h4 class="mb-0 font-size-18">{{ breadcrumb.title }}</h4>

        <div class="page-title-right">
          <!-- I use vue bootrap here but you can you anything you want -->
          <b-breadcrumb class="m-0">
            <b-breadcrumb-item
              v-for="(item, i) in breadcrumb.items"
              :key="i"
              :text="item.text"
              :to="item.href"
              :active="item.active"
            ></b-breadcrumb-item>
          </b-breadcrumb>
        </div>
      </div>
    </div>
  </div>
</template>
```

So if you dont want to use the title, be my guest, just remove the `breadcrumb.title`

##### Import

```js
import { useBreadcrumb } from "@bachdx/b-vuse";
```

##### Usage Example:

###### In `page` (component) where you need to change the breadcrumb

```js
import { useBreadcrumb } from "@bachdx/b-vuse";
const { setBreadcrumb } = useBreadcrumb();

setBreadcrumb({
  title: "User List",
  items: [
    {
      text: "User",
      href: "/users",
    },
    {
      text: "List",
      active: true,
    },
  ],
});
```

###### In the actual `breadcrumb` rendering `component`

```js
import { useBreadcrumb } from "@bachdx/b-vuse";
const { breadcrumb, getBreadcrumb } = useBreadcrumb();
getBreadcrumb();
```

after this you should be able to change the `page` ( components ) and will have the `reactive` breadcrumb on every page

#### Notice:

You might need to set your `router` setup to `reset` the content of `breadcrumb` before each route changed by doing this

```js
setBreadcrumb({});
```

#### Data and Methods

| Type     | Name          | Attributes/Params                                                                   |
| -------- | ------------- | ----------------------------------------------------------------------------------- |
| ref      | breadcrumb    | { 'title': String, 'items': [{'text: String, 'href': String, 'active': Boolean }] } |
| function | getBreadcrumb | None                                                                                |
| function | setBreadcrumb | { 'title': String, 'items': [{'text: String, 'href': String, 'active': Boolean }] } |

### useQuery

> The query object that most of my project use for supporting query data from server and paging support

```js
const queryInput = {
  page: 1,
  perPage: 10,
  q: {}, // this should be ransacker support object
};
```

##### Import

```js
import { useQuery } from "@bachdx/b-vuse";
```

##### Usage Example:

###### In Pinia Store and components ( maybe )

```js
const { queryInput, resetQuery, updateQuery } = useQuery();
```

###### To update query ( such as page)

```js
updateQuery({ page: page });
```

#### Data and Methods

| Type       | Name        | Attributes/Params                     |
| ---------- | ----------- | ------------------------------------- |
| QueryInput | queryInput  | { 'page': 1, 'perPage': 10, 'q': {} } |
| function   | resetQuery  | None                                  |
| function   | updateQuery | { 'page': 1, 'perPage': 10, 'q': {} } |

## Contributing

1.  Clone it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:

## Authors

- bachdx (https://github.com/bachdx2812)
- Hopefully more to come here...

## License

UNLICENSED
