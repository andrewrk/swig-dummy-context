# swig-dummy-context

Given a [swig](https://github.com/paularmstrong/swig) template, produce a
dummy context that you can immediately use to preview your template.

See also [swig-email-templates](https://github.com/superjoe30/swig-email-templates)

## Example Usage

Contents of `template.html`:

```html
<div>
  {{ description }}
</div>
{% if articles %}
  <ul>
  {% for article in articles %}
    <li>{{ article.name }}</li>
  {% endfor %}
  </ul>
{% else %}
  <p>{{ defaultText }}</p>
{% endif %}
```

```js
var swig = require('swig')
  , createDummyContext = require('swig-dummy-context')

swig.init({
  allowErrors: true,
  root: path.join(__dirname, "templates"),
});
var template = swig.compileFile("template.html");
assert.deepEqual(createDummyContext(template), {
  "description": "description",
  "articles": {
    "name": "name",
  },
  "defaultText": "defaultText"
});
```

