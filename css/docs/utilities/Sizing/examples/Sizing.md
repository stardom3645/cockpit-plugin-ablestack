---
id: Sizing
section: utilities
---import './Sizing.css'

## Examples

### Width base and percentage units

```html
<div class="ws-example-u-sizing-item pf-u-w-0">.pf-u-w-0</div>
<div class="ws-example-u-sizing-item pf-u-w-25">.pf-u-w-25</div>
<div class="ws-example-u-sizing-item pf-u-w-50">.pf-u-w-50</div>
<div class="ws-example-u-sizing-item pf-u-w-75">.pf-u-w-75</div>
<div class="ws-example-u-sizing-item pf-u-w-100">.pf-u-w-100</div>
<div class="ws-example-u-sizing-item pf-u-w-initial">.pf-u-w-initial (auto)</div>
<div class="ws-example-u-sizing-item pf-u-w-inherit">.pf-u-w-inherit</div>
```

### Usage

| Class                               | Applied to | Outcome                         |
| ----------------------------------- | ---------- | ------------------------------- |
| `.pf-u-w-initial{-on-[breakpoint]}` | `*`        | Sets width: initial (auto)      |
| `.pf-u-w-inherit{-on-[breakpoint]}` | `*`        | Sets width: inherit             |
| `.pf-u-w-0{-on-[breakpoint]}`       | `*`        | Sets width: 0%                  |
| `.pf-u-w-25{-on-[breakpoint]}`      | `*`        | Sets width: 25%                 |
| `.pf-u-w-33{-on-[breakpoint]}`      | `*`        | Sets width: calc(100% / 3)      |
| `.pf-u-w-50{-on-[breakpoint]}`      | `*`        | Sets width: 50%                 |
| `.pf-u-w-66{-on-[breakpoint]}`      | `*`        | Sets width: calc(100% / 3 \* 2) |
| `.pf-u-w-75{-on-[breakpoint]}`      | `*`        | Sets width: 75%                 |
| `.pf-u-w-100{-on-[breakpoint]}`     | `*`        | Sets width: 100%                |

### Width viewport units

```html isFullscreen
<div class="ws-example-u-sizing-item pf-u-w-25vw">.pf-u-w-25vw</div>
<div class="ws-example-u-sizing-item pf-u-w-33vw">.pf-u-w-33vw</div>
<div class="ws-example-u-sizing-item pf-u-w-50vw">.pf-u-w-50vw</div>
<div class="ws-example-u-sizing-item pf-u-w-66vw">.pf-u-w-66vw</div>
<div class="ws-example-u-sizing-item pf-u-w-75vw">.pf-u-w-75vw</div>
<div class="ws-example-u-sizing-item pf-u-w-100vw">.pf-u-w-100vw</div>
```

### Usage

| Class                             | Applied to | Outcome                          |
| --------------------------------- | ---------- | -------------------------------- |
| `.pf-u-w-25vw{-on-[breakpoint]}`  | `*`        | Sets width: 25vw                 |
| `.pf-u-w-33vw{-on-[breakpoint]}`  | `*`        | Sets width: calc(100vw / 3)      |
| `.pf-u-w-50vw{-on-[breakpoint]}`  | `*`        | Sets width: 50vw                 |
| `.pf-u-w-66vw{-on-[breakpoint]}`  | `*`        | Sets width: calc(100vw / 3 \* 2) |
| `.pf-u-w-75vw{-on-[breakpoint]}`  | `*`        | Sets width: 75vw                 |
| `.pf-u-w-100vw{-on-[breakpoint]}` | `*`        | Sets width: 100vw                |

### Height base and percentage units

```html
<div class="ws-example-u-sizing-item pf-u-h-0 pf-u-display-inline-block">.pf-u-h-0</div>
<div class="ws-example-u-sizing-item pf-u-h-25 pf-u-display-inline-block">.pf-u-h-25</div>
<div class="ws-example-u-sizing-item pf-u-h-50 pf-u-display-inline-block">.pf-u-h-50</div>
<div class="ws-example-u-sizing-item pf-u-h-75 pf-u-display-inline-block">.pf-u-h-75</div>
<div class="ws-example-u-sizing-item pf-u-h-100 pf-u-display-inline-block">.pf-u-h-100</div>
<div class="ws-example-u-sizing-item pf-u-h-initial pf-u-display-inline-block">.pf-u-h-initial (auto)</div>
<div class="ws-example-u-sizing-item pf-u-h-inherit pf-u-display-inline-block">.pf-u-h-inherit</div>
```

### Usage

| Class                               | Applied to | Outcome                          |
| ----------------------------------- | ---------- | -------------------------------- |
| `.pf-u-h-initial{-on-[breakpoint]}` | `*`        | Sets height: initial (auto)      |
| `.pf-u-h-inherit{-on-[breakpoint]}` | `*`        | Sets height: inherit             |
| `.pf-u-h-0{-on-[breakpoint]}`       | `*`        | Sets height: 0%                  |
| `.pf-u-h-25{-on-[breakpoint]}`      | `*`        | Sets height: 25%                 |
| `.pf-u-h-33{-on-[breakpoint]}`      | `*`        | Sets height: calc(100% / 3)      |
| `.pf-u-h-50{-on-[breakpoint]}`      | `*`        | Sets height: 50%                 |
| `.pf-u-h-66{-on-[breakpoint]}`      | `*`        | Sets height: calc(100% / 3 \* 2) |
| `.pf-u-h-75{-on-[breakpoint]}`      | `*`        | Sets height: 75%                 |
| `.pf-u-h-100{-on-[breakpoint]}`     | `*`        | Sets height: 100%                |

### Height viewport units

```html isFullscreen
<div class="ws-example-u-sizing-item pf-u-h-25vh pf-u-display-inline-block">.pf-u-h-25vh</div>
<div class="ws-example-u-sizing-item pf-u-h-33vh pf-u-display-inline-block">.pf-u-h-33vh</div>
<div class="ws-example-u-sizing-item pf-u-h-50vh pf-u-display-inline-block">.pf-u-h-50vh</div>
<div class="ws-example-u-sizing-item pf-u-h-66vh pf-u-display-inline-block">.pf-u-h-66vh</div>
<div class="ws-example-u-sizing-item pf-u-h-75vh pf-u-display-inline-block">.pf-u-h-75vh</div>
<div class="ws-example-u-sizing-item pf-u-h-100vh pf-u-display-inline-block">.pf-u-h-100vh</div>
```

### Usage

| Class                             | Applied to | Outcome                           |
| --------------------------------- | ---------- | --------------------------------- |
| `.pf-u-h-25vh{-on-[breakpoint]}`  | `*`        | Sets height: 25vh                 |
| `.pf-u-h-33vh{-on-[breakpoint]}`  | `*`        | Sets height: calc(100vh / 3)      |
| `.pf-u-h-50vh{-on-[breakpoint]}`  | `*`        | Sets height: 50vh                 |
| `.pf-u-h-66vh{-on-[breakpoint]}`  | `*`        | Sets height: calc(100vh / 3 \* 2) |
| `.pf-u-h-75vh{-on-[breakpoint]}`  | `*`        | Sets height: 75vh                 |
| `.pf-u-h-100vh{-on-[breakpoint]}` | `*`        | Sets height: 100vh                |

## Documentation

### Usage

These utilities are not recommended for general layout purposes. They should primarily be used to enable responsive behaviors of certain components through breakpoints.
