# vuex-router

[![CircleCI](https://circleci.com/gh/geekytime/vuex-router.svg?style=svg)](https://circleci.com/gh/geekytime/vuex-router)

Moves app location state into a `router` module in the Vuex store.

The store becomes the "source of truth" for location state within the app. Location state is changed by dispatching actions to the `router` module.

The browser location history is kept in sync with the store by the `router` module.

## Why does _that_ matter? Isn't the browser url the "source of truth" for location state?

The goal of Vuex is to move most/all of the non-trivial state of an app into the store, where it can be managed and safely shared across components.
`vuex-router` provides a relatively painless way to safely manage the application state inside the store, along with the rest of the application state, using standard Vuex `state`, `getters`, `actions`, and `mutations`.

This is convenient from an API perspective, and allows for some very clean code. The location state is read and updated just like the rest of the application state, instead of requiring a separate routing API.

## How is this different than [vue-router](https://router.vuejs.org/en/) with [vuex-router-sync](https://github.com/vuejs/vuex-router-sync)?

Even when used with `vuex-router-sync`, `vue-router` still uses the browser history as the "source of truth" for the location state.

`vuex-router-sync` does not _fully manage_ location state inside the Vuex store. It copies the browser's location state into the store for convenience. `vue-router` provides a separate API, outside the Vuex store, to manage location state.

## `vuex-router` Benefits

- Provides a simple page-based router by default. `pageRoutes` are easy to configure, and suitable for many apps.
- Fully functional page slide transitions are easily configured when using `pageRoutes`. (Other transitions are in the works.)
- `pageRoutes` are optional. `vuex-router` manages the browser location history
separate from the default routes, so any router can be used.
- ViewModels only need access to the `$store`, as opposed to needing both a `$store` and a separate `$router`.
- The included `Pages` and `Page` components still allow for easy setup of fixed headers, nav-drawers, etc.
- The included `Link` component takes care of sending most user-interactions to the browser history.

## Usage

### Installation and project configuration

Install `vuex-router` with yarn or npm.

The easiest way to configure `vuex-router` is with [WebPack](https://webpack.js.org/) and [babel-loader](https://github.com/babel/babel-loader). In most situations, babel-loader will find the `.babelrc` file in the `vuex-router` folder and use it to build `vuex-router`.

If there are questions about a specific configuration scenario, feel free to open an issue, or submit a PR with an example, even if it's only partly working.

A pre-transpiled version of `vuex-router` is included at `dist/vuex-router-min.js` in the npm package, but it has not been thoroughly tested. Please open an issue if there are any problems using it.

### Configuring the Vuex store

We add the `router` module from `vuex-router` to our store, like this:

```javascript
import { router } from "vuex-router"

const store = new Vuex.Store({
  modules: {
    router
  }
})
```

> (Note, we can change the name of the `router` to whatever we want, but then we will need to dispatch actions using that name. The rest of these examples assume the default `router` namespace for the module. See [Vuex - Modules - Namespacing](https://vuex.vuejs.org/en/modules.html#namespacing) to learn more.)

### Initializing the `router` using `pageRoutes`

Before we can use the router, we need to initialize it by `dispatch`ing the `router/init` action on the store. The default `page-router` allows us to map our routes to simple page names. We supply our `pageRoutes` to the `router/init` action like this:

```javascript
const pageRoutes = [{
  page: "home",
  path: ["", "/", "/home"],  
  transIndex: 0
},{
  page: "foo",
  path: "/foo",  
  transIndex: 1
},{
  page: "bar",
  path: ["/bar","/bar/:id"],  
  transIndex: 2
}]

store.dispatch("router/init", {pageRoutes})
```

> (Notice above that we pass an _object_ to the action, with `pageRoutes` as the key.)

See the [pageRoutes](#pageRoutes) section below for more details on how to configure `pageRoutes`.

### Adding `Page` components to our app

> Note: this guide assumes a basic understanding of how Vue components work. See [Components Basics](https://vuejs.org/v2/guide/components.html) and [Components In-Depth](https://vuejs.org/v2/guide/components-registration.html) to learn more.

Once the `router` module is configured and initialized in the store, we can add `vuex-router`'s `Pages` and `Page` components to our app,
usually in our top-level app/root component.

We use `Page` and `Pages` like any other Vue components. `import` them, and add them to the `components` hash of our main `App` component.

*javascript*

```javascript
import Bar from "./components/bar.vue"
import Foo from "./components/foo.vue"
import Home from "./components/home.vue"
import {Page, Pages} from "vuex-router"

export default {
  components: {
    Bar,
    Foo,
    Home,
    Page,
    Pages
  }
}
```

We assign a `name` attribute to each of our `Page` components. These names will
match up with the `page` properties on our `pageRoute`s.

We can then slot our top-level components inside the `Page` components.

*html*

```html
<div class="app">  
  <Pages> <!-- Root component to manage Page components -->
    <Page name="home"> <!-- `vuex-router` Page component with `name` set -->
      <Home /> <!-- The page we want to render when router page name is `home `-->
    </Page>
    <Page name="foo">
      <Foo />
    </Page>
    <Page name="bar">
      <Bar />
    </Page>
  </Pages>
</div>
```

> Note: We may also "replace" the `Page` components with our components using [the `:is` attribute](https://vuejs.org/v2/api/#is), but this will result in page transitions being disabled. The wrapper `Page` components are necessary for transitions to work.

### Initializing the `router` _without_ `pageRoutes`

We don't have to use `pageRoutes` to use `vuex-router`. We can wire up our own router in a root component, or add a custom router module to our store.

We still need to initialize the `router` module before history any ctions will work. We simply `dispatch` the `router/init` action without any parameters:

```javascript
store.dispatch("router/init")
```

## API

## `router` Vuex module

### Actions

#### `store.dispatch("router/init", options)`

Initializes the `router` module that was added to the store, and tells it to start managing location state. After this action runs, browser location change events will be handled by the `router`, and we should use `actions` on the router to modify the location state.

#### `store.dispatch("router/go", {steps})`

Navigates the specified number of steps through the browser location history.
For example, to go back one page:

```javascript
store.dispatch("router/go", {steps: -1})
```

Or to go forward two pages:

```javascript
store.dispatch("router/go", {steps: 2})
```

> `router/go` is analogous to [`window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Traveling_through_history).

#### `store.dispatch("router/goBack")`

Goes back one step in the browser location history. This works just like if the user presses the "back" button in the browser toolbar.

> `router/goBack` is analogous to [`window.history.back`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Traveling_through_history).

#### `store.dispatch("router/goForward")`

Goes forward one step in the browser location history. This works just like if the user presses the "forward" button in the browser toolbar.

> `router/goForward` is analogous to [`window.history.forward`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Traveling_through_history).

#### `router/locationChange`

Used internally by the `router`. Invoking this action from outside the
`router` could result in the location state falling out of sync with the browser history.

#### `store.dispatch("router/push", {path})`

Sets the current location state to the specified `path`, and adds the new location to the browser history. So, to go back to the root location of our app:

```javascript
store.dispatch("router/push", {path: "/"})
```

To go to our `/blog` page:

```javascript
store.dispatch("router/push", {path: "/blog"})
```

> Note: Relative paths can be `push`ed, and they will work as expected, but this can be tricky when using `pageRoutes`. Most apps using `pageRoutes` will probably want to stick to a "flat"-ish route design.

> `router/push` is _roughly_ analogous to [`window.history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries), but uses only the URL/path argument.

#### `store.dispatch("router/replace", {path})`

Works like the `router/push` action, but _replaces_ the current location with the new path. To explain, suppose we run the following code:

```javascript
store.dispatch("router/push", {path: "/"})
store.dispatch("router/push", {path: "/home"})
store.dispatch("router/replace", {path: "/blog"})
store.dispatch("router/goBack")
```

The user's location will be `"/"`, because when we added `"/blog"`, it _replaced_ `"/home"` in the browser's history.

Learn more about browser history at [MDN - Adding and modifying history entries]([`window.history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries)

#### `router/transitionEnd`

Called by `Page` components to let the router know when page transition is complete. Should not need to be called by applications.

### State and Getters

#### state shape

The state stored by the router looks like this:

```javascript
const state = {
  // The current page-based route.
  // A route includes a page name, and any URL parameters that are
  // defined as part of the path.
  currentRoute: false,
  // The previous route. Stored to help with transitions.
  lastRoute: false,
  // Transition data set while transitions are in progress.
  transition: false,
  // A map of pages and their last scroll position.
  // The scroll position is saved and restored as pages are hidden
  // and shown.
  scrollTops: {},
  // The current location of the page. Roughly analogous to the
  // `window.location` property in the browser.
  location: {
    pathname: "",
    search: "",
    hash: "",
    state: {},
    key: ""
  }
}
```

#### `store.getters["router/currentPage"]`

Returns the current page name as determined by the `page-router`.

A `pageRoute` maps a browser location to a page name. If `pageRoute`s are not being used, this property returns `false`.

#### `store.getters["router/lastPage"]`

Returns the most recent page that was displayed before the current page. This is used mainly to track transitions away from the last page.

#### `store.getters["router/scrollTopForPage"](pageName)`

Returns any previously saved scroll information for the page with the given name. Used by the `Page` component to restore page scroll state when pages are re-shown after being hidden.

#### `store.getters[router/transitionForPage](pageName)`

Returns the active transition that should be applied to a page. Used by the `Page` component to apply transition classes to pages.

### Mutations

The mutations defined on the `router` module should be considered private for most implementations. Calling them from outside of the `router` actions could result in location state getting out of sync with the browser history.

#### `pageRoutes`

Here is an example pageRoutes array:

```javascript
const pageRoutes = [{  
  page: "home",
  path: ["", "/", "/index", "/home"],  
  transIndex: 0
},{
  page: "about",
  path: "/about",  
  transIndex: 1
},{
  page: "blog",
  path: ["/blog", "/blog/:post"],  
  transIndex: 2
}]
```

A `pageRoute` is made of three properties:

- page: the name of the page
- path: a string, or array of strings that route to this page
- transIndex: an integer used to

##### `pageRoute.page`

The page name can be any valid JS property string. This is the same name that we supply to the `Page` component, if we're using it.

##### `pageRoute.path`

Can be a string path, or an array of string paths. These paths will be matched against the browser's location to determine the current page and page parameters.

`path`s are passed to a specially configured  [universal-router](https://github.com/kriasoft/universal-router/blob/master/docs/api.md#url-parameters) instance, to handle matching and to parse [url parameters](https://github.com/kriasoft/universal-router/blob/master/docs/api.md#url-parameters). Url parameters are available in the `currentRoute` property of the `state`, and via the `router/currentRoute` getter.

For example, if we define a `pageRoute` like:

```javascript
{
  page: "blog",
  path: "/blog/:postId"
}
```

And then go to the location `/blog/14`, then `store.state.router.currentRoute` will look like this:

```javascript
{
  page: "blog",
  params: {
    postId: "14"  
  }
}
```

> Note: that the url/path parameter value will always be a string.

Because we can define multiple paths for a page, we can use the same page to handle both the parameterized and parameter-less versions of the path, like this:

```javascript
{
  page: "blog",
  path: ["/blog", "/blog/:postId"]  
}
```

Then inside our blog page, we can check whether we have a `postId`, and display the relevant sub-components like this:

*Html*

```html
<div class="blog">
  <Post v-if="postId" :id="postId" />
  <RecentPosts v-else />  
</div>
```

*Javascript*

```javascript
export default {
  computed: {
    postId () {
      return this.$store.getters["router/currentRoute"].params.postId
    }
  }
}
```

##### `pageRoute.transIndex`

The `transIndex` is optional. If supplied, it is used to determine the direction for the default page slide transitions.

Pages will slide to the left when the router transitions to a lower `transIndex`, and to the right when moving to a higher `transIndex`.


### `Pages` and `Page` components

The `Pages` component provides basic default styling to handle full-page sliding page transitions.

The `Page` component handles the details of showing and hiding, and transitioning pages based on the defined `pageRoute`s and router state.

Apps should not need to use the APIs of these components directly. They can simply be added to application templates.
