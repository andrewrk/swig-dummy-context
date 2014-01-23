var createDummyContext = require('../');
var swig = require('swig');
var assert = require('assert');
var path = require('path');
var fs = require('fs');

var templatesDir = path.join(__dirname, 'templates');

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
      var templatePath = path.join(templatesDir, templateName + ".html");
      var template = swig.compileFile(templatePath);
      assert.deepEqual(createDummyContext(template), expected);
    };
  }
});
