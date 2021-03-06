"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
  return typeof e
} : function(e) {
  return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
};
//! annyang
//! version : 2.6.1
//! author  : Tal Ater @TalAter
//! license : MIT
//! https://www.TalAter.com/annyang/
! function(e, n) {
  "function" == typeof define && define.amd ? define([], function() {
    return e.annyang = n(e)
  }) : "object" === ("undefined" == typeof module ? "undefined" : _typeof(module)) && module.exports ? module.exports = n(e) : e.annyang = n(e)
}("undefined" != typeof window ? window : void 0, function(r, i) {
  var o, a = r.SpeechRecognition || r.webkitSpeechRecognition || r.mozSpeechRecognition || r.msSpeechRecognition || r.oSpeechRecognition;
  if (!a) return null;

  function s(e) {
    for (var n = arguments.length, t = Array(1 < n ? n - 1 : 0), o = 1; o < n; o++) t[o - 1] = arguments[o];
    e.forEach(function(e) {
      e.callback.apply(e.context, t)
    })
  }

  function e() {
    return d !== i
  }

  function u(e, n) {
    -1 !== e.indexOf("%c") || n ? console.log(e, n || v) : console.log(e)
  }

  function c() {
    e() || o.init({}, !1)
  }

  function f(e, n, t) {
    g.push({
      command: e,
      callback: n,
      originalPhrase: t
    }), b && u("Command successfully loaded: %c" + t, v)
  }

  function l(e) {
    var n;
    s(m.result, e);
    for (var t = 0; t < e.length; t++) {
      n = e[t].trim(), b && u("Speech recognized: %c" + n, v);
      for (var o = 0, r = g.length; o < r; o++) {
        var i = g[o],
          a = i.command.exec(n);
        if (a) {
          var c = a.slice(1);
          return b && (u("command matched: %c" + i.originalPhrase, v), c.length && u("with parameters", c)), i.callback.apply(this, c), void s(m.resultMatch, n, i.originalPhrase, e)
        }
      }
    }
    s(m.resultNoMatch, e)
  }
  var d, p, g = [],
    m = {
      start: [],
      error: [],
      end: [],
      soundstart: [],
      result: [],
      resultMatch: [],
      resultNoMatch: [],
      errorNetwork: [],
      errorPermissionBlocked: [],
      errorPermissionDenied: []
    },
    h = 0,
    y = 0,
    b = !1,
    v = "font-weight: bold; color: #00f;",
    w = !1,
    S = !1,
    k = /\s*\((.*?)\)\s*/g,
    x = /(\(\?:[^)]+\))\?/g,
    R = /(\(\?)?:\w+/g,
    P = /\*\w+/g,
    C = /[-{}[\]+?.,\\^$|#]/g;
  return o = {
    addCommands: function(e) {
      var n, t;
      for (var o in c(), e)
        if (e.hasOwnProperty(o))
          if ("function" == typeof(n = r[e[o]] || e[o])) f((t = (t = o).replace(C, "\\$&").replace(k, "(?:$1)?").replace(R, function(e, n) {
            return n ? e : "([^\\s]+)"
          }).replace(P, "(.*?)").replace(x, "\\s*$1?\\s*"), new RegExp("^" + t + "$", "i")), n, o);
          else {
            if (!("object" === (void 0 === n ? "undefined" : _typeof(n)) && n.regexp instanceof RegExp)) {
              b && u("Can not register command: %c" + o, v);
              continue
            }
            f(new RegExp(n.regexp.source, "i"), n.callback, o)
          }
    },
    start: function(e) {
      c(), w = (e = e || {}).paused !== i && !!e.paused, p = e.autoRestart === i || !!e.autoRestart, e.continuous !== i && (d.continuous = !!e.continuous), h = (new Date).getTime();
      try {
        d.start()
      } catch (e) {
        b && u(e.message)
      }
    },
    abort: function() {
      p = !1, y = 0, e() && d.abort()
    },
    pause: function() {
      w = !0
    },
    resume: function() {
      o.start()
    },
    debug: function(e) {
      b = !!(!(0 < arguments.length && e !== i) || e)
    },
    setLanguage: function(e) {
      c(), d.lang = e
    },
    removeCommands: function(t) {
      g = t === i ? [] : (t = Array.isArray(t) ? t : [t], g.filter(function(e) {
        for (var n = 0; n < t.length; n++)
          if (t[n] === e.originalPhrase) return !1;
        return !0
      }))
    },
    addCallback: function(e, n, t) {
      var o = r[n] || n;
      "function" == typeof o && m[e] !== i && m[e].push({
        callback: o,
        context: t || this
      })
    },
    removeCallback: function(e, n) {
      function t(e) {
        return e.callback !== n
      }
      for (var o in m) m.hasOwnProperty(o) && (e !== i && e !== o || (m[o] = n === i ? [] : m[o].filter(t)))
    },
    isListening: function() {
      return S && !w
    },
    getSpeechRecognizer: function() {
      return d
    },
    trigger: function(e) {
      o.isListening() ? (Array.isArray(e) || (e = [e]), l(e)) : b && u(S ? "Speech heard, but annyang is paused" : "Cannot trigger while annyang is aborted")
    },
    init: function(e, n) {
      var t = !(1 < arguments.length && n !== i) || n;
      d && d.abort && d.abort(), (d = new a).maxAlternatives = 5, d.continuous = "http:" === r.location.protocol, d.lang = "en-US", d.onstart = function() {
        S = !0, s(m.start)
      }, d.onsoundstart = function() {
        s(m.soundstart)
      }, d.onerror = function(e) {
        switch (s(m.error, e), e.error) {
          case "network":
            s(m.errorNetwork, e);
            break;
          case "not-allowed":
          case "service-not-allowed":
            p = !1, (new Date).getTime() - h < 200 ? s(m.errorPermissionBlocked, e) : s(m.errorPermissionDenied, e)
        }
      }, d.onend = function() {
        if (S = !1, s(m.end), p) {
          var e = (new Date).getTime() - h;
          (y += 1) % 10 == 0 && b && u("Speech Recognition is repeatedly stopping and starting. See http://is.gd/annyang_restarts for tips."), e < 1e3 ? setTimeout(function() {
            o.start({
              paused: w
            })
          }, 1e3 - e) : o.start({
            paused: w
          })
        }
      }, d.onresult = function(e) {
        if (w) return b && u("Speech heard, but annyang is paused"), !1;
        for (var n = e.results[e.resultIndex], t = [], o = 0; o < n.length; o++) t[o] = n[o].transcript;
        l(t)
      }, t && (g = []), e.length && this.addCommands(e)
    }
  }
});
