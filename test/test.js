var createDummyContext = require('../')
  , emailTemplates = emailTemplates
  , swig = require('swig')
  , boostContent = require('boost').boostContent
  , assert = require('assert')
  , path = require('path')
  , Batch = require('batch')
  , fs = require('fs')

swig.init({
  allowErrors: true,
  root: path.join(__dirname, "templates"),
});
var testMap = {
  "simple_vars": {
    hello: "hello",
  },
  "two_vars_content": {
    one: "one",
    two: "two",
  },
  "for_loop": {
    scalar: "scalar",
    scalar2: "scalar2",
    xyz: [ "abcd" ],
    lalala: "lalala",
  },
  "plays": {
    subject: "subject",
    emailPreferencesUrl: "emailPreferencesUrl",
    userImgUrl: "userImgUrl",
    playCount: "playCount",
    commentCount: "commentCount",
    voteCount: "voteCount",
    facebookShareUrl: "facebookShareUrl",
    twitterShareUrl: "twitterShareUrl",
    userName: "userName",
    opportunityListenUrl: "opportunityListenUrl",
    submissionStatsUrl: "submissionStatsUrl",
  },
  "if_statement": {
    one: "one",
    two: "two",
    three: "three",
    four: "four",
    five: "five",
    foo: "foo",
    derp: "derp",
  },
  "comments": {
    twenty: "twenty",
    ten: "ten",
    eleven: "eleven",
    baseOne: "baseOne",
    baseTwo: "baseTwo",
  },
  "complex_variable": {
    scalar: "scalar",
    one: {
      two: {
        three: "three",
        four: "four",
      },
      five: {
        four: "four",
      },
      six: "six",
    },
    foo: {
      bar: "bar",
      arr: [{
        prop: [{
          prop2: "prop2",
        }],
      }],
    },
    xyz: [[
      {
        one: "one",
        two: "two",
      },
    ]],
    lalala: "lalala",
    la2: "la2",
  },
};

describe("createDummyContext", function() {
  for (var templateName in testMap) {
    it(templateName, createIt(templateName, testMap[templateName]));
  }
  
  function createIt(templateName, expected) {
    return function() {
      var template = swig.compileFile(templateName + ".html");
      assert.deepEqual(createDummyContext(template), expected);
    };
  }
});

describe("swig-email-templates", function() {
  var render, dummyContext;
  before(function(cb) {
    var options = {
      root: path.join(__dirname, "templates"),
    };
    emailTemplates(options, function(err, renderFn, dummyContextFn) {
      if (err) {
        cb(err);
      } else {
        render = renderFn;
        dummyContext = dummyContextFn;
        cb();
      }
    });
  });

  for (var templateName in testMap) {
    it(templateName, createIt(templateName));
  }
  
  function createIt(templateName) {
    return function(cb) {
      var batch = new Batch();
      batch.push(function(cb) {
        dummyContext(templateName, function(err, context) {
          if (err) return cb(err);
          render(templateName, context, cb);
        });
      });
      batch.push(function(cb) {
        var filename = path.join(__dirname, "templates", templateName + ".out.html");
        fs.readFile(filename, 'utf8', cb);
      });
      batch.end(function(err, results) {
        if (err) return cb(err);
        assert.strictEqual(results[0], results[1].trim());
        cb();
      });
    };
  }
});


function emailTemplates(options, cb) {
  options = extend({
    root: path.join(__dirname, "templates"),
    allowErrors: true,
  }, options || {});
  swig.init(options);

  cb(null, render, dummyContext);

  function dummyContext(templateName, cb) {
    // compile file into swig template
    compileTemplate(templateName, function(err, template) {
      if (err) return cb(err);
      // return the tokens
      cb(null, createDummyContext(template));
    });
  }
    
  function render(templateName, context, cb) {
    // compile file into swig template
    compileTemplate(templateName, function(err, template) {
      if (err) return cb(err);
      // render template with context
      renderTemplate(template, context, function(err, html) {
        if (err) return cb(err);
        // validate html and inline all css
        boostContent(html, path.join(options.root, templateName), function(err, html) {
          if (err) return cb(err);
          cb(null, html);
        });
      });
    });
  }
}

function compileTemplate(name, cb) {
  try {
    cb(null, swig.compileFile(name + ".html"));
  } catch (err) {
    cb(err);
  }
}

function renderTemplate(template, context, cb) {
  try {
    cb(null, template.render(context));
  } catch (err) {
    cb(err);
  }
}

var owns = {}.hasOwnProperty;
function extend(obj, src) {
  for (var key in src) if (owns.call(src, key)) obj[key] = src[key];
  return obj;
}
