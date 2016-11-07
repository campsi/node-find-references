# `findReferences(obj, path)`


Small utility that resolves property paths against a given object. Instead of returning the primitive value, it computes an array of `Reference` objects that contains both the *container object* and the *property name*, thus allowing dynamic read and write of the value.

The function traverses both `array`'s indexes and `object`'s properties, when a *wildcard segment* `"*"` is used.

## How to use

Install it with NPM or add it to your `package.json`:

```
$ npm install campsi-find-references
```

Then:

```js
const findRefs = require('campsi-find-references');
```

 
## Example

````json
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Product",
    "description": "A product from Acme's catalog",
    "type": "object",
    "properties": {
        "id": {
            "description": "The unique identifier for a product",
            "type": "integer"
        },
        "name": {
            "description": "Name of the product",
            "type": "string"
        },
        "price": {
            "type": "number",
            "minimum": 0,
            "exclusiveMinimum": true
        }
    },
    "required": ["id", "name", "price"]
}
````

### Find the root title `"Product"`

````js
const refs = findReferences(json, ['title']);

refs.length; // 1
refs[0] // => Reference { parent: {$schema: …}, propName: 'title' }
refs[0].set('My Product');

assert.equal('My Product', json.title); // => 'OK!'
````

### Find all `properties.description`
````js
const refs = findReferences(json, ['properties', '*', 'description']);

refs.length; // 2
refs[1].get(); // => "Name of the product"
````
By specifying a *wildcard segment* between `properties` and `description`, the findReferences function will iterate over `id`, `name` and `price`. It won't find a `description` property in the third one and only return two refs.

## The `Reference` object

The `findReferences` function returns an array of `Reference` object. These objects are composed of two properties : the `container`  and the `propName`. Their prototype provides two shortcut methods :
- `get()` which does basically `return this.container[propName]`
- `set(value)` which obviously does `this.container[propName] = value` 


## Features

- Fully tested (Mocha)
- Handles circular structure
- No dependencies

## License

MIT. See LICENSE for details.