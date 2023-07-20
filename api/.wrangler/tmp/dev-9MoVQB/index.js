var qn = Object.defineProperty;
var Xn = (t, e) => {
  for (var r in e) qn(t, r, { get: e[r], enumerable: !0 });
};
var Cr = new Set();
function Yn(t, e) {
  let r =
    t instanceof URL
      ? t
      : new URL((typeof t == "string" ? new Request(t, e) : t).url);
  r.port &&
    r.port !== "443" &&
    r.protocol === "https:" &&
    (Cr.has(r.toString()) ||
      (Cr.add(r.toString()),
      console.warn(`WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${r.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`)));
}
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(t, e, r) {
    let [n, s] = r;
    return Yn(n, s), Reflect.apply(t, e, r);
  },
});
var Tr = [];
function Hr(...t) {
  Tr.push(...t.flat());
}
function Rr(t, e, r, n, s) {
  let [a, ...i] = s;
  return a(t, e, r, {
    dispatch: n,
    next(d, c) {
      return Rr(d, c, r, n, i);
    },
  });
}
function Pr(t, e, r, n, s) {
  return Rr(t, e, r, n, [...Tr, s]);
}
var kr = (t) => {
    let e = t.split("/");
    return e[0] === "" && e.shift(), e;
  },
  Kr = (t) => {
    let e = [];
    for (let n = 0; ; ) {
      let s = !1;
      if (
        ((t = t.replace(/\{[^}]+\}/g, (a) => {
          let i = `@\\${n}`;
          return (e[n] = [i, a]), n++, (s = !0), i;
        })),
        !s)
      )
        break;
    }
    let r = t.split("/");
    r[0] === "" && r.shift();
    for (let n = e.length - 1; n >= 0; n--) {
      let [s] = e[n];
      for (let a = r.length - 1; a >= 0; a--)
        if (r[a].indexOf(s) !== -1) {
          r[a] = r[a].replace(s, e[n][1]);
          break;
        }
    }
    return r;
  },
  Et = {},
  qt = (t) => {
    if (t === "*") return "*";
    let e = t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    return e
      ? (Et[t] ||
          (e[2]
            ? (Et[t] = [t, e[1], new RegExp("^" + e[2] + "$")])
            : (Et[t] = [t, e[1], !0])),
        Et[t])
      : null;
  },
  Xt = (t) => {
    let e = t.url.match(/^https?:\/\/[^/]+(\/[^?]*)/);
    return e ? e[1] : "";
  },
  Ir = (t) => {
    let e = t.indexOf("?", 8);
    return e === -1 ? "" : "?" + t.slice(e + 1);
  },
  Or = (t) => {
    let e = Xt(t);
    return e.length > 1 && e[e.length - 1] === "/" ? e.slice(0, -1) : e;
  },
  We = (...t) => {
    let e = "",
      r = !1;
    for (let n of t)
      e[e.length - 1] === "/" && ((e = e.slice(0, -1)), (r = !0)),
        n[0] !== "/" && (n = `/${n}`),
        n === "/" && r ? (e = `${e}/`) : n !== "/" && (e = `${e}${n}`),
        n === "/" && e === "" && (e = "/");
    return e;
  },
  bt = (t) => {
    let e = t.match(/^(.+|)(\/\:[^\/]+)\?$/);
    if (!e) return null;
    let r = e[1],
      n = r + e[2];
    return [r === "" ? "/" : r.replace(/\/$/, ""), n];
  },
  Zt = (t) =>
    /[%+]/.test(t)
      ? (t.indexOf("+") !== -1 && (t = t.replace(/\+/g, " ")),
        /%/.test(t) ? De(t) : t)
      : t,
  Wr = (t, e, r) => {
    let n;
    if (!r && e && !/[%+]/.test(e)) {
      let i = t.indexOf(`?${e}`, 8);
      for (i === -1 && (i = t.indexOf(`&${e}`, 8)); i !== -1; ) {
        let o = t.charCodeAt(i + e.length + 1);
        if (o === 61) {
          let d = i + e.length + 2,
            c = t.indexOf("&", d);
          return Zt(t.slice(d, c === -1 ? void 0 : c));
        } else if (o == 38 || isNaN(o)) return "";
        i = t.indexOf(`&${e}`, i + 1);
      }
      if (((n = /[%+]/.test(t)), !n)) return;
    }
    let s = {};
    n ?? (n = /[%+]/.test(t));
    let a = t.indexOf("?", 8);
    for (; a !== -1; ) {
      let i = t.indexOf("&", a + 1),
        o = t.indexOf("=", a);
      o > i && i !== -1 && (o = -1);
      let d = t.slice(a + 1, o === -1 ? (i === -1 ? void 0 : i) : o);
      if ((n && (d = Zt(d)), (a = i), d === "")) continue;
      let c;
      o === -1
        ? (c = "")
        : ((c = t.slice(o + 1, i === -1 ? void 0 : i)), n && (c = Zt(c))),
        r ? (s[d] ?? (s[d] = [])).push(c) : s[d] ?? (s[d] = c);
    }
    return e ? s[e] : s;
  },
  Dr = Wr,
  Jr = (t, e) => Wr(t, e, !0),
  De = decodeURIComponent;
var Qn = /^[\w!#$%&'*.^`|~+-]+$/,
  es = /^[ !#-:<-[\]-~]*$/,
  Nr = (t, e) =>
    t
      .trim()
      .split(";")
      .reduce((n, s) => {
        s = s.trim();
        let a = s.indexOf("=");
        if (a === -1) return n;
        let i = s.substring(0, a).trim();
        if ((e && e !== i) || !Qn.test(i)) return n;
        let o = s.substring(a + 1).trim();
        return (
          o.startsWith('"') && o.endsWith('"') && (o = o.slice(1, -1)),
          es.test(o) && (n[i] = De(o)),
          n
        );
      }, {});
var ts = (t, e, r = {}) => {
    let n = `${t}=${e}`;
    return (
      r &&
        typeof r.maxAge == "number" &&
        r.maxAge >= 0 &&
        (n += `; Max-Age=${Math.floor(r.maxAge)}`),
      r.domain && (n += `; Domain=${r.domain}`),
      r.path && (n += `; Path=${r.path}`),
      r.expires && (n += `; Expires=${r.expires.toUTCString()}`),
      r.httpOnly && (n += "; HttpOnly"),
      r.secure && (n += "; Secure"),
      r.sameSite && (n += `; SameSite=${r.sameSite}`),
      r.partitioned && (n += "; Partitioned"),
      n
    );
  },
  Mr = (t, e, r = {}) => ((e = encodeURIComponent(e)), ts(t, e, r));
var Ur = class {
  constructor(t) {
    (this.writable = t),
      (this.writer = t.getWriter()),
      (this.encoder = new TextEncoder());
  }
  async write(t) {
    try {
      typeof t == "string" && (t = this.encoder.encode(t)),
        await this.writer.write(t);
    } catch {}
    return this;
  }
  async writeln(t) {
    return (
      await this.write(
        t +
          `
`
      ),
      this
    );
  }
  sleep(t) {
    return new Promise((e) => setTimeout(e, t));
  }
  async close() {
    try {
      await this.writer.close();
    } catch {}
  }
  async pipe(t) {
    this.writer.releaseLock(),
      await t.pipeTo(this.writable, { preventClose: !0 }),
      (this.writer = this.writable.getWriter());
  }
};
var $r = "text/plain; charset=UTF-8",
  Je = class {
    constructor(t, e) {
      (this.env = {}),
        (this._var = {}),
        (this.finalized = !1),
        (this.error = void 0),
        (this._status = 200),
        (this._h = void 0),
        (this._pH = void 0),
        (this._init = !0),
        (this._renderer = (r) => this.html(r)),
        (this.notFoundHandler = () => new Response()),
        (this.render = (...r) => this._renderer(...r)),
        (this.setRenderer = (r) => {
          this._renderer = r;
        }),
        (this.header = (r, n, s) => {
          if (n === void 0) {
            this._h
              ? this._h.delete(r)
              : this._pH && delete this._pH[r.toLocaleLowerCase()],
              this.finalized && this.res.headers.delete(r);
            return;
          }
          s?.append
            ? (this._h ||
                ((this._init = !1),
                (this._h = new Headers(this._pH)),
                (this._pH = {})),
              this._h.append(r, n))
            : this._h
              ? this._h.set(r, n)
              : (this._pH ?? (this._pH = {}), (this._pH[r.toLowerCase()] = n)),
            this.finalized &&
              (s?.append
                ? this.res.headers.append(r, n)
                : this.res.headers.set(r, n));
        }),
        (this.status = (r) => {
          (this._init = !1), (this._status = r);
        }),
        (this.set = (r, n) => {
          this._var ?? (this._var = {}), (this._var[r] = n);
        }),
        (this.get = (r) => (this._var ? this._var[r] : void 0)),
        (this.newResponse = (r, n, s) => {
          if (this._init && !s && !n && this._status === 200)
            return new Response(r, { headers: this._pH });
          if (n && typeof n != "number") {
            let i = new Response(r, n),
              o = this._pH?.["content-type"];
            return o && i.headers.set("content-type", o), i;
          }
          let a = n ?? this._status;
          this._pH ?? (this._pH = {}), this._h ?? (this._h = new Headers());
          for (let [i, o] of Object.entries(this._pH)) this._h.set(i, o);
          if (this._res) {
            this._res.headers.forEach((i, o) => {
              this._h?.set(o, i);
            });
            for (let [i, o] of Object.entries(this._pH)) this._h.set(i, o);
          }
          s ?? (s = {});
          for (let [i, o] of Object.entries(s))
            if (typeof o == "string") this._h.set(i, o);
            else {
              this._h.delete(i);
              for (let d of o) this._h.append(i, d);
            }
          return new Response(r, { status: a, headers: this._h });
        }),
        (this.body = (r, n, s) =>
          typeof n == "number"
            ? this.newResponse(r, n, s)
            : this.newResponse(r, n)),
        (this.text = (r, n, s) => {
          if (!this._pH) {
            if (this._init && !s && !n) return new Response(r);
            this._pH = {};
          }
          return (
            (this._pH["content-type"] = $r),
            typeof n == "number"
              ? this.newResponse(r, n, s)
              : this.newResponse(r, n)
          );
        }),
        (this.json = (r, n, s) => {
          let a = JSON.stringify(r);
          return (
            this._pH ?? (this._pH = {}),
            (this._pH["content-type"] = "application/json; charset=UTF-8"),
            typeof n == "number"
              ? this.newResponse(a, n, s)
              : this.newResponse(a, n)
          );
        }),
        (this.jsonT = (r, n, s) => {
          let a = typeof n == "number" ? this.json(r, n, s) : this.json(r, n);
          return { response: a, data: r, format: "json", status: a.status };
        }),
        (this.html = (r, n, s) => (
          this._pH ?? (this._pH = {}),
          (this._pH["content-type"] = "text/html; charset=UTF-8"),
          typeof r == "object" &&
          (r instanceof Promise || (r = r.toString()), r instanceof Promise)
            ? r.then((a) =>
                typeof n == "number"
                  ? this.newResponse(a, n, s)
                  : this.newResponse(a, n)
              )
            : typeof n == "number"
              ? this.newResponse(r, n, s)
              : this.newResponse(r, n)
        )),
        (this.redirect = (r, n = 302) => (
          this._h ?? (this._h = new Headers()),
          this._h.set("Location", r),
          this.newResponse(null, n)
        )),
        (this.streamText = (r, n, s) => (
          s ?? (s = {}),
          this.header("content-type", $r),
          this.header("x-content-type-options", "nosniff"),
          this.header("transfer-encoding", "chunked"),
          this.stream(r, n, s)
        )),
        (this.stream = (r, n, s) => {
          let { readable: a, writable: i } = new TransformStream(),
            o = new Ur(i);
          return (
            r(o).finally(() => o.close()),
            typeof n == "number"
              ? this.newResponse(a, n, s)
              : this.newResponse(a, n)
          );
        }),
        (this.cookie = (r, n, s) => {
          let a = Mr(r, n, s);
          this.header("set-cookie", a, { append: !0 });
        }),
        (this.notFound = () => this.notFoundHandler(this)),
        (this.req = t),
        e &&
          ((this._exCtx = e.executionCtx),
          (this.env = e.env),
          e.notFoundHandler && (this.notFoundHandler = e.notFoundHandler));
    }
    get event() {
      if (this._exCtx && "respondWith" in this._exCtx) return this._exCtx;
      throw Error("This context has no FetchEvent");
    }
    get executionCtx() {
      if (this._exCtx) return this._exCtx;
      throw Error("This context has no ExecutionContext");
    }
    get res() {
      return (
        (this._init = !1),
        this._res ||
          (this._res = new Response("404 Not Found", { status: 404 }))
      );
    }
    set res(t) {
      (this._init = !1),
        this._res &&
          t &&
          (this._res.headers.delete("content-type"),
          this._res.headers.forEach((e, r) => {
            t.headers.set(r, e);
          })),
        (this._res = t),
        (this.finalized = !0);
    }
    get var() {
      return { ...this._var };
    }
    get runtime() {
      let t = globalThis;
      return t?.Deno !== void 0
        ? "deno"
        : t?.Bun !== void 0
          ? "bun"
          : typeof t?.WebSocketPair == "function"
            ? "workerd"
            : typeof t?.EdgeRuntime == "string"
              ? "edge-light"
              : t?.fastly !== void 0
                ? "fastly"
                : t?.__lagon__ !== void 0
                  ? "lagon"
                  : t?.process?.release?.name === "node"
                    ? "node"
                    : "other";
    }
  };
var Yt = (t, e, r) => (n, s) => {
  let a = -1;
  return i(0);
  async function i(o) {
    if (o <= a) throw new Error("next() called multiple times");
    a = o;
    let d,
      c = !1,
      u;
    if (
      (t[o]
        ? ((u = t[o][0]), n instanceof Je && n.req.setParams(t[o][1]))
        : (u = (o === t.length && s) || void 0),
      !u)
    )
      n instanceof Je && n.finalized === !1 && r && (d = await r(n));
    else
      try {
        d = await u(n, () => i(o + 1));
      } catch (m) {
        if (m instanceof Error && n instanceof Je && e)
          (n.error = m), (d = await e(m, n)), (c = !0);
        else throw m;
      }
    return (
      d !== void 0 && "response" in d && (d = d.response),
      d && (n.finalized === !1 || c) && (n.res = d),
      n
    );
  }
};
var Lr = class extends Error {
  constructor(t = 500, e) {
    super(e?.message), (this.res = e?.res), (this.status = t);
  }
  getResponse() {
    return this.res
      ? this.res
      : new Response(this.message, { status: this.status });
  }
};
var rs = (t) => Array.isArray(t),
  Br = async (t, e = { all: !1 }) => {
    let r = {},
      n = t.headers.get("Content-Type");
    if (
      n &&
      (n.startsWith("multipart/form-data") ||
        n.startsWith("application/x-www-form-urlencoded"))
    ) {
      let s = await t.formData();
      if (s) {
        let a = {};
        s.forEach((i, o) => {
          if (!(e.all || o.slice(-2) === "[]")) {
            a[o] = i;
            return;
          }
          if (a[o] && rs(a[o])) {
            a[o].push(i);
            return;
          }
          if (a[o]) {
            a[o] = [a[o], i];
            return;
          }
          a[o] = i;
        }),
          (r = a);
      }
    }
    return r;
  };
var Vr = class {
  constructor(t, e = "/", r = void 0) {
    (this._p = {}),
      (this.bodyCache = {}),
      (this.cachedBody = (n) => {
        let { bodyCache: s, raw: a } = this,
          i = s[n];
        return (
          i ||
          (s.arrayBuffer
            ? (async () => await new Response(s.arrayBuffer)[n]())()
            : (s[n] = a[n]()))
        );
      }),
      (this.raw = t),
      (this.path = e),
      (this._s = r),
      (this.vData = {});
  }
  setParams(t) {
    this._p = t;
  }
  param(t) {
    if (t) {
      let e = this._s ? this._s[this._p[t]] : this._p[t];
      return e ? (/\%/.test(e) ? De(e) : e) : void 0;
    } else {
      let e = {},
        r = Object.keys(this._p);
      for (let n = 0, s = r.length; n < s; n++) {
        let a = r[n],
          i = this._s ? this._s[this._p[a]] : this._p[a];
        i && typeof i == "string" && (e[a] = /\%/.test(i) ? De(i) : i);
      }
      return e;
    }
  }
  query(t) {
    return Dr(this.url, t);
  }
  queries(t) {
    return Jr(this.url, t);
  }
  header(t) {
    if (t) return this.raw.headers.get(t.toLowerCase()) ?? void 0;
    let e = {};
    return (
      this.raw.headers.forEach((r, n) => {
        e[n] = r;
      }),
      e
    );
  }
  cookie(t) {
    let e = this.raw.headers.get("Cookie");
    if (!e) return;
    let r = Nr(e);
    return t ? r[t] : r;
  }
  async parseBody(t) {
    if (this.bodyCache.parsedBody) return this.bodyCache.parsedBody;
    let e = await Br(this, t);
    return (this.bodyCache.parsedBody = e), e;
  }
  json() {
    return this.cachedBody("json");
  }
  text() {
    return this.cachedBody("text");
  }
  arrayBuffer() {
    return this.cachedBody("arrayBuffer");
  }
  blob() {
    return this.cachedBody("blob");
  }
  formData() {
    return this.cachedBody("formData");
  }
  addValidatedData(t, e) {
    this.vData[t] = e;
  }
  valid(t) {
    return this.vData[t];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get headers() {
    return this.raw.headers;
  }
  get body() {
    return this.raw.body;
  }
  get bodyUsed() {
    return this.raw.bodyUsed;
  }
  get integrity() {
    return this.raw.integrity;
  }
  get keepalive() {
    return this.raw.keepalive;
  }
  get referrer() {
    return this.raw.referrer;
  }
  get signal() {
    return this.raw.signal;
  }
};
var P = "ALL",
  zr = "all",
  St = ["get", "post", "put", "delete", "options", "patch"],
  At = class extends Error {};
function ns() {
  return class {};
}
var ss = (t) => t.text("404 Not Found", 404),
  jr = (t, e) => {
    if (t instanceof Lr) return t.getResponse();
    console.error(t);
    let r = "Internal Server Error";
    return e.text(r, 500);
  },
  Qt = class extends ns() {
    constructor(t = {}) {
      super(),
        (this._basePath = "/"),
        (this.path = "/"),
        (this.routes = []),
        (this.notFoundHandler = ss),
        (this.errorHandler = jr),
        (this.head = () => (
          console.warn(
            "`app.head()` is no longer used. `app.get()` implicitly handles the HEAD method."
          ),
          this
        )),
        (this.handleEvent = (n) =>
          this.dispatch(n.request, n, void 0, n.request.method)),
        (this.fetch = (n, s, a) => this.dispatch(n, a, s, n.method)),
        (this.request = (n, s, a, i) => {
          if (n instanceof Request)
            return s !== void 0 && (n = new Request(n, s)), this.fetch(n, a, i);
          n = n.toString();
          let o = /^https?:\/\//.test(n) ? n : `http://localhost${We("/", n)}`,
            d = new Request(o, s);
          return this.fetch(d, a, i);
        }),
        (this.fire = () => {
          addEventListener("fetch", (n) => {
            n.respondWith(
              this.dispatch(n.request, n, void 0, n.request.method)
            );
          });
        }),
        [...St, zr].map((n) => {
          this[n] = (s, ...a) => (
            typeof s == "string"
              ? (this.path = s)
              : this.addRoute(n, this.path, s),
            a.map((i) => {
              typeof i != "string" && this.addRoute(n, this.path, i);
            }),
            this
          );
        }),
        (this.on = (n, s, ...a) => {
          if (!n) return this;
          this.path = s;
          for (let i of [n].flat())
            a.map((o) => {
              this.addRoute(i.toUpperCase(), this.path, o);
            });
          return this;
        }),
        (this.use = (n, ...s) => (
          typeof n == "string" ? (this.path = n) : s.unshift(n),
          s.map((a) => {
            this.addRoute(P, this.path, a);
          }),
          this
        ));
      let r = t.strict ?? !0;
      delete t.strict,
        Object.assign(this, t),
        (this.getPath = r ? t.getPath ?? Xt : Or);
    }
    clone() {
      let t = new Qt({ router: this.router, getPath: this.getPath });
      return (t.routes = this.routes), t;
    }
    route(t, e) {
      let r = this.basePath(t);
      return e
        ? (e.routes.map((n) => {
            let s =
              e.errorHandler === jr
                ? n.handler
                : async (a, i) =>
                    (await Yt([], e.errorHandler)(a, () => n.handler(a, i)))
                      .res;
            r.addRoute(n.method, n.path, s);
          }),
          this)
        : r;
    }
    basePath(t) {
      let e = this.clone();
      return (e._basePath = We(this._basePath, t)), e;
    }
    onError(t) {
      return (this.errorHandler = t), this;
    }
    notFound(t) {
      return (this.notFoundHandler = t), this;
    }
    showRoutes() {
      this.routes.map((e) => {
        console.log(
          `\x1B[32m${e.method}\x1B[0m ${" ".repeat(8 - e.method.length)} ${
            e.path
          }`
        );
      });
    }
    mount(t, e, r) {
      let n = We(this._basePath, t),
        s = n === "/" ? 0 : n.length,
        a = async (i, o) => {
          let d;
          try {
            d = i.executionCtx;
          } catch {}
          let c = r ? r(i) : [i.env, d],
            u = Array.isArray(c) ? c : [c],
            m = Ir(i.req.url),
            b = await e(
              new Request(
                new URL((i.req.path.slice(s) || "/") + m, i.req.url),
                i.req.raw
              ),
              ...u
            );
          if (b) return b;
          await o();
        };
      return this.addRoute(P, We(t, "*"), a), this;
    }
    get routerName() {
      return this.matchRoute("GET", "/"), this.router.name;
    }
    addRoute(t, e, r) {
      (t = t.toUpperCase()),
        (e = We(this._basePath, e)),
        this.router.add(t, e, r);
      let n = { path: e, method: t, handler: r };
      this.routes.push(n);
    }
    matchRoute(t, e) {
      return this.router.match(t, e);
    }
    handleError(t, e) {
      if (t instanceof Error) return this.errorHandler(t, e);
      throw t;
    }
    dispatch(t, e, r, n) {
      if (n === "HEAD")
        return (async () =>
          new Response(null, await this.dispatch(t, e, r, "GET")))();
      let s = this.getPath(t, { env: r }),
        [a, i] = this.matchRoute(n, s),
        o = new Je(new Vr(t, s, i), {
          env: r,
          executionCtx: e,
          notFoundHandler: this.notFoundHandler,
        });
      if (a.length === 1) {
        let c;
        o.req.setParams(a[0][1]);
        try {
          if (((c = a[0][0](o, async () => {})), !c))
            return this.notFoundHandler(o);
        } catch (u) {
          return this.handleError(u, o);
        }
        return c instanceof Response ||
          ("response" in c && (c = c.response), c instanceof Response)
          ? c
          : (async () => {
              let u;
              try {
                if (
                  ((u = await c),
                  u !== void 0 && "response" in u && (u = u.response),
                  !u)
                )
                  return this.notFoundHandler(o);
              } catch (m) {
                return this.handleError(m, o);
              }
              return u;
            })();
      }
      let d = Yt(a, this.errorHandler, this.notFoundHandler);
      return (async () => {
        try {
          let c = await d(o);
          if (!c.finalized)
            throw new Error(
              "Context is not finalized. You may forget returning Response object or `await next()`"
            );
          return c.res;
        } catch (c) {
          return this.handleError(c, o);
        }
      })();
    }
  };
var Ct = "[^/]+",
  it = ".*",
  ot = "(?:|/.*)",
  Ne = Symbol();
function as(t, e) {
  return t.length === 1
    ? e.length === 1
      ? t < e
        ? -1
        : 1
      : -1
    : e.length === 1 || t === it || t === ot
      ? 1
      : e === it || e === ot
        ? -1
        : t === Ct
          ? 1
          : e === Ct
            ? -1
            : t.length === e.length
              ? t < e
                ? -1
                : 1
              : e.length - t.length;
}
var Tt = class {
  constructor() {
    this.children = {};
  }
  insert(t, e, r, n, s) {
    if (t.length === 0) {
      if (this.index !== void 0) throw Ne;
      if (s) return;
      this.index = e;
      return;
    }
    let [a, ...i] = t,
      o =
        a === "*"
          ? i.length === 0
            ? ["", "", it]
            : ["", "", Ct]
          : a === "/*"
            ? ["", "", ot]
            : a.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),
      d;
    if (o) {
      let c = o[1],
        u = o[2] || Ct;
      if (
        c &&
        o[2] &&
        ((u = u.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:")), /\((?!\?:)/.test(u))
      )
        throw Ne;
      if (((d = this.children[u]), !d)) {
        if (Object.keys(this.children).some((m) => m !== it && m !== ot))
          throw Ne;
        if (s) return;
        (d = this.children[u] = new Tt()),
          c !== "" && (d.varIndex = n.varIndex++);
      }
      !s && c !== "" && r.push([c, d.varIndex]);
    } else if (((d = this.children[a]), !d)) {
      if (
        Object.keys(this.children).some(
          (c) => c.length > 1 && c !== it && c !== ot
        )
      )
        throw Ne;
      if (s) return;
      d = this.children[a] = new Tt();
    }
    d.insert(i, e, r, n, s);
  }
  buildRegExpStr() {
    let e = Object.keys(this.children)
      .sort(as)
      .map((r) => {
        let n = this.children[r];
        return (
          (typeof n.varIndex == "number" ? `(${r})@${n.varIndex}` : r) +
          n.buildRegExpStr()
        );
      });
    return (
      typeof this.index == "number" && e.unshift(`#${this.index}`),
      e.length === 0 ? "" : e.length === 1 ? e[0] : "(?:" + e.join("|") + ")"
    );
  }
};
var Fr = class {
  constructor() {
    (this.context = { varIndex: 0 }), (this.root = new Tt());
  }
  insert(t, e, r) {
    let n = [],
      s = [];
    for (let i = 0; ; ) {
      let o = !1;
      if (
        ((t = t.replace(/\{[^}]+\}/g, (d) => {
          let c = `@\\${i}`;
          return (s[i] = [c, d]), i++, (o = !0), c;
        })),
        !o)
      )
        break;
    }
    let a = t.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = s.length - 1; i >= 0; i--) {
      let [o] = s[i];
      for (let d = a.length - 1; d >= 0; d--)
        if (a[d].indexOf(o) !== -1) {
          a[d] = a[d].replace(o, s[i][1]);
          break;
        }
    }
    return this.root.insert(a, e, n, this.context, r), n;
  }
  buildRegExp() {
    let t = this.root.buildRegExpStr();
    if (t === "") return [/^$/, [], []];
    let e = 0,
      r = [],
      n = [];
    return (
      (t = t.replace(/#(\d+)|@(\d+)|\.\*\$/g, (s, a, i) =>
        typeof a < "u"
          ? ((r[++e] = Number(a)), "$()")
          : (typeof i < "u" && (n[Number(i)] = ++e), "")
      )),
      [new RegExp(`^${t}`), r, n]
    );
  }
};
var er = [P, ...St].map((t) => t.toUpperCase()),
  Gr = [],
  is = [/^$/, [], {}],
  tr = {};
function Zr(t) {
  return (
    tr[t] ??
    (tr[t] = new RegExp(t === "*" ? "" : `^${t.replace(/\/\*/, "(?:|/.*)")}$`))
  );
}
function os() {
  tr = {};
}
function cs(t) {
  let e = new Fr(),
    r = [];
  if (t.length === 0) return is;
  let n = t
      .map((c) => [!/\*|\/:/.test(c[0]), ...c])
      .sort(([c, u], [m, b]) => (c ? 1 : m ? -1 : u.length - b.length)),
    s = {};
  for (let c = 0, u = -1, m = n.length; c < m; c++) {
    let [b, S, T] = n[c];
    b ? (s[S] = [T.map(([N]) => [N, {}]), Gr]) : u++;
    let H;
    try {
      H = e.insert(S, u, b);
    } catch (N) {
      throw N === Ne ? new At(S) : N;
    }
    b ||
      (r[u] = T.map(([N, Q]) => {
        let pe = {};
        for (Q -= 1; Q >= 0; Q--) {
          let [ee, $] = H[Q];
          pe[ee] = $;
        }
        return [N, pe];
      }));
  }
  let [a, i, o] = e.buildRegExp();
  for (let c = 0, u = r.length; c < u; c++)
    for (let m = 0, b = r[c].length; m < b; m++) {
      let S = r[c][m]?.[1];
      if (!S) continue;
      let T = Object.keys(S);
      for (let H = 0, N = T.length; H < N; H++) S[T[H]] = o[S[T[H]]];
    }
  let d = [];
  for (let c in i) d[c] = r[i[c]];
  return [a, d, s];
}
function Me(t, e) {
  if (t) {
    for (let r of Object.keys(t).sort((n, s) => s.length - n.length))
      if (Zr(r).test(e)) return [...t[r]];
  }
}
var rr = class {
  constructor() {
    (this.name = "RegExpRouter"),
      (this.middleware = { [P]: {} }),
      (this.routes = { [P]: {} });
  }
  add(t, e, r) {
    var n;
    let { middleware: s, routes: a } = this;
    if (!s || !a)
      throw new Error(
        "Can not add a route since the matcher is already built."
      );
    er.indexOf(t) === -1 && er.push(t),
      s[t] ||
        [s, a].forEach((d) => {
          (d[t] = {}),
            Object.keys(d[P]).forEach((c) => {
              d[t][c] = [...d[P][c]];
            });
        }),
      e === "/*" && (e = "*");
    let i = (e.match(/\/:/g) || []).length;
    if (/\*$/.test(e)) {
      let d = Zr(e);
      t === P
        ? Object.keys(s).forEach((c) => {
            var u;
            (u = s[c])[e] || (u[e] = Me(s[c], e) || Me(s[P], e) || []);
          })
        : (n = s[t])[e] || (n[e] = Me(s[t], e) || Me(s[P], e) || []),
        Object.keys(s).forEach((c) => {
          (t === P || t === c) &&
            Object.keys(s[c]).forEach((u) => {
              d.test(u) && s[c][u].push([r, i]);
            });
        }),
        Object.keys(a).forEach((c) => {
          (t === P || t === c) &&
            Object.keys(a[c]).forEach((u) => d.test(u) && a[c][u].push([r, i]));
        });
      return;
    }
    let o = bt(e) || [e];
    for (let d = 0, c = o.length; d < c; d++) {
      let u = o[d];
      Object.keys(a).forEach((m) => {
        var b;
        (t === P || t === m) &&
          ((b = a[m])[u] || (b[u] = [...(Me(s[m], u) || Me(s[P], u) || [])]),
          a[m][u].push([r, o.length === 2 && d === 0 ? i - 1 : i]));
      });
    }
  }
  match(t, e) {
    os();
    let r = this.buildAllMatchers();
    return (
      (this.match = (n, s) => {
        let a = r[n],
          i = a[2][s];
        if (i) return i;
        let o = s.match(a[0]);
        if (!o) return [[], Gr];
        let d = o.indexOf("", 1);
        return [a[1][d], o];
      }),
      this.match(t, e)
    );
  }
  buildAllMatchers() {
    let t = {};
    return (
      er.forEach((e) => {
        t[e] = this.buildMatcher(e) || t[P];
      }),
      (this.middleware = this.routes = void 0),
      t
    );
  }
  buildMatcher(t) {
    let e = [],
      r = t === P;
    return (
      [this.middleware, this.routes].forEach((n) => {
        let s = n[t] ? Object.keys(n[t]).map((a) => [a, n[t][a]]) : [];
        s.length !== 0
          ? (r || (r = !0), e.push(...s))
          : t !== P && e.push(...Object.keys(n[P]).map((a) => [a, n[P][a]]));
      }),
      r ? cs(e) : null
    );
  }
};
var nr = class {
  constructor(t) {
    (this.name = "SmartRouter"),
      (this.routers = []),
      (this.routes = []),
      Object.assign(this, t);
  }
  add(t, e, r) {
    if (!this.routes)
      throw new Error(
        "Can not add a route since the matcher is already built."
      );
    this.routes.push([t, e, r]);
  }
  match(t, e) {
    if (!this.routes) throw new Error("Fatal error");
    let { routers: r, routes: n } = this,
      s = r.length,
      a = 0,
      i;
    for (; a < s; a++) {
      let o = r[a];
      try {
        n.forEach((d) => {
          o.add(...d);
        }),
          (i = o.match(t, e));
      } catch (d) {
        if (d instanceof At) continue;
        throw d;
      }
      (this.match = o.match.bind(o)),
        (this.routers = [o]),
        (this.routes = void 0);
      break;
    }
    if (a === s) throw new Error("Fatal error");
    return (this.name = `SmartRouter + ${this.activeRouter.name}`), i;
  }
  get activeRouter() {
    if (this.routes || this.routers.length !== 1)
      throw new Error("No active router has been determined yet.");
    return this.routers[0];
  }
};
var sr = class {
  constructor(t, e, r) {
    if (
      ((this.order = 0),
      (this.params = {}),
      (this.children = r || {}),
      (this.methods = []),
      (this.name = ""),
      t && e)
    ) {
      let n = {};
      (n[t] = {
        handler: e,
        params: {},
        possibleKeys: [],
        score: 0,
        name: this.name,
      }),
        (this.methods = [n]);
    }
    this.patterns = [];
  }
  insert(t, e, r) {
    (this.name = `${t} ${e}`), (this.order = ++this.order);
    let n = this,
      s = Kr(e),
      a = [],
      i = [];
    for (let c = 0, u = s.length; c < u; c++) {
      let m = s[c];
      if (Object.keys(n.children).includes(m)) {
        i.push(...n.patterns), (n = n.children[m]);
        let S = qt(m);
        S && a.push(S[1]);
        continue;
      }
      n.children[m] = new sr();
      let b = qt(m);
      b && (n.patterns.push(b), i.push(...n.patterns), a.push(b[1])),
        i.push(...n.patterns),
        (n = n.children[m]);
    }
    n.methods.length || (n.methods = []);
    let o = {},
      d = {
        handler: r,
        params: {},
        possibleKeys: a,
        name: this.name,
        score: this.order,
      };
    return (o[t] = d), n.methods.push(o), n;
  }
  gHSets(t, e, r) {
    let n = [];
    for (let s = 0, a = t.methods.length; s < a; s++) {
      let i = t.methods[s],
        o = i[e] || i[P];
      o !== void 0 &&
        (o.possibleKeys.map((d) => {
          o.params[d] = r[d];
        }),
        n.push(o));
    }
    return n;
  }
  search(t, e) {
    let r = [],
      n = {};
    this.params = {};
    let a = [this],
      i = kr(e);
    for (let d = 0, c = i.length; d < c; d++) {
      let u = i[d],
        m = d === c - 1,
        b = [];
      for (let S = 0, T = a.length; S < T; S++) {
        let H = a[S],
          N = H.children[u];
        N &&
          (m === !0
            ? (N.children["*"] &&
                r.push(
                  ...this.gHSets(N.children["*"], t, { ...n, ...H.params })
                ),
              r.push(...this.gHSets(N, t, { ...n, ...H.params })))
            : b.push(N));
        for (let Q = 0, pe = H.patterns.length; Q < pe; Q++) {
          let ee = H.patterns[Q];
          if (ee === "*") {
            let Gt = H.children["*"];
            Gt &&
              (r.push(...this.gHSets(Gt, t, { ...n, ...H.params })),
              b.push(Gt));
            continue;
          }
          if (u === "") continue;
          let [$, Sr, at] = ee,
            Oe = H.children[$],
            Ar = i.slice(d).join("/");
          if (at instanceof RegExp && at.test(Ar)) {
            (n[Sr] = Ar), r.push(...this.gHSets(Oe, t, { ...n, ...H.params }));
            continue;
          }
          (at === !0 || (at instanceof RegExp && at.test(u))) &&
            typeof $ == "string" &&
            ((n[Sr] = u),
            m === !0
              ? (r.push(...this.gHSets(Oe, t, { ...n, ...H.params })),
                Oe.children["*"] &&
                  r.push(
                    ...this.gHSets(Oe.children["*"], t, { ...n, ...H.params })
                  ))
              : ((Oe.params = { ...n }), b.push(Oe)));
        }
      }
      a = b;
    }
    return [
      r
        .sort((d, c) => d.score - c.score)
        .map(({ handler: d, params: c }) => [d, c]),
    ];
  }
};
var ar = class {
  constructor() {
    (this.name = "TrieRouter"), (this.node = new sr());
  }
  add(t, e, r) {
    let n = bt(e);
    if (n) {
      for (let s of n) this.node.insert(t, s, r);
      return;
    }
    this.node.insert(t, e, r);
  }
  match(t, e) {
    return this.node.search(t, e);
  }
};
var ir = class extends Qt {
  constructor(t = {}) {
    super(t),
      (this.router = t.router ?? new nr({ routers: [new rr(), new ar()] }));
  }
};
var qr = (t) => {
  let r = {
      ...{
        origin: "*",
        allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
        allowHeaders: [],
        exposeHeaders: [],
      },
      ...t,
    },
    n = ((s) =>
      typeof s == "string"
        ? () => s
        : typeof s == "function"
          ? s
          : (a) => (s.includes(a) ? a : s[0]))(r.origin);
  return async (s, a) => {
    function i(d, c) {
      s.res.headers.set(d, c);
    }
    let o = n(s.req.header("origin") || "");
    if (
      (o && i("Access-Control-Allow-Origin", o),
      r.origin !== "*" && i("Vary", "Origin"),
      r.credentials && i("Access-Control-Allow-Credentials", "true"),
      r.exposeHeaders?.length &&
        i("Access-Control-Expose-Headers", r.exposeHeaders.join(",")),
      s.req.method !== "OPTIONS")
    )
      await a();
    else {
      r.maxAge != null && i("Access-Control-Max-Age", r.maxAge.toString()),
        r.allowMethods?.length &&
          i("Access-Control-Allow-Methods", r.allowMethods.join(","));
      let d = r.allowHeaders;
      if (!d?.length) {
        let c = s.req.header("Access-Control-Request-Headers");
        c && (d = c.split(/\s*,\s*/));
      }
      return (
        d?.length &&
          (i("Access-Control-Allow-Headers", d.join(",")),
          s.res.headers.append("Vary", "Access-Control-Request-Headers")),
        s.res.headers.delete("Content-Length"),
        s.res.headers.delete("Content-Type"),
        new Response(null, {
          headers: s.res.headers,
          status: 204,
          statusText: s.res.statusText,
        })
      );
    }
  };
};
var A;
(function (t) {
  t.assertEqual = (s) => s;
  function e(s) {}
  t.assertIs = e;
  function r(s) {
    throw new Error();
  }
  (t.assertNever = r),
    (t.arrayToEnum = (s) => {
      let a = {};
      for (let i of s) a[i] = i;
      return a;
    }),
    (t.getValidEnumValues = (s) => {
      let a = t.objectKeys(s).filter((o) => typeof s[s[o]] != "number"),
        i = {};
      for (let o of a) i[o] = s[o];
      return t.objectValues(i);
    }),
    (t.objectValues = (s) =>
      t.objectKeys(s).map(function (a) {
        return s[a];
      })),
    (t.objectKeys =
      typeof Object.keys == "function"
        ? (s) => Object.keys(s)
        : (s) => {
            let a = [];
            for (let i in s)
              Object.prototype.hasOwnProperty.call(s, i) && a.push(i);
            return a;
          }),
    (t.find = (s, a) => {
      for (let i of s) if (a(i)) return i;
    }),
    (t.isInteger =
      typeof Number.isInteger == "function"
        ? (s) => Number.isInteger(s)
        : (s) => typeof s == "number" && isFinite(s) && Math.floor(s) === s);
  function n(s, a = " | ") {
    return s.map((i) => (typeof i == "string" ? `'${i}'` : i)).join(a);
  }
  (t.joinValues = n),
    (t.jsonStringifyReplacer = (s, a) =>
      typeof a == "bigint" ? a.toString() : a);
})(A || (A = {}));
var cr;
(function (t) {
  t.mergeShapes = (e, r) => ({ ...e, ...r });
})(cr || (cr = {}));
var p = A.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set",
  ]),
  he = (t) => {
    switch (typeof t) {
      case "undefined":
        return p.undefined;
      case "string":
        return p.string;
      case "number":
        return isNaN(t) ? p.nan : p.number;
      case "boolean":
        return p.boolean;
      case "function":
        return p.function;
      case "bigint":
        return p.bigint;
      case "symbol":
        return p.symbol;
      case "object":
        return Array.isArray(t)
          ? p.array
          : t === null
            ? p.null
            : t.then &&
                typeof t.then == "function" &&
                t.catch &&
                typeof t.catch == "function"
              ? p.promise
              : typeof Map < "u" && t instanceof Map
                ? p.map
                : typeof Set < "u" && t instanceof Set
                  ? p.set
                  : typeof Date < "u" && t instanceof Date
                    ? p.date
                    : p.object;
      default:
        return p.unknown;
    }
  },
  l = A.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite",
  ]),
  ds = (t) => JSON.stringify(t, null, 2).replace(/"([^"]+)":/g, "$1:"),
  G = class extends Error {
    constructor(e) {
      super(),
        (this.issues = []),
        (this.addIssue = (n) => {
          this.issues = [...this.issues, n];
        }),
        (this.addIssues = (n = []) => {
          this.issues = [...this.issues, ...n];
        });
      let r = new.target.prototype;
      Object.setPrototypeOf
        ? Object.setPrototypeOf(this, r)
        : (this.__proto__ = r),
        (this.name = "ZodError"),
        (this.issues = e);
    }
    get errors() {
      return this.issues;
    }
    format(e) {
      let r =
          e ||
          function (a) {
            return a.message;
          },
        n = { _errors: [] },
        s = (a) => {
          for (let i of a.issues)
            if (i.code === "invalid_union") i.unionErrors.map(s);
            else if (i.code === "invalid_return_type") s(i.returnTypeError);
            else if (i.code === "invalid_arguments") s(i.argumentsError);
            else if (i.path.length === 0) n._errors.push(r(i));
            else {
              let o = n,
                d = 0;
              for (; d < i.path.length; ) {
                let c = i.path[d];
                d === i.path.length - 1
                  ? ((o[c] = o[c] || { _errors: [] }), o[c]._errors.push(r(i)))
                  : (o[c] = o[c] || { _errors: [] }),
                  (o = o[c]),
                  d++;
              }
            }
        };
      return s(this), n;
    }
    toString() {
      return this.message;
    }
    get message() {
      return JSON.stringify(this.issues, A.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
      return this.issues.length === 0;
    }
    flatten(e = (r) => r.message) {
      let r = {},
        n = [];
      for (let s of this.issues)
        s.path.length > 0
          ? ((r[s.path[0]] = r[s.path[0]] || []), r[s.path[0]].push(e(s)))
          : n.push(e(s));
      return { formErrors: n, fieldErrors: r };
    }
    get formErrors() {
      return this.flatten();
    }
  };
G.create = (t) => new G(t);
var ct = (t, e) => {
    let r;
    switch (t.code) {
      case l.invalid_type:
        t.received === p.undefined
          ? (r = "Required")
          : (r = `Expected ${t.expected}, received ${t.received}`);
        break;
      case l.invalid_literal:
        r = `Invalid literal value, expected ${JSON.stringify(
          t.expected,
          A.jsonStringifyReplacer
        )}`;
        break;
      case l.unrecognized_keys:
        r = `Unrecognized key(s) in object: ${A.joinValues(t.keys, ", ")}`;
        break;
      case l.invalid_union:
        r = "Invalid input";
        break;
      case l.invalid_union_discriminator:
        r = `Invalid discriminator value. Expected ${A.joinValues(t.options)}`;
        break;
      case l.invalid_enum_value:
        r = `Invalid enum value. Expected ${A.joinValues(
          t.options
        )}, received '${t.received}'`;
        break;
      case l.invalid_arguments:
        r = "Invalid function arguments";
        break;
      case l.invalid_return_type:
        r = "Invalid function return type";
        break;
      case l.invalid_date:
        r = "Invalid date";
        break;
      case l.invalid_string:
        typeof t.validation == "object"
          ? "includes" in t.validation
            ? ((r = `Invalid input: must include "${t.validation.includes}"`),
              typeof t.validation.position == "number" &&
                (r = `${r} at one or more positions greater than or equal to ${t.validation.position}`))
            : "startsWith" in t.validation
              ? (r = `Invalid input: must start with "${t.validation.startsWith}"`)
              : "endsWith" in t.validation
                ? (r = `Invalid input: must end with "${t.validation.endsWith}"`)
                : A.assertNever(t.validation)
          : t.validation !== "regex"
            ? (r = `Invalid ${t.validation}`)
            : (r = "Invalid");
        break;
      case l.too_small:
        t.type === "array"
          ? (r = `Array must contain ${
              t.exact ? "exactly" : t.inclusive ? "at least" : "more than"
            } ${t.minimum} element(s)`)
          : t.type === "string"
            ? (r = `String must contain ${
                t.exact ? "exactly" : t.inclusive ? "at least" : "over"
              } ${t.minimum} character(s)`)
            : t.type === "number"
              ? (r = `Number must be ${
                  t.exact
                    ? "exactly equal to "
                    : t.inclusive
                      ? "greater than or equal to "
                      : "greater than "
                }${t.minimum}`)
              : t.type === "date"
                ? (r = `Date must be ${
                    t.exact
                      ? "exactly equal to "
                      : t.inclusive
                        ? "greater than or equal to "
                        : "greater than "
                  }${new Date(Number(t.minimum))}`)
                : (r = "Invalid input");
        break;
      case l.too_big:
        t.type === "array"
          ? (r = `Array must contain ${
              t.exact ? "exactly" : t.inclusive ? "at most" : "less than"
            } ${t.maximum} element(s)`)
          : t.type === "string"
            ? (r = `String must contain ${
                t.exact ? "exactly" : t.inclusive ? "at most" : "under"
              } ${t.maximum} character(s)`)
            : t.type === "number"
              ? (r = `Number must be ${
                  t.exact
                    ? "exactly"
                    : t.inclusive
                      ? "less than or equal to"
                      : "less than"
                } ${t.maximum}`)
              : t.type === "bigint"
                ? (r = `BigInt must be ${
                    t.exact
                      ? "exactly"
                      : t.inclusive
                        ? "less than or equal to"
                        : "less than"
                  } ${t.maximum}`)
                : t.type === "date"
                  ? (r = `Date must be ${
                      t.exact
                        ? "exactly"
                        : t.inclusive
                          ? "smaller than or equal to"
                          : "smaller than"
                    } ${new Date(Number(t.maximum))}`)
                  : (r = "Invalid input");
        break;
      case l.custom:
        r = "Invalid input";
        break;
      case l.invalid_intersection_types:
        r = "Intersection results could not be merged";
        break;
      case l.not_multiple_of:
        r = `Number must be a multiple of ${t.multipleOf}`;
        break;
      case l.not_finite:
        r = "Number must be finite";
        break;
      default:
        (r = e.defaultError), A.assertNever(t);
    }
    return { message: r };
  },
  Qr = ct;
function us(t) {
  Qr = t;
}
function Rt() {
  return Qr;
}
var Pt = (t) => {
    let { data: e, path: r, errorMaps: n, issueData: s } = t,
      a = [...r, ...(s.path || [])],
      i = { ...s, path: a },
      o = "",
      d = n
        .filter((c) => !!c)
        .slice()
        .reverse();
    for (let c of d) o = c(i, { data: e, defaultError: o }).message;
    return { ...s, path: a, message: s.message || o };
  },
  ls = [];
function h(t, e) {
  let r = Pt({
    issueData: e,
    data: t.data,
    path: t.path,
    errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, Rt(), ct].filter(
      (n) => !!n
    ),
  });
  t.common.issues.push(r);
}
var U = class {
    constructor() {
      this.value = "valid";
    }
    dirty() {
      this.value === "valid" && (this.value = "dirty");
    }
    abort() {
      this.value !== "aborted" && (this.value = "aborted");
    }
    static mergeArray(e, r) {
      let n = [];
      for (let s of r) {
        if (s.status === "aborted") return _;
        s.status === "dirty" && e.dirty(), n.push(s.value);
      }
      return { status: e.value, value: n };
    }
    static async mergeObjectAsync(e, r) {
      let n = [];
      for (let s of r) n.push({ key: await s.key, value: await s.value });
      return U.mergeObjectSync(e, n);
    }
    static mergeObjectSync(e, r) {
      let n = {};
      for (let s of r) {
        let { key: a, value: i } = s;
        if (a.status === "aborted" || i.status === "aborted") return _;
        a.status === "dirty" && e.dirty(),
          i.status === "dirty" && e.dirty(),
          a.value !== "__proto__" &&
            (typeof i.value < "u" || s.alwaysSet) &&
            (n[a.value] = i.value);
      }
      return { status: e.value, value: n };
    }
  },
  _ = Object.freeze({ status: "aborted" }),
  en = (t) => ({ status: "dirty", value: t }),
  V = (t) => ({ status: "valid", value: t }),
  dr = (t) => t.status === "aborted",
  ur = (t) => t.status === "dirty",
  dt = (t) => t.status === "valid",
  kt = (t) => typeof Promise < "u" && t instanceof Promise,
  y;
(function (t) {
  (t.errToObj = (e) => (typeof e == "string" ? { message: e } : e || {})),
    (t.toString = (e) => (typeof e == "string" ? e : e?.message));
})(y || (y = {}));
var X = class {
    constructor(e, r, n, s) {
      (this._cachedPath = []),
        (this.parent = e),
        (this.data = r),
        (this._path = n),
        (this._key = s);
    }
    get path() {
      return (
        this._cachedPath.length ||
          (this._key instanceof Array
            ? this._cachedPath.push(...this._path, ...this._key)
            : this._cachedPath.push(...this._path, this._key)),
        this._cachedPath
      );
    }
  },
  Xr = (t, e) => {
    if (dt(e)) return { success: !0, data: e.value };
    if (!t.common.issues.length)
      throw new Error("Validation failed but no issues detected.");
    return {
      success: !1,
      get error() {
        if (this._error) return this._error;
        let r = new G(t.common.issues);
        return (this._error = r), this._error;
      },
    };
  };
function x(t) {
  if (!t) return {};
  let {
    errorMap: e,
    invalid_type_error: r,
    required_error: n,
    description: s,
  } = t;
  if (e && (r || n))
    throw new Error(
      `Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`
    );
  return e
    ? { errorMap: e, description: s }
    : {
        errorMap: (i, o) =>
          i.code !== "invalid_type"
            ? { message: o.defaultError }
            : typeof o.data > "u"
              ? { message: n ?? o.defaultError }
              : { message: r ?? o.defaultError },
        description: s,
      };
}
var E = class {
    constructor(e) {
      (this.spa = this.safeParseAsync),
        (this._def = e),
        (this.parse = this.parse.bind(this)),
        (this.safeParse = this.safeParse.bind(this)),
        (this.parseAsync = this.parseAsync.bind(this)),
        (this.safeParseAsync = this.safeParseAsync.bind(this)),
        (this.spa = this.spa.bind(this)),
        (this.refine = this.refine.bind(this)),
        (this.refinement = this.refinement.bind(this)),
        (this.superRefine = this.superRefine.bind(this)),
        (this.optional = this.optional.bind(this)),
        (this.nullable = this.nullable.bind(this)),
        (this.nullish = this.nullish.bind(this)),
        (this.array = this.array.bind(this)),
        (this.promise = this.promise.bind(this)),
        (this.or = this.or.bind(this)),
        (this.and = this.and.bind(this)),
        (this.transform = this.transform.bind(this)),
        (this.brand = this.brand.bind(this)),
        (this.default = this.default.bind(this)),
        (this.catch = this.catch.bind(this)),
        (this.describe = this.describe.bind(this)),
        (this.pipe = this.pipe.bind(this)),
        (this.readonly = this.readonly.bind(this)),
        (this.isNullable = this.isNullable.bind(this)),
        (this.isOptional = this.isOptional.bind(this));
    }
    get description() {
      return this._def.description;
    }
    _getType(e) {
      return he(e.data);
    }
    _getOrReturnCtx(e, r) {
      return (
        r || {
          common: e.parent.common,
          data: e.data,
          parsedType: he(e.data),
          schemaErrorMap: this._def.errorMap,
          path: e.path,
          parent: e.parent,
        }
      );
    }
    _processInputParams(e) {
      return {
        status: new U(),
        ctx: {
          common: e.parent.common,
          data: e.data,
          parsedType: he(e.data),
          schemaErrorMap: this._def.errorMap,
          path: e.path,
          parent: e.parent,
        },
      };
    }
    _parseSync(e) {
      let r = this._parse(e);
      if (kt(r)) throw new Error("Synchronous parse encountered promise.");
      return r;
    }
    _parseAsync(e) {
      let r = this._parse(e);
      return Promise.resolve(r);
    }
    parse(e, r) {
      let n = this.safeParse(e, r);
      if (n.success) return n.data;
      throw n.error;
    }
    safeParse(e, r) {
      var n;
      let s = {
          common: {
            issues: [],
            async: (n = r?.async) !== null && n !== void 0 ? n : !1,
            contextualErrorMap: r?.errorMap,
          },
          path: r?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data: e,
          parsedType: he(e),
        },
        a = this._parseSync({ data: e, path: s.path, parent: s });
      return Xr(s, a);
    }
    async parseAsync(e, r) {
      let n = await this.safeParseAsync(e, r);
      if (n.success) return n.data;
      throw n.error;
    }
    async safeParseAsync(e, r) {
      let n = {
          common: { issues: [], contextualErrorMap: r?.errorMap, async: !0 },
          path: r?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data: e,
          parsedType: he(e),
        },
        s = this._parse({ data: e, path: n.path, parent: n }),
        a = await (kt(s) ? s : Promise.resolve(s));
      return Xr(n, a);
    }
    refine(e, r) {
      let n = (s) =>
        typeof r == "string" || typeof r > "u"
          ? { message: r }
          : typeof r == "function"
            ? r(s)
            : r;
      return this._refinement((s, a) => {
        let i = e(s),
          o = () => a.addIssue({ code: l.custom, ...n(s) });
        return typeof Promise < "u" && i instanceof Promise
          ? i.then((d) => (d ? !0 : (o(), !1)))
          : i
            ? !0
            : (o(), !1);
      });
    }
    refinement(e, r) {
      return this._refinement((n, s) =>
        e(n) ? !0 : (s.addIssue(typeof r == "function" ? r(n, s) : r), !1)
      );
    }
    _refinement(e) {
      return new q({
        schema: this,
        typeName: g.ZodEffects,
        effect: { type: "refinement", refinement: e },
      });
    }
    superRefine(e) {
      return this._refinement(e);
    }
    optional() {
      return te.create(this, this._def);
    }
    nullable() {
      return ue.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return Z.create(this, this._def);
    }
    promise() {
      return ye.create(this, this._def);
    }
    or(e) {
      return Ee.create([this, e], this._def);
    }
    and(e) {
      return be.create(this, e, this._def);
    }
    transform(e) {
      return new q({
        ...x(this._def),
        schema: this,
        typeName: g.ZodEffects,
        effect: { type: "transform", transform: e },
      });
    }
    default(e) {
      let r = typeof e == "function" ? e : () => e;
      return new He({
        ...x(this._def),
        innerType: this,
        defaultValue: r,
        typeName: g.ZodDefault,
      });
    }
    brand() {
      return new Kt({ typeName: g.ZodBranded, type: this, ...x(this._def) });
    }
    catch(e) {
      let r = typeof e == "function" ? e : () => e;
      return new ze({
        ...x(this._def),
        innerType: this,
        catchValue: r,
        typeName: g.ZodCatch,
      });
    }
    describe(e) {
      let r = this.constructor;
      return new r({ ...this._def, description: e });
    }
    pipe(e) {
      return Re.create(this, e);
    }
    readonly() {
      return Fe.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  },
  ps = /^c[^\s-]{8,}$/i,
  hs = /^[a-z][a-z0-9]*$/,
  fs = /^[0-9A-HJKMNP-TV-Z]{26}$/,
  ms =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
  ys =
    /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,
  gs = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
  or,
  ws =
    /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/,
  _s =
    /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  vs = (t) =>
    t.precision
      ? t.offset
        ? new RegExp(
            `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${t.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`
          )
        : new RegExp(
            `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${t.precision}}Z$`
          )
      : t.precision === 0
        ? t.offset
          ? new RegExp(
              "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$"
            )
          : new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$")
        : t.offset
          ? new RegExp(
              "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$"
            )
          : new RegExp(
              "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$"
            );
function xs(t, e) {
  return !!(
    ((e === "v4" || !e) && ws.test(t)) ||
    ((e === "v6" || !e) && _s.test(t))
  );
}
var F = class extends E {
  _parse(e) {
    if (
      (this._def.coerce && (e.data = String(e.data)),
      this._getType(e) !== p.string)
    ) {
      let a = this._getOrReturnCtx(e);
      return (
        h(a, {
          code: l.invalid_type,
          expected: p.string,
          received: a.parsedType,
        }),
        _
      );
    }
    let n = new U(),
      s;
    for (let a of this._def.checks)
      if (a.kind === "min")
        e.data.length < a.value &&
          ((s = this._getOrReturnCtx(e, s)),
          h(s, {
            code: l.too_small,
            minimum: a.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: a.message,
          }),
          n.dirty());
      else if (a.kind === "max")
        e.data.length > a.value &&
          ((s = this._getOrReturnCtx(e, s)),
          h(s, {
            code: l.too_big,
            maximum: a.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: a.message,
          }),
          n.dirty());
      else if (a.kind === "length") {
        let i = e.data.length > a.value,
          o = e.data.length < a.value;
        (i || o) &&
          ((s = this._getOrReturnCtx(e, s)),
          i
            ? h(s, {
                code: l.too_big,
                maximum: a.value,
                type: "string",
                inclusive: !0,
                exact: !0,
                message: a.message,
              })
            : o &&
              h(s, {
                code: l.too_small,
                minimum: a.value,
                type: "string",
                inclusive: !0,
                exact: !0,
                message: a.message,
              }),
          n.dirty());
      } else if (a.kind === "email")
        ys.test(e.data) ||
          ((s = this._getOrReturnCtx(e, s)),
          h(s, {
            validation: "email",
            code: l.invalid_string,
            message: a.message,
          }),
          n.dirty());
      else if (a.kind === "emoji")
        or || (or = new RegExp(gs, "u")),
          or.test(e.data) ||
            ((s = this._getOrReturnCtx(e, s)),
            h(s, {
              validation: "emoji",
              code: l.invalid_string,
              message: a.message,
            }),
            n.dirty());
      else if (a.kind === "uuid")
        ms.test(e.data) ||
          ((s = this._getOrReturnCtx(e, s)),
          h(s, {
            validation: "uuid",
            code: l.invalid_string,
            message: a.message,
          }),
          n.dirty());
      else if (a.kind === "cuid")
        ps.test(e.data) ||
          ((s = this._getOrReturnCtx(e, s)),
          h(s, {
            validation: "cuid",
            code: l.invalid_string,
            message: a.message,
          }),
          n.dirty());
      else if (a.kind === "cuid2")
        hs.test(e.data) ||
          ((s = this._getOrReturnCtx(e, s)),
          h(s, {
            validation: "cuid2",
            code: l.invalid_string,
            message: a.message,
          }),
          n.dirty());
      else if (a.kind === "ulid")
        fs.test(e.data) ||
          ((s = this._getOrReturnCtx(e, s)),
          h(s, {
            validation: "ulid",
            code: l.invalid_string,
            message: a.message,
          }),
          n.dirty());
      else if (a.kind === "url")
        try {
          new URL(e.data);
        } catch {
          (s = this._getOrReturnCtx(e, s)),
            h(s, {
              validation: "url",
              code: l.invalid_string,
              message: a.message,
            }),
            n.dirty();
        }
      else
        a.kind === "regex"
          ? ((a.regex.lastIndex = 0),
            a.regex.test(e.data) ||
              ((s = this._getOrReturnCtx(e, s)),
              h(s, {
                validation: "regex",
                code: l.invalid_string,
                message: a.message,
              }),
              n.dirty()))
          : a.kind === "trim"
            ? (e.data = e.data.trim())
            : a.kind === "includes"
              ? e.data.includes(a.value, a.position) ||
                ((s = this._getOrReturnCtx(e, s)),
                h(s, {
                  code: l.invalid_string,
                  validation: { includes: a.value, position: a.position },
                  message: a.message,
                }),
                n.dirty())
              : a.kind === "toLowerCase"
                ? (e.data = e.data.toLowerCase())
                : a.kind === "toUpperCase"
                  ? (e.data = e.data.toUpperCase())
                  : a.kind === "startsWith"
                    ? e.data.startsWith(a.value) ||
                      ((s = this._getOrReturnCtx(e, s)),
                      h(s, {
                        code: l.invalid_string,
                        validation: { startsWith: a.value },
                        message: a.message,
                      }),
                      n.dirty())
                    : a.kind === "endsWith"
                      ? e.data.endsWith(a.value) ||
                        ((s = this._getOrReturnCtx(e, s)),
                        h(s, {
                          code: l.invalid_string,
                          validation: { endsWith: a.value },
                          message: a.message,
                        }),
                        n.dirty())
                      : a.kind === "datetime"
                        ? vs(a).test(e.data) ||
                          ((s = this._getOrReturnCtx(e, s)),
                          h(s, {
                            code: l.invalid_string,
                            validation: "datetime",
                            message: a.message,
                          }),
                          n.dirty())
                        : a.kind === "ip"
                          ? xs(e.data, a.version) ||
                            ((s = this._getOrReturnCtx(e, s)),
                            h(s, {
                              validation: "ip",
                              code: l.invalid_string,
                              message: a.message,
                            }),
                            n.dirty())
                          : A.assertNever(a);
    return { status: n.value, value: e.data };
  }
  _regex(e, r, n) {
    return this.refinement((s) => e.test(s), {
      validation: r,
      code: l.invalid_string,
      ...y.errToObj(n),
    });
  }
  _addCheck(e) {
    return new F({ ...this._def, checks: [...this._def.checks, e] });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...y.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...y.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...y.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...y.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...y.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...y.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...y.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...y.errToObj(e) });
  }
  datetime(e) {
    var r;
    return typeof e == "string"
      ? this._addCheck({
          kind: "datetime",
          precision: null,
          offset: !1,
          message: e,
        })
      : this._addCheck({
          kind: "datetime",
          precision: typeof e?.precision > "u" ? null : e?.precision,
          offset: (r = e?.offset) !== null && r !== void 0 ? r : !1,
          ...y.errToObj(e?.message),
        });
  }
  regex(e, r) {
    return this._addCheck({ kind: "regex", regex: e, ...y.errToObj(r) });
  }
  includes(e, r) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: r?.position,
      ...y.errToObj(r?.message),
    });
  }
  startsWith(e, r) {
    return this._addCheck({ kind: "startsWith", value: e, ...y.errToObj(r) });
  }
  endsWith(e, r) {
    return this._addCheck({ kind: "endsWith", value: e, ...y.errToObj(r) });
  }
  min(e, r) {
    return this._addCheck({ kind: "min", value: e, ...y.errToObj(r) });
  }
  max(e, r) {
    return this._addCheck({ kind: "max", value: e, ...y.errToObj(r) });
  }
  length(e, r) {
    return this._addCheck({ kind: "length", value: e, ...y.errToObj(r) });
  }
  nonempty(e) {
    return this.min(1, y.errToObj(e));
  }
  trim() {
    return new F({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }],
    });
  }
  toLowerCase() {
    return new F({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }],
    });
  }
  toUpperCase() {
    return new F({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }],
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get minLength() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
};
F.create = (t) => {
  var e;
  return new F({
    checks: [],
    typeName: g.ZodString,
    coerce: (e = t?.coerce) !== null && e !== void 0 ? e : !1,
    ...x(t),
  });
};
function Es(t, e) {
  let r = (t.toString().split(".")[1] || "").length,
    n = (e.toString().split(".")[1] || "").length,
    s = r > n ? r : n,
    a = parseInt(t.toFixed(s).replace(".", "")),
    i = parseInt(e.toFixed(s).replace(".", ""));
  return (a % i) / Math.pow(10, s);
}
var ne = class extends E {
  constructor() {
    super(...arguments),
      (this.min = this.gte),
      (this.max = this.lte),
      (this.step = this.multipleOf);
  }
  _parse(e) {
    if (
      (this._def.coerce && (e.data = Number(e.data)),
      this._getType(e) !== p.number)
    ) {
      let a = this._getOrReturnCtx(e);
      return (
        h(a, {
          code: l.invalid_type,
          expected: p.number,
          received: a.parsedType,
        }),
        _
      );
    }
    let n,
      s = new U();
    for (let a of this._def.checks)
      a.kind === "int"
        ? A.isInteger(e.data) ||
          ((n = this._getOrReturnCtx(e, n)),
          h(n, {
            code: l.invalid_type,
            expected: "integer",
            received: "float",
            message: a.message,
          }),
          s.dirty())
        : a.kind === "min"
          ? (a.inclusive ? e.data < a.value : e.data <= a.value) &&
            ((n = this._getOrReturnCtx(e, n)),
            h(n, {
              code: l.too_small,
              minimum: a.value,
              type: "number",
              inclusive: a.inclusive,
              exact: !1,
              message: a.message,
            }),
            s.dirty())
          : a.kind === "max"
            ? (a.inclusive ? e.data > a.value : e.data >= a.value) &&
              ((n = this._getOrReturnCtx(e, n)),
              h(n, {
                code: l.too_big,
                maximum: a.value,
                type: "number",
                inclusive: a.inclusive,
                exact: !1,
                message: a.message,
              }),
              s.dirty())
            : a.kind === "multipleOf"
              ? Es(e.data, a.value) !== 0 &&
                ((n = this._getOrReturnCtx(e, n)),
                h(n, {
                  code: l.not_multiple_of,
                  multipleOf: a.value,
                  message: a.message,
                }),
                s.dirty())
              : a.kind === "finite"
                ? Number.isFinite(e.data) ||
                  ((n = this._getOrReturnCtx(e, n)),
                  h(n, { code: l.not_finite, message: a.message }),
                  s.dirty())
                : A.assertNever(a);
    return { status: s.value, value: e.data };
  }
  gte(e, r) {
    return this.setLimit("min", e, !0, y.toString(r));
  }
  gt(e, r) {
    return this.setLimit("min", e, !1, y.toString(r));
  }
  lte(e, r) {
    return this.setLimit("max", e, !0, y.toString(r));
  }
  lt(e, r) {
    return this.setLimit("max", e, !1, y.toString(r));
  }
  setLimit(e, r, n, s) {
    return new ne({
      ...this._def,
      checks: [
        ...this._def.checks,
        { kind: e, value: r, inclusive: n, message: y.toString(s) },
      ],
    });
  }
  _addCheck(e) {
    return new ne({ ...this._def, checks: [...this._def.checks, e] });
  }
  int(e) {
    return this._addCheck({ kind: "int", message: y.toString(e) });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: y.toString(e),
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: y.toString(e),
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: y.toString(e),
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: y.toString(e),
    });
  }
  multipleOf(e, r) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: y.toString(r),
    });
  }
  finite(e) {
    return this._addCheck({ kind: "finite", message: y.toString(e) });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: y.toString(e),
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: y.toString(e),
    });
  }
  get minValue() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find(
      (e) =>
        e.kind === "int" || (e.kind === "multipleOf" && A.isInteger(e.value))
    );
  }
  get isFinite() {
    let e = null,
      r = null;
    for (let n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf")
        return !0;
      n.kind === "min"
        ? (r === null || n.value > r) && (r = n.value)
        : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(r) && Number.isFinite(e);
  }
};
ne.create = (t) =>
  new ne({
    checks: [],
    typeName: g.ZodNumber,
    coerce: t?.coerce || !1,
    ...x(t),
  });
var se = class extends E {
  constructor() {
    super(...arguments), (this.min = this.gte), (this.max = this.lte);
  }
  _parse(e) {
    if (
      (this._def.coerce && (e.data = BigInt(e.data)),
      this._getType(e) !== p.bigint)
    ) {
      let a = this._getOrReturnCtx(e);
      return (
        h(a, {
          code: l.invalid_type,
          expected: p.bigint,
          received: a.parsedType,
        }),
        _
      );
    }
    let n,
      s = new U();
    for (let a of this._def.checks)
      a.kind === "min"
        ? (a.inclusive ? e.data < a.value : e.data <= a.value) &&
          ((n = this._getOrReturnCtx(e, n)),
          h(n, {
            code: l.too_small,
            type: "bigint",
            minimum: a.value,
            inclusive: a.inclusive,
            message: a.message,
          }),
          s.dirty())
        : a.kind === "max"
          ? (a.inclusive ? e.data > a.value : e.data >= a.value) &&
            ((n = this._getOrReturnCtx(e, n)),
            h(n, {
              code: l.too_big,
              type: "bigint",
              maximum: a.value,
              inclusive: a.inclusive,
              message: a.message,
            }),
            s.dirty())
          : a.kind === "multipleOf"
            ? e.data % a.value !== BigInt(0) &&
              ((n = this._getOrReturnCtx(e, n)),
              h(n, {
                code: l.not_multiple_of,
                multipleOf: a.value,
                message: a.message,
              }),
              s.dirty())
            : A.assertNever(a);
    return { status: s.value, value: e.data };
  }
  gte(e, r) {
    return this.setLimit("min", e, !0, y.toString(r));
  }
  gt(e, r) {
    return this.setLimit("min", e, !1, y.toString(r));
  }
  lte(e, r) {
    return this.setLimit("max", e, !0, y.toString(r));
  }
  lt(e, r) {
    return this.setLimit("max", e, !1, y.toString(r));
  }
  setLimit(e, r, n, s) {
    return new se({
      ...this._def,
      checks: [
        ...this._def.checks,
        { kind: e, value: r, inclusive: n, message: y.toString(s) },
      ],
    });
  }
  _addCheck(e) {
    return new se({ ...this._def, checks: [...this._def.checks, e] });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: y.toString(e),
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: y.toString(e),
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: y.toString(e),
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: y.toString(e),
    });
  }
  multipleOf(e, r) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: y.toString(r),
    });
  }
  get minValue() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
};
se.create = (t) => {
  var e;
  return new se({
    checks: [],
    typeName: g.ZodBigInt,
    coerce: (e = t?.coerce) !== null && e !== void 0 ? e : !1,
    ...x(t),
  });
};
var _e = class extends E {
  _parse(e) {
    if (
      (this._def.coerce && (e.data = !!e.data), this._getType(e) !== p.boolean)
    ) {
      let n = this._getOrReturnCtx(e);
      return (
        h(n, {
          code: l.invalid_type,
          expected: p.boolean,
          received: n.parsedType,
        }),
        _
      );
    }
    return V(e.data);
  }
};
_e.create = (t) =>
  new _e({ typeName: g.ZodBoolean, coerce: t?.coerce || !1, ...x(t) });
var ce = class extends E {
  _parse(e) {
    if (
      (this._def.coerce && (e.data = new Date(e.data)),
      this._getType(e) !== p.date)
    ) {
      let a = this._getOrReturnCtx(e);
      return (
        h(a, {
          code: l.invalid_type,
          expected: p.date,
          received: a.parsedType,
        }),
        _
      );
    }
    if (isNaN(e.data.getTime())) {
      let a = this._getOrReturnCtx(e);
      return h(a, { code: l.invalid_date }), _;
    }
    let n = new U(),
      s;
    for (let a of this._def.checks)
      a.kind === "min"
        ? e.data.getTime() < a.value &&
          ((s = this._getOrReturnCtx(e, s)),
          h(s, {
            code: l.too_small,
            message: a.message,
            inclusive: !0,
            exact: !1,
            minimum: a.value,
            type: "date",
          }),
          n.dirty())
        : a.kind === "max"
          ? e.data.getTime() > a.value &&
            ((s = this._getOrReturnCtx(e, s)),
            h(s, {
              code: l.too_big,
              message: a.message,
              inclusive: !0,
              exact: !1,
              maximum: a.value,
              type: "date",
            }),
            n.dirty())
          : A.assertNever(a);
    return { status: n.value, value: new Date(e.data.getTime()) };
  }
  _addCheck(e) {
    return new ce({ ...this._def, checks: [...this._def.checks, e] });
  }
  min(e, r) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: y.toString(r),
    });
  }
  max(e, r) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: y.toString(r),
    });
  }
  get minDate() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (let r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e != null ? new Date(e) : null;
  }
};
ce.create = (t) =>
  new ce({ checks: [], coerce: t?.coerce || !1, typeName: g.ZodDate, ...x(t) });
var $e = class extends E {
  _parse(e) {
    if (this._getType(e) !== p.symbol) {
      let n = this._getOrReturnCtx(e);
      return (
        h(n, {
          code: l.invalid_type,
          expected: p.symbol,
          received: n.parsedType,
        }),
        _
      );
    }
    return V(e.data);
  }
};
$e.create = (t) => new $e({ typeName: g.ZodSymbol, ...x(t) });
var ve = class extends E {
  _parse(e) {
    if (this._getType(e) !== p.undefined) {
      let n = this._getOrReturnCtx(e);
      return (
        h(n, {
          code: l.invalid_type,
          expected: p.undefined,
          received: n.parsedType,
        }),
        _
      );
    }
    return V(e.data);
  }
};
ve.create = (t) => new ve({ typeName: g.ZodUndefined, ...x(t) });
var xe = class extends E {
  _parse(e) {
    if (this._getType(e) !== p.null) {
      let n = this._getOrReturnCtx(e);
      return (
        h(n, {
          code: l.invalid_type,
          expected: p.null,
          received: n.parsedType,
        }),
        _
      );
    }
    return V(e.data);
  }
};
xe.create = (t) => new xe({ typeName: g.ZodNull, ...x(t) });
var me = class extends E {
  constructor() {
    super(...arguments), (this._any = !0);
  }
  _parse(e) {
    return V(e.data);
  }
};
me.create = (t) => new me({ typeName: g.ZodAny, ...x(t) });
var oe = class extends E {
  constructor() {
    super(...arguments), (this._unknown = !0);
  }
  _parse(e) {
    return V(e.data);
  }
};
oe.create = (t) => new oe({ typeName: g.ZodUnknown, ...x(t) });
var re = class extends E {
  _parse(e) {
    let r = this._getOrReturnCtx(e);
    return (
      h(r, { code: l.invalid_type, expected: p.never, received: r.parsedType }),
      _
    );
  }
};
re.create = (t) => new re({ typeName: g.ZodNever, ...x(t) });
var Le = class extends E {
  _parse(e) {
    if (this._getType(e) !== p.undefined) {
      let n = this._getOrReturnCtx(e);
      return (
        h(n, {
          code: l.invalid_type,
          expected: p.void,
          received: n.parsedType,
        }),
        _
      );
    }
    return V(e.data);
  }
};
Le.create = (t) => new Le({ typeName: g.ZodVoid, ...x(t) });
var Z = class extends E {
  _parse(e) {
    let { ctx: r, status: n } = this._processInputParams(e),
      s = this._def;
    if (r.parsedType !== p.array)
      return (
        h(r, {
          code: l.invalid_type,
          expected: p.array,
          received: r.parsedType,
        }),
        _
      );
    if (s.exactLength !== null) {
      let i = r.data.length > s.exactLength.value,
        o = r.data.length < s.exactLength.value;
      (i || o) &&
        (h(r, {
          code: i ? l.too_big : l.too_small,
          minimum: o ? s.exactLength.value : void 0,
          maximum: i ? s.exactLength.value : void 0,
          type: "array",
          inclusive: !0,
          exact: !0,
          message: s.exactLength.message,
        }),
        n.dirty());
    }
    if (
      (s.minLength !== null &&
        r.data.length < s.minLength.value &&
        (h(r, {
          code: l.too_small,
          minimum: s.minLength.value,
          type: "array",
          inclusive: !0,
          exact: !1,
          message: s.minLength.message,
        }),
        n.dirty()),
      s.maxLength !== null &&
        r.data.length > s.maxLength.value &&
        (h(r, {
          code: l.too_big,
          maximum: s.maxLength.value,
          type: "array",
          inclusive: !0,
          exact: !1,
          message: s.maxLength.message,
        }),
        n.dirty()),
      r.common.async)
    )
      return Promise.all(
        [...r.data].map((i, o) => s.type._parseAsync(new X(r, i, r.path, o)))
      ).then((i) => U.mergeArray(n, i));
    let a = [...r.data].map((i, o) =>
      s.type._parseSync(new X(r, i, r.path, o))
    );
    return U.mergeArray(n, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, r) {
    return new Z({
      ...this._def,
      minLength: { value: e, message: y.toString(r) },
    });
  }
  max(e, r) {
    return new Z({
      ...this._def,
      maxLength: { value: e, message: y.toString(r) },
    });
  }
  length(e, r) {
    return new Z({
      ...this._def,
      exactLength: { value: e, message: y.toString(r) },
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
};
Z.create = (t, e) =>
  new Z({
    type: t,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: g.ZodArray,
    ...x(e),
  });
function Ue(t) {
  if (t instanceof R) {
    let e = {};
    for (let r in t.shape) {
      let n = t.shape[r];
      e[r] = te.create(Ue(n));
    }
    return new R({ ...t._def, shape: () => e });
  } else
    return t instanceof Z
      ? new Z({ ...t._def, type: Ue(t.element) })
      : t instanceof te
        ? te.create(Ue(t.unwrap()))
        : t instanceof ue
          ? ue.create(Ue(t.unwrap()))
          : t instanceof Y
            ? Y.create(t.items.map((e) => Ue(e)))
            : t;
}
var R = class extends E {
  constructor() {
    super(...arguments),
      (this._cached = null),
      (this.nonstrict = this.passthrough),
      (this.augment = this.extend);
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    let e = this._def.shape(),
      r = A.objectKeys(e);
    return (this._cached = { shape: e, keys: r });
  }
  _parse(e) {
    if (this._getType(e) !== p.object) {
      let c = this._getOrReturnCtx(e);
      return (
        h(c, {
          code: l.invalid_type,
          expected: p.object,
          received: c.parsedType,
        }),
        _
      );
    }
    let { status: n, ctx: s } = this._processInputParams(e),
      { shape: a, keys: i } = this._getCached(),
      o = [];
    if (
      !(this._def.catchall instanceof re && this._def.unknownKeys === "strip")
    )
      for (let c in s.data) i.includes(c) || o.push(c);
    let d = [];
    for (let c of i) {
      let u = a[c],
        m = s.data[c];
      d.push({
        key: { status: "valid", value: c },
        value: u._parse(new X(s, m, s.path, c)),
        alwaysSet: c in s.data,
      });
    }
    if (this._def.catchall instanceof re) {
      let c = this._def.unknownKeys;
      if (c === "passthrough")
        for (let u of o)
          d.push({
            key: { status: "valid", value: u },
            value: { status: "valid", value: s.data[u] },
          });
      else if (c === "strict")
        o.length > 0 &&
          (h(s, { code: l.unrecognized_keys, keys: o }), n.dirty());
      else if (c !== "strip")
        throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      let c = this._def.catchall;
      for (let u of o) {
        let m = s.data[u];
        d.push({
          key: { status: "valid", value: u },
          value: c._parse(new X(s, m, s.path, u)),
          alwaysSet: u in s.data,
        });
      }
    }
    return s.common.async
      ? Promise.resolve()
          .then(async () => {
            let c = [];
            for (let u of d) {
              let m = await u.key;
              c.push({ key: m, value: await u.value, alwaysSet: u.alwaysSet });
            }
            return c;
          })
          .then((c) => U.mergeObjectSync(n, c))
      : U.mergeObjectSync(n, d);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return (
      y.errToObj,
      new R({
        ...this._def,
        unknownKeys: "strict",
        ...(e !== void 0
          ? {
              errorMap: (r, n) => {
                var s, a, i, o;
                let d =
                  (i =
                    (a = (s = this._def).errorMap) === null || a === void 0
                      ? void 0
                      : a.call(s, r, n).message) !== null && i !== void 0
                    ? i
                    : n.defaultError;
                return r.code === "unrecognized_keys"
                  ? {
                      message:
                        (o = y.errToObj(e).message) !== null && o !== void 0
                          ? o
                          : d,
                    }
                  : { message: d };
              },
            }
          : {}),
      })
    );
  }
  strip() {
    return new R({ ...this._def, unknownKeys: "strip" });
  }
  passthrough() {
    return new R({ ...this._def, unknownKeys: "passthrough" });
  }
  extend(e) {
    return new R({
      ...this._def,
      shape: () => ({ ...this._def.shape(), ...e }),
    });
  }
  merge(e) {
    return new R({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({ ...this._def.shape(), ...e._def.shape() }),
      typeName: g.ZodObject,
    });
  }
  setKey(e, r) {
    return this.augment({ [e]: r });
  }
  catchall(e) {
    return new R({ ...this._def, catchall: e });
  }
  pick(e) {
    let r = {};
    return (
      A.objectKeys(e).forEach((n) => {
        e[n] && this.shape[n] && (r[n] = this.shape[n]);
      }),
      new R({ ...this._def, shape: () => r })
    );
  }
  omit(e) {
    let r = {};
    return (
      A.objectKeys(this.shape).forEach((n) => {
        e[n] || (r[n] = this.shape[n]);
      }),
      new R({ ...this._def, shape: () => r })
    );
  }
  deepPartial() {
    return Ue(this);
  }
  partial(e) {
    let r = {};
    return (
      A.objectKeys(this.shape).forEach((n) => {
        let s = this.shape[n];
        e && !e[n] ? (r[n] = s) : (r[n] = s.optional());
      }),
      new R({ ...this._def, shape: () => r })
    );
  }
  required(e) {
    let r = {};
    return (
      A.objectKeys(this.shape).forEach((n) => {
        if (e && !e[n]) r[n] = this.shape[n];
        else {
          let a = this.shape[n];
          for (; a instanceof te; ) a = a._def.innerType;
          r[n] = a;
        }
      }),
      new R({ ...this._def, shape: () => r })
    );
  }
  keyof() {
    return tn(A.objectKeys(this.shape));
  }
};
R.create = (t, e) =>
  new R({
    shape: () => t,
    unknownKeys: "strip",
    catchall: re.create(),
    typeName: g.ZodObject,
    ...x(e),
  });
R.strictCreate = (t, e) =>
  new R({
    shape: () => t,
    unknownKeys: "strict",
    catchall: re.create(),
    typeName: g.ZodObject,
    ...x(e),
  });
R.lazycreate = (t, e) =>
  new R({
    shape: t,
    unknownKeys: "strip",
    catchall: re.create(),
    typeName: g.ZodObject,
    ...x(e),
  });
var Ee = class extends E {
  _parse(e) {
    let { ctx: r } = this._processInputParams(e),
      n = this._def.options;
    function s(a) {
      for (let o of a) if (o.result.status === "valid") return o.result;
      for (let o of a)
        if (o.result.status === "dirty")
          return r.common.issues.push(...o.ctx.common.issues), o.result;
      let i = a.map((o) => new G(o.ctx.common.issues));
      return h(r, { code: l.invalid_union, unionErrors: i }), _;
    }
    if (r.common.async)
      return Promise.all(
        n.map(async (a) => {
          let i = { ...r, common: { ...r.common, issues: [] }, parent: null };
          return {
            result: await a._parseAsync({
              data: r.data,
              path: r.path,
              parent: i,
            }),
            ctx: i,
          };
        })
      ).then(s);
    {
      let a,
        i = [];
      for (let d of n) {
        let c = { ...r, common: { ...r.common, issues: [] }, parent: null },
          u = d._parseSync({ data: r.data, path: r.path, parent: c });
        if (u.status === "valid") return u;
        u.status === "dirty" && !a && (a = { result: u, ctx: c }),
          c.common.issues.length && i.push(c.common.issues);
      }
      if (a) return r.common.issues.push(...a.ctx.common.issues), a.result;
      let o = i.map((d) => new G(d));
      return h(r, { code: l.invalid_union, unionErrors: o }), _;
    }
  }
  get options() {
    return this._def.options;
  }
};
Ee.create = (t, e) => new Ee({ options: t, typeName: g.ZodUnion, ...x(e) });
var Ht = (t) =>
    t instanceof Ae
      ? Ht(t.schema)
      : t instanceof q
        ? Ht(t.innerType())
        : t instanceof Ce
          ? [t.value]
          : t instanceof ae
            ? t.options
            : t instanceof Te
              ? Object.keys(t.enum)
              : t instanceof He
                ? Ht(t._def.innerType)
                : t instanceof ve
                  ? [void 0]
                  : t instanceof xe
                    ? [null]
                    : null,
  Be = class extends E {
    _parse(e) {
      let { ctx: r } = this._processInputParams(e);
      if (r.parsedType !== p.object)
        return (
          h(r, {
            code: l.invalid_type,
            expected: p.object,
            received: r.parsedType,
          }),
          _
        );
      let n = this.discriminator,
        s = r.data[n],
        a = this.optionsMap.get(s);
      return a
        ? r.common.async
          ? a._parseAsync({ data: r.data, path: r.path, parent: r })
          : a._parseSync({ data: r.data, path: r.path, parent: r })
        : (h(r, {
            code: l.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [n],
          }),
          _);
    }
    get discriminator() {
      return this._def.discriminator;
    }
    get options() {
      return this._def.options;
    }
    get optionsMap() {
      return this._def.optionsMap;
    }
    static create(e, r, n) {
      let s = new Map();
      for (let a of r) {
        let i = Ht(a.shape[e]);
        if (!i)
          throw new Error(
            `A discriminator value for key \`${e}\` could not be extracted from all schema options`
          );
        for (let o of i) {
          if (s.has(o))
            throw new Error(
              `Discriminator property ${String(e)} has duplicate value ${String(
                o
              )}`
            );
          s.set(o, a);
        }
      }
      return new Be({
        typeName: g.ZodDiscriminatedUnion,
        discriminator: e,
        options: r,
        optionsMap: s,
        ...x(n),
      });
    }
  };
function lr(t, e) {
  let r = he(t),
    n = he(e);
  if (t === e) return { valid: !0, data: t };
  if (r === p.object && n === p.object) {
    let s = A.objectKeys(e),
      a = A.objectKeys(t).filter((o) => s.indexOf(o) !== -1),
      i = { ...t, ...e };
    for (let o of a) {
      let d = lr(t[o], e[o]);
      if (!d.valid) return { valid: !1 };
      i[o] = d.data;
    }
    return { valid: !0, data: i };
  } else if (r === p.array && n === p.array) {
    if (t.length !== e.length) return { valid: !1 };
    let s = [];
    for (let a = 0; a < t.length; a++) {
      let i = t[a],
        o = e[a],
        d = lr(i, o);
      if (!d.valid) return { valid: !1 };
      s.push(d.data);
    }
    return { valid: !0, data: s };
  } else
    return r === p.date && n === p.date && +t == +e
      ? { valid: !0, data: t }
      : { valid: !1 };
}
var be = class extends E {
  _parse(e) {
    let { status: r, ctx: n } = this._processInputParams(e),
      s = (a, i) => {
        if (dr(a) || dr(i)) return _;
        let o = lr(a.value, i.value);
        return o.valid
          ? ((ur(a) || ur(i)) && r.dirty(), { status: r.value, value: o.data })
          : (h(n, { code: l.invalid_intersection_types }), _);
      };
    return n.common.async
      ? Promise.all([
          this._def.left._parseAsync({ data: n.data, path: n.path, parent: n }),
          this._def.right._parseAsync({
            data: n.data,
            path: n.path,
            parent: n,
          }),
        ]).then(([a, i]) => s(a, i))
      : s(
          this._def.left._parseSync({ data: n.data, path: n.path, parent: n }),
          this._def.right._parseSync({ data: n.data, path: n.path, parent: n })
        );
  }
};
be.create = (t, e, r) =>
  new be({ left: t, right: e, typeName: g.ZodIntersection, ...x(r) });
var Y = class extends E {
  _parse(e) {
    let { status: r, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== p.array)
      return (
        h(n, {
          code: l.invalid_type,
          expected: p.array,
          received: n.parsedType,
        }),
        _
      );
    if (n.data.length < this._def.items.length)
      return (
        h(n, {
          code: l.too_small,
          minimum: this._def.items.length,
          inclusive: !0,
          exact: !1,
          type: "array",
        }),
        _
      );
    !this._def.rest &&
      n.data.length > this._def.items.length &&
      (h(n, {
        code: l.too_big,
        maximum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array",
      }),
      r.dirty());
    let a = [...n.data]
      .map((i, o) => {
        let d = this._def.items[o] || this._def.rest;
        return d ? d._parse(new X(n, i, n.path, o)) : null;
      })
      .filter((i) => !!i);
    return n.common.async
      ? Promise.all(a).then((i) => U.mergeArray(r, i))
      : U.mergeArray(r, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Y({ ...this._def, rest: e });
  }
};
Y.create = (t, e) => {
  if (!Array.isArray(t))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Y({ items: t, typeName: g.ZodTuple, rest: null, ...x(e) });
};
var Se = class extends E {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(e) {
      let { status: r, ctx: n } = this._processInputParams(e);
      if (n.parsedType !== p.object)
        return (
          h(n, {
            code: l.invalid_type,
            expected: p.object,
            received: n.parsedType,
          }),
          _
        );
      let s = [],
        a = this._def.keyType,
        i = this._def.valueType;
      for (let o in n.data)
        s.push({
          key: a._parse(new X(n, o, n.path, o)),
          value: i._parse(new X(n, n.data[o], n.path, o)),
        });
      return n.common.async
        ? U.mergeObjectAsync(r, s)
        : U.mergeObjectSync(r, s);
    }
    get element() {
      return this._def.valueType;
    }
    static create(e, r, n) {
      return r instanceof E
        ? new Se({ keyType: e, valueType: r, typeName: g.ZodRecord, ...x(n) })
        : new Se({
            keyType: F.create(),
            valueType: e,
            typeName: g.ZodRecord,
            ...x(r),
          });
    }
  },
  Ve = class extends E {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(e) {
      let { status: r, ctx: n } = this._processInputParams(e);
      if (n.parsedType !== p.map)
        return (
          h(n, {
            code: l.invalid_type,
            expected: p.map,
            received: n.parsedType,
          }),
          _
        );
      let s = this._def.keyType,
        a = this._def.valueType,
        i = [...n.data.entries()].map(([o, d], c) => ({
          key: s._parse(new X(n, o, n.path, [c, "key"])),
          value: a._parse(new X(n, d, n.path, [c, "value"])),
        }));
      if (n.common.async) {
        let o = new Map();
        return Promise.resolve().then(async () => {
          for (let d of i) {
            let c = await d.key,
              u = await d.value;
            if (c.status === "aborted" || u.status === "aborted") return _;
            (c.status === "dirty" || u.status === "dirty") && r.dirty(),
              o.set(c.value, u.value);
          }
          return { status: r.value, value: o };
        });
      } else {
        let o = new Map();
        for (let d of i) {
          let c = d.key,
            u = d.value;
          if (c.status === "aborted" || u.status === "aborted") return _;
          (c.status === "dirty" || u.status === "dirty") && r.dirty(),
            o.set(c.value, u.value);
        }
        return { status: r.value, value: o };
      }
    }
  };
Ve.create = (t, e, r) =>
  new Ve({ valueType: e, keyType: t, typeName: g.ZodMap, ...x(r) });
var de = class extends E {
  _parse(e) {
    let { status: r, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== p.set)
      return (
        h(n, { code: l.invalid_type, expected: p.set, received: n.parsedType }),
        _
      );
    let s = this._def;
    s.minSize !== null &&
      n.data.size < s.minSize.value &&
      (h(n, {
        code: l.too_small,
        minimum: s.minSize.value,
        type: "set",
        inclusive: !0,
        exact: !1,
        message: s.minSize.message,
      }),
      r.dirty()),
      s.maxSize !== null &&
        n.data.size > s.maxSize.value &&
        (h(n, {
          code: l.too_big,
          maximum: s.maxSize.value,
          type: "set",
          inclusive: !0,
          exact: !1,
          message: s.maxSize.message,
        }),
        r.dirty());
    let a = this._def.valueType;
    function i(d) {
      let c = new Set();
      for (let u of d) {
        if (u.status === "aborted") return _;
        u.status === "dirty" && r.dirty(), c.add(u.value);
      }
      return { status: r.value, value: c };
    }
    let o = [...n.data.values()].map((d, c) =>
      a._parse(new X(n, d, n.path, c))
    );
    return n.common.async ? Promise.all(o).then((d) => i(d)) : i(o);
  }
  min(e, r) {
    return new de({
      ...this._def,
      minSize: { value: e, message: y.toString(r) },
    });
  }
  max(e, r) {
    return new de({
      ...this._def,
      maxSize: { value: e, message: y.toString(r) },
    });
  }
  size(e, r) {
    return this.min(e, r).max(e, r);
  }
  nonempty(e) {
    return this.min(1, e);
  }
};
de.create = (t, e) =>
  new de({
    valueType: t,
    minSize: null,
    maxSize: null,
    typeName: g.ZodSet,
    ...x(e),
  });
var fe = class extends E {
    constructor() {
      super(...arguments), (this.validate = this.implement);
    }
    _parse(e) {
      let { ctx: r } = this._processInputParams(e);
      if (r.parsedType !== p.function)
        return (
          h(r, {
            code: l.invalid_type,
            expected: p.function,
            received: r.parsedType,
          }),
          _
        );
      function n(o, d) {
        return Pt({
          data: o,
          path: r.path,
          errorMaps: [
            r.common.contextualErrorMap,
            r.schemaErrorMap,
            Rt(),
            ct,
          ].filter((c) => !!c),
          issueData: { code: l.invalid_arguments, argumentsError: d },
        });
      }
      function s(o, d) {
        return Pt({
          data: o,
          path: r.path,
          errorMaps: [
            r.common.contextualErrorMap,
            r.schemaErrorMap,
            Rt(),
            ct,
          ].filter((c) => !!c),
          issueData: { code: l.invalid_return_type, returnTypeError: d },
        });
      }
      let a = { errorMap: r.common.contextualErrorMap },
        i = r.data;
      if (this._def.returns instanceof ye) {
        let o = this;
        return V(async function (...d) {
          let c = new G([]),
            u = await o._def.args.parseAsync(d, a).catch((S) => {
              throw (c.addIssue(n(d, S)), c);
            }),
            m = await Reflect.apply(i, this, u);
          return await o._def.returns._def.type.parseAsync(m, a).catch((S) => {
            throw (c.addIssue(s(m, S)), c);
          });
        });
      } else {
        let o = this;
        return V(function (...d) {
          let c = o._def.args.safeParse(d, a);
          if (!c.success) throw new G([n(d, c.error)]);
          let u = Reflect.apply(i, this, c.data),
            m = o._def.returns.safeParse(u, a);
          if (!m.success) throw new G([s(u, m.error)]);
          return m.data;
        });
      }
    }
    parameters() {
      return this._def.args;
    }
    returnType() {
      return this._def.returns;
    }
    args(...e) {
      return new fe({ ...this._def, args: Y.create(e).rest(oe.create()) });
    }
    returns(e) {
      return new fe({ ...this._def, returns: e });
    }
    implement(e) {
      return this.parse(e);
    }
    strictImplement(e) {
      return this.parse(e);
    }
    static create(e, r, n) {
      return new fe({
        args: e || Y.create([]).rest(oe.create()),
        returns: r || oe.create(),
        typeName: g.ZodFunction,
        ...x(n),
      });
    }
  },
  Ae = class extends E {
    get schema() {
      return this._def.getter();
    }
    _parse(e) {
      let { ctx: r } = this._processInputParams(e);
      return this._def
        .getter()
        ._parse({ data: r.data, path: r.path, parent: r });
    }
  };
Ae.create = (t, e) => new Ae({ getter: t, typeName: g.ZodLazy, ...x(e) });
var Ce = class extends E {
  _parse(e) {
    if (e.data !== this._def.value) {
      let r = this._getOrReturnCtx(e);
      return (
        h(r, {
          received: r.data,
          code: l.invalid_literal,
          expected: this._def.value,
        }),
        _
      );
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
};
Ce.create = (t, e) => new Ce({ value: t, typeName: g.ZodLiteral, ...x(e) });
function tn(t, e) {
  return new ae({ values: t, typeName: g.ZodEnum, ...x(e) });
}
var ae = class extends E {
  _parse(e) {
    if (typeof e.data != "string") {
      let r = this._getOrReturnCtx(e),
        n = this._def.values;
      return (
        h(r, {
          expected: A.joinValues(n),
          received: r.parsedType,
          code: l.invalid_type,
        }),
        _
      );
    }
    if (this._def.values.indexOf(e.data) === -1) {
      let r = this._getOrReturnCtx(e),
        n = this._def.values;
      return (
        h(r, { received: r.data, code: l.invalid_enum_value, options: n }), _
      );
    }
    return V(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    let e = {};
    for (let r of this._def.values) e[r] = r;
    return e;
  }
  get Values() {
    let e = {};
    for (let r of this._def.values) e[r] = r;
    return e;
  }
  get Enum() {
    let e = {};
    for (let r of this._def.values) e[r] = r;
    return e;
  }
  extract(e) {
    return ae.create(e);
  }
  exclude(e) {
    return ae.create(this.options.filter((r) => !e.includes(r)));
  }
};
ae.create = tn;
var Te = class extends E {
  _parse(e) {
    let r = A.getValidEnumValues(this._def.values),
      n = this._getOrReturnCtx(e);
    if (n.parsedType !== p.string && n.parsedType !== p.number) {
      let s = A.objectValues(r);
      return (
        h(n, {
          expected: A.joinValues(s),
          received: n.parsedType,
          code: l.invalid_type,
        }),
        _
      );
    }
    if (r.indexOf(e.data) === -1) {
      let s = A.objectValues(r);
      return (
        h(n, { received: n.data, code: l.invalid_enum_value, options: s }), _
      );
    }
    return V(e.data);
  }
  get enum() {
    return this._def.values;
  }
};
Te.create = (t, e) => new Te({ values: t, typeName: g.ZodNativeEnum, ...x(e) });
var ye = class extends E {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    let { ctx: r } = this._processInputParams(e);
    if (r.parsedType !== p.promise && r.common.async === !1)
      return (
        h(r, {
          code: l.invalid_type,
          expected: p.promise,
          received: r.parsedType,
        }),
        _
      );
    let n = r.parsedType === p.promise ? r.data : Promise.resolve(r.data);
    return V(
      n.then((s) =>
        this._def.type.parseAsync(s, {
          path: r.path,
          errorMap: r.common.contextualErrorMap,
        })
      )
    );
  }
};
ye.create = (t, e) => new ye({ type: t, typeName: g.ZodPromise, ...x(e) });
var q = class extends E {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === g.ZodEffects
      ? this._def.schema.sourceType()
      : this._def.schema;
  }
  _parse(e) {
    let { status: r, ctx: n } = this._processInputParams(e),
      s = this._def.effect || null,
      a = {
        addIssue: (i) => {
          h(n, i), i.fatal ? r.abort() : r.dirty();
        },
        get path() {
          return n.path;
        },
      };
    if (((a.addIssue = a.addIssue.bind(a)), s.type === "preprocess")) {
      let i = s.transform(n.data, a);
      return n.common.issues.length
        ? { status: "dirty", value: n.data }
        : n.common.async
          ? Promise.resolve(i).then((o) =>
              this._def.schema._parseAsync({ data: o, path: n.path, parent: n })
            )
          : this._def.schema._parseSync({ data: i, path: n.path, parent: n });
    }
    if (s.type === "refinement") {
      let i = (o) => {
        let d = s.refinement(o, a);
        if (n.common.async) return Promise.resolve(d);
        if (d instanceof Promise)
          throw new Error(
            "Async refinement encountered during synchronous parse operation. Use .parseAsync instead."
          );
        return o;
      };
      if (n.common.async === !1) {
        let o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n,
        });
        return o.status === "aborted"
          ? _
          : (o.status === "dirty" && r.dirty(),
            i(o.value),
            { status: r.value, value: o.value });
      } else
        return this._def.schema
          ._parseAsync({ data: n.data, path: n.path, parent: n })
          .then((o) =>
            o.status === "aborted"
              ? _
              : (o.status === "dirty" && r.dirty(),
                i(o.value).then(() => ({ status: r.value, value: o.value })))
          );
    }
    if (s.type === "transform")
      if (n.common.async === !1) {
        let i = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n,
        });
        if (!dt(i)) return i;
        let o = s.transform(i.value, a);
        if (o instanceof Promise)
          throw new Error(
            "Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead."
          );
        return { status: r.value, value: o };
      } else
        return this._def.schema
          ._parseAsync({ data: n.data, path: n.path, parent: n })
          .then((i) =>
            dt(i)
              ? Promise.resolve(s.transform(i.value, a)).then((o) => ({
                  status: r.value,
                  value: o,
                }))
              : i
          );
    A.assertNever(s);
  }
};
q.create = (t, e, r) =>
  new q({ schema: t, typeName: g.ZodEffects, effect: e, ...x(r) });
q.createWithPreprocess = (t, e, r) =>
  new q({
    schema: e,
    effect: { type: "preprocess", transform: t },
    typeName: g.ZodEffects,
    ...x(r),
  });
var te = class extends E {
  _parse(e) {
    return this._getType(e) === p.undefined
      ? V(void 0)
      : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
};
te.create = (t, e) =>
  new te({ innerType: t, typeName: g.ZodOptional, ...x(e) });
var ue = class extends E {
  _parse(e) {
    return this._getType(e) === p.null
      ? V(null)
      : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ue.create = (t, e) =>
  new ue({ innerType: t, typeName: g.ZodNullable, ...x(e) });
var He = class extends E {
  _parse(e) {
    let { ctx: r } = this._processInputParams(e),
      n = r.data;
    return (
      r.parsedType === p.undefined && (n = this._def.defaultValue()),
      this._def.innerType._parse({ data: n, path: r.path, parent: r })
    );
  }
  removeDefault() {
    return this._def.innerType;
  }
};
He.create = (t, e) =>
  new He({
    innerType: t,
    typeName: g.ZodDefault,
    defaultValue: typeof e.default == "function" ? e.default : () => e.default,
    ...x(e),
  });
var ze = class extends E {
  _parse(e) {
    let { ctx: r } = this._processInputParams(e),
      n = { ...r, common: { ...r.common, issues: [] } },
      s = this._def.innerType._parse({
        data: n.data,
        path: n.path,
        parent: { ...n },
      });
    return kt(s)
      ? s.then((a) => ({
          status: "valid",
          value:
            a.status === "valid"
              ? a.value
              : this._def.catchValue({
                  get error() {
                    return new G(n.common.issues);
                  },
                  input: n.data,
                }),
        }))
      : {
          status: "valid",
          value:
            s.status === "valid"
              ? s.value
              : this._def.catchValue({
                  get error() {
                    return new G(n.common.issues);
                  },
                  input: n.data,
                }),
        };
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ze.create = (t, e) =>
  new ze({
    innerType: t,
    typeName: g.ZodCatch,
    catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
    ...x(e),
  });
var je = class extends E {
  _parse(e) {
    if (this._getType(e) !== p.nan) {
      let n = this._getOrReturnCtx(e);
      return (
        h(n, { code: l.invalid_type, expected: p.nan, received: n.parsedType }),
        _
      );
    }
    return { status: "valid", value: e.data };
  }
};
je.create = (t) => new je({ typeName: g.ZodNaN, ...x(t) });
var bs = Symbol("zod_brand"),
  Kt = class extends E {
    _parse(e) {
      let { ctx: r } = this._processInputParams(e),
        n = r.data;
      return this._def.type._parse({ data: n, path: r.path, parent: r });
    }
    unwrap() {
      return this._def.type;
    }
  },
  Re = class extends E {
    _parse(e) {
      let { status: r, ctx: n } = this._processInputParams(e);
      if (n.common.async)
        return (async () => {
          let a = await this._def.in._parseAsync({
            data: n.data,
            path: n.path,
            parent: n,
          });
          return a.status === "aborted"
            ? _
            : a.status === "dirty"
              ? (r.dirty(), en(a.value))
              : this._def.out._parseAsync({
                  data: a.value,
                  path: n.path,
                  parent: n,
                });
        })();
      {
        let s = this._def.in._parseSync({
          data: n.data,
          path: n.path,
          parent: n,
        });
        return s.status === "aborted"
          ? _
          : s.status === "dirty"
            ? (r.dirty(), { status: "dirty", value: s.value })
            : this._def.out._parseSync({
                data: s.value,
                path: n.path,
                parent: n,
              });
      }
    }
    static create(e, r) {
      return new Re({ in: e, out: r, typeName: g.ZodPipeline });
    }
  },
  Fe = class extends E {
    _parse(e) {
      let r = this._def.innerType._parse(e);
      return dt(r) && (r.value = Object.freeze(r.value)), r;
    }
  };
Fe.create = (t, e) =>
  new Fe({ innerType: t, typeName: g.ZodReadonly, ...x(e) });
var rn = (t, e = {}, r) =>
    t
      ? me.create().superRefine((n, s) => {
          var a, i;
          if (!t(n)) {
            let o =
                typeof e == "function"
                  ? e(n)
                  : typeof e == "string"
                    ? { message: e }
                    : e,
              d =
                (i = (a = o.fatal) !== null && a !== void 0 ? a : r) !== null &&
                i !== void 0
                  ? i
                  : !0,
              c = typeof o == "string" ? { message: o } : o;
            s.addIssue({ code: "custom", ...c, fatal: d });
          }
        })
      : me.create(),
  Ss = { object: R.lazycreate },
  g;
(function (t) {
  (t.ZodString = "ZodString"),
    (t.ZodNumber = "ZodNumber"),
    (t.ZodNaN = "ZodNaN"),
    (t.ZodBigInt = "ZodBigInt"),
    (t.ZodBoolean = "ZodBoolean"),
    (t.ZodDate = "ZodDate"),
    (t.ZodSymbol = "ZodSymbol"),
    (t.ZodUndefined = "ZodUndefined"),
    (t.ZodNull = "ZodNull"),
    (t.ZodAny = "ZodAny"),
    (t.ZodUnknown = "ZodUnknown"),
    (t.ZodNever = "ZodNever"),
    (t.ZodVoid = "ZodVoid"),
    (t.ZodArray = "ZodArray"),
    (t.ZodObject = "ZodObject"),
    (t.ZodUnion = "ZodUnion"),
    (t.ZodDiscriminatedUnion = "ZodDiscriminatedUnion"),
    (t.ZodIntersection = "ZodIntersection"),
    (t.ZodTuple = "ZodTuple"),
    (t.ZodRecord = "ZodRecord"),
    (t.ZodMap = "ZodMap"),
    (t.ZodSet = "ZodSet"),
    (t.ZodFunction = "ZodFunction"),
    (t.ZodLazy = "ZodLazy"),
    (t.ZodLiteral = "ZodLiteral"),
    (t.ZodEnum = "ZodEnum"),
    (t.ZodEffects = "ZodEffects"),
    (t.ZodNativeEnum = "ZodNativeEnum"),
    (t.ZodOptional = "ZodOptional"),
    (t.ZodNullable = "ZodNullable"),
    (t.ZodDefault = "ZodDefault"),
    (t.ZodCatch = "ZodCatch"),
    (t.ZodPromise = "ZodPromise"),
    (t.ZodBranded = "ZodBranded"),
    (t.ZodPipeline = "ZodPipeline"),
    (t.ZodReadonly = "ZodReadonly");
})(g || (g = {}));
var As = (t, e = { message: `Input not instance of ${t.name}` }) =>
    rn((r) => r instanceof t, e),
  nn = F.create,
  sn = ne.create,
  Cs = je.create,
  Ts = se.create,
  an = _e.create,
  Hs = ce.create,
  Rs = $e.create,
  Ps = ve.create,
  ks = xe.create,
  Ks = me.create,
  Is = oe.create,
  Os = re.create,
  Ws = Le.create,
  Ds = Z.create,
  Js = R.create,
  Ns = R.strictCreate,
  Ms = Ee.create,
  Us = Be.create,
  $s = be.create,
  Ls = Y.create,
  Bs = Se.create,
  Vs = Ve.create,
  zs = de.create,
  js = fe.create,
  Fs = Ae.create,
  Gs = Ce.create,
  Zs = ae.create,
  qs = Te.create,
  Xs = ye.create,
  Yr = q.create,
  Ys = te.create,
  Qs = ue.create,
  ea = q.createWithPreprocess,
  ta = Re.create,
  ra = () => nn().optional(),
  na = () => sn().optional(),
  sa = () => an().optional(),
  aa = {
    string: (t) => F.create({ ...t, coerce: !0 }),
    number: (t) => ne.create({ ...t, coerce: !0 }),
    boolean: (t) => _e.create({ ...t, coerce: !0 }),
    bigint: (t) => se.create({ ...t, coerce: !0 }),
    date: (t) => ce.create({ ...t, coerce: !0 }),
  },
  ia = _,
  I = Object.freeze({
    __proto__: null,
    defaultErrorMap: ct,
    setErrorMap: us,
    getErrorMap: Rt,
    makeIssue: Pt,
    EMPTY_PATH: ls,
    addIssueToContext: h,
    ParseStatus: U,
    INVALID: _,
    DIRTY: en,
    OK: V,
    isAborted: dr,
    isDirty: ur,
    isValid: dt,
    isAsync: kt,
    get util() {
      return A;
    },
    get objectUtil() {
      return cr;
    },
    ZodParsedType: p,
    getParsedType: he,
    ZodType: E,
    ZodString: F,
    ZodNumber: ne,
    ZodBigInt: se,
    ZodBoolean: _e,
    ZodDate: ce,
    ZodSymbol: $e,
    ZodUndefined: ve,
    ZodNull: xe,
    ZodAny: me,
    ZodUnknown: oe,
    ZodNever: re,
    ZodVoid: Le,
    ZodArray: Z,
    ZodObject: R,
    ZodUnion: Ee,
    ZodDiscriminatedUnion: Be,
    ZodIntersection: be,
    ZodTuple: Y,
    ZodRecord: Se,
    ZodMap: Ve,
    ZodSet: de,
    ZodFunction: fe,
    ZodLazy: Ae,
    ZodLiteral: Ce,
    ZodEnum: ae,
    ZodNativeEnum: Te,
    ZodPromise: ye,
    ZodEffects: q,
    ZodTransformer: q,
    ZodOptional: te,
    ZodNullable: ue,
    ZodDefault: He,
    ZodCatch: ze,
    ZodNaN: je,
    BRAND: bs,
    ZodBranded: Kt,
    ZodPipeline: Re,
    ZodReadonly: Fe,
    custom: rn,
    Schema: E,
    ZodSchema: E,
    late: Ss,
    get ZodFirstPartyTypeKind() {
      return g;
    },
    coerce: aa,
    any: Ks,
    array: Ds,
    bigint: Ts,
    boolean: an,
    date: Hs,
    discriminatedUnion: Us,
    effect: Yr,
    enum: Zs,
    function: js,
    instanceof: As,
    intersection: $s,
    lazy: Fs,
    literal: Gs,
    map: Vs,
    nan: Cs,
    nativeEnum: qs,
    never: Os,
    null: ks,
    nullable: Qs,
    number: sn,
    object: Js,
    oboolean: sa,
    onumber: na,
    optional: Ys,
    ostring: ra,
    pipeline: ta,
    preprocess: ea,
    promise: Xs,
    record: Bs,
    set: zs,
    strictObject: Ns,
    string: nn,
    symbol: Rs,
    transformer: Yr,
    tuple: Ls,
    undefined: Ps,
    union: Ms,
    unknown: Is,
    void: Ws,
    NEVER: ia,
    ZodIssueCode: l,
    quotelessJson: ds,
    ZodError: G,
  });
var pr = async (t, e) =>
  await fetch("https://www.thebluealliance.com/api/v3" + t, {
    headers: { "x-tba-auth-key": e },
  }).then((r) => r.json());
var on = () =>
    I.object({
      key: I.string(),
      team_number: I.number(),
      nickname: I.string().optional(),
      name: I.string(),
      city: I.string(),
      state_prov: I.string(),
      country: I.string(),
    }),
  cn = () =>
    I.object({ key: I.string(), name: I.string(), event_code: I.string() });
var dn = async (t, e) => {
  let r = await pr(`/event/${e}/`, e).then((a) => cn().parse(a));
  t.env.DB.prepare(
    "INSERT INTO Events (eventKey, eventName) VALUES (?, ?)"
  ).bind(r.key, r.name);
  let n = await pr(`/event/${e}/teams/simple`, e).then((a) =>
      on().array().parse(a)
    ),
    s = await t.env.DB.batch(
      n.map((a) =>
        t.env.DB.prepare(
          "INSERT INTO Teams (teamKey, teamNumber, nickname) VALUES (?, ?, ?)"
        ).bind(a.key, a.team_number, a.nickname ?? a.name)
      )
    );
};
var un = async (t) => {
  let { id: e } = t.req.param();
  return I.string()
    .array()
    .parse(
      (
        await t.env.DB.prepare("SELECT eventKey FROM Events").all()
      ).results.flat()
    )
    .includes(e)
    ? t.text(`Event ${e} already imported`)
    : (dn(t, e), t.json({}));
};
var w = crypto,
  O = (t) => t instanceof CryptoKey;
var oa = async (t, e) => {
    let r = `SHA-${t.slice(-3)}`;
    return new Uint8Array(await w.subtle.digest(r, e));
  },
  hr = oa;
var M = new TextEncoder(),
  B = new TextDecoder(),
  It = 2 ** 32;
function z(...t) {
  let e = t.reduce((s, { length: a }) => s + a, 0),
    r = new Uint8Array(e),
    n = 0;
  return (
    t.forEach((s) => {
      r.set(s, n), (n += s.length);
    }),
    r
  );
}
function ln(t, e) {
  return z(M.encode(t), new Uint8Array([0]), e);
}
function fr(t, e, r) {
  if (e < 0 || e >= It)
    throw new RangeError(`value must be >= 0 and <= ${It - 1}. Received ${e}`);
  t.set([e >>> 24, e >>> 16, e >>> 8, e & 255], r);
}
function Ot(t) {
  let e = Math.floor(t / It),
    r = t % It,
    n = new Uint8Array(8);
  return fr(n, e, 0), fr(n, r, 4), n;
}
function Wt(t) {
  let e = new Uint8Array(4);
  return fr(e, t), e;
}
function Dt(t) {
  return z(Wt(t.length), t);
}
async function pn(t, e, r) {
  let n = Math.ceil((e >> 3) / 32),
    s = new Uint8Array(n * 32);
  for (let a = 0; a < n; a++) {
    let i = new Uint8Array(4 + t.length + r.length);
    i.set(Wt(a + 1)),
      i.set(t, 4),
      i.set(r, 4 + t.length),
      s.set(await hr("sha256", i), a * 32);
  }
  return s.slice(0, e >> 3);
}
var hn = (t) => {
    let e = t;
    typeof e == "string" && (e = M.encode(e));
    let r = 32768,
      n = [];
    for (let s = 0; s < e.length; s += r)
      n.push(String.fromCharCode.apply(null, e.subarray(s, s + r)));
    return btoa(n.join(""));
  },
  k = (t) => hn(t).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"),
  fn = (t) => {
    let e = atob(t),
      r = new Uint8Array(e.length);
    for (let n = 0; n < e.length; n++) r[n] = e.charCodeAt(n);
    return r;
  },
  D = (t) => {
    let e = t;
    e instanceof Uint8Array && (e = B.decode(e)),
      (e = e.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, ""));
    try {
      return fn(e);
    } catch {
      throw new TypeError("The input to be decoded is not correctly encoded.");
    }
  };
var ie = class extends Error {
    static get code() {
      return "ERR_JOSE_GENERIC";
    }
    constructor(e) {
      var r;
      super(e),
        (this.code = "ERR_JOSE_GENERIC"),
        (this.name = this.constructor.name),
        (r = Error.captureStackTrace) === null ||
          r === void 0 ||
          r.call(Error, this, this.constructor);
    }
  },
  L = class extends ie {
    static get code() {
      return "ERR_JWT_CLAIM_VALIDATION_FAILED";
    }
    constructor(e, r = "unspecified", n = "unspecified") {
      super(e),
        (this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED"),
        (this.claim = r),
        (this.reason = n);
    }
  },
  ut = class extends ie {
    static get code() {
      return "ERR_JWT_EXPIRED";
    }
    constructor(e, r = "unspecified", n = "unspecified") {
      super(e),
        (this.code = "ERR_JWT_EXPIRED"),
        (this.claim = r),
        (this.reason = n);
    }
  },
  Ge = class extends ie {
    constructor() {
      super(...arguments), (this.code = "ERR_JOSE_ALG_NOT_ALLOWED");
    }
    static get code() {
      return "ERR_JOSE_ALG_NOT_ALLOWED";
    }
  },
  v = class extends ie {
    constructor() {
      super(...arguments), (this.code = "ERR_JOSE_NOT_SUPPORTED");
    }
    static get code() {
      return "ERR_JOSE_NOT_SUPPORTED";
    }
  },
  Pe = class extends ie {
    constructor() {
      super(...arguments),
        (this.code = "ERR_JWE_DECRYPTION_FAILED"),
        (this.message = "decryption operation failed");
    }
    static get code() {
      return "ERR_JWE_DECRYPTION_FAILED";
    }
  },
  f = class extends ie {
    constructor() {
      super(...arguments), (this.code = "ERR_JWE_INVALID");
    }
    static get code() {
      return "ERR_JWE_INVALID";
    }
  };
var ge = class extends ie {
  constructor() {
    super(...arguments), (this.code = "ERR_JWT_INVALID");
  }
  static get code() {
    return "ERR_JWT_INVALID";
  }
};
var ke = w.getRandomValues.bind(w);
function mr(t) {
  switch (t) {
    case "A128GCM":
    case "A128GCMKW":
    case "A192GCM":
    case "A192GCMKW":
    case "A256GCM":
    case "A256GCMKW":
      return 96;
    case "A128CBC-HS256":
    case "A192CBC-HS384":
    case "A256CBC-HS512":
      return 128;
    default:
      throw new v(`Unsupported JWE Algorithm: ${t}`);
  }
}
var Jt = (t) => ke(new Uint8Array(mr(t) >> 3));
var da = (t, e) => {
    if (e.length << 3 !== mr(t))
      throw new f("Invalid Initialization Vector length");
  },
  Nt = da;
var ua = (t, e) => {
    let r = t.byteLength << 3;
    if (r !== e)
      throw new f(
        `Invalid Content Encryption Key length. Expected ${e} bits, got ${r} bits`
      );
  },
  Ze = ua;
var la = (t, e) => {
    if (!(t instanceof Uint8Array))
      throw new TypeError("First argument must be a buffer");
    if (!(e instanceof Uint8Array))
      throw new TypeError("Second argument must be a buffer");
    if (t.length !== e.length)
      throw new TypeError("Input buffers must have the same length");
    let r = t.length,
      n = 0,
      s = -1;
    for (; ++s < r; ) n |= t[s] ^ e[s];
    return n === 0;
  },
  yn = la;
function we(t, e = "algorithm.name") {
  return new TypeError(
    `CryptoKey does not support this operation, its ${e} must be ${t}`
  );
}
function Mt(t, e) {
  return t.name === e;
}
function pa(t) {
  return parseInt(t.name.slice(4), 10);
}
function ha(t, e) {
  if (e.length && !e.some((r) => t.usages.includes(r))) {
    let r =
      "CryptoKey does not support this operation, its usages must include ";
    if (e.length > 2) {
      let n = e.pop();
      r += `one of ${e.join(", ")}, or ${n}.`;
    } else
      e.length === 2 ? (r += `one of ${e[0]} or ${e[1]}.`) : (r += `${e[0]}.`);
    throw new TypeError(r);
  }
}
function j(t, e, ...r) {
  switch (e) {
    case "A128GCM":
    case "A192GCM":
    case "A256GCM": {
      if (!Mt(t.algorithm, "AES-GCM")) throw we("AES-GCM");
      let n = parseInt(e.slice(1, 4), 10);
      if (t.algorithm.length !== n) throw we(n, "algorithm.length");
      break;
    }
    case "A128KW":
    case "A192KW":
    case "A256KW": {
      if (!Mt(t.algorithm, "AES-KW")) throw we("AES-KW");
      let n = parseInt(e.slice(1, 4), 10);
      if (t.algorithm.length !== n) throw we(n, "algorithm.length");
      break;
    }
    case "ECDH": {
      switch (t.algorithm.name) {
        case "ECDH":
        case "X25519":
        case "X448":
          break;
        default:
          throw we("ECDH, X25519, or X448");
      }
      break;
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW":
      if (!Mt(t.algorithm, "PBKDF2")) throw we("PBKDF2");
      break;
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512": {
      if (!Mt(t.algorithm, "RSA-OAEP")) throw we("RSA-OAEP");
      let n = parseInt(e.slice(9), 10) || 1;
      if (pa(t.algorithm.hash) !== n) throw we(`SHA-${n}`, "algorithm.hash");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  ha(t, r);
}
function gn(t, e, ...r) {
  if (r.length > 2) {
    let n = r.pop();
    t += `one of type ${r.join(", ")}, or ${n}.`;
  } else
    r.length === 2
      ? (t += `one of type ${r[0]} or ${r[1]}.`)
      : (t += `of type ${r[0]}.`);
  return (
    e == null
      ? (t += ` Received ${e}`)
      : typeof e == "function" && e.name
        ? (t += ` Received function ${e.name}`)
        : typeof e == "object" &&
          e != null &&
          e.constructor &&
          e.constructor.name &&
          (t += ` Received an instance of ${e.constructor.name}`),
    t
  );
}
var W = (t, ...e) => gn("Key must be ", t, ...e);
function yr(t, e, ...r) {
  return gn(`Key for the ${t} algorithm must be `, e, ...r);
}
var gr = (t) => O(t),
  C = ["CryptoKey"];
async function fa(t, e, r, n, s, a) {
  if (!(e instanceof Uint8Array)) throw new TypeError(W(e, "Uint8Array"));
  let i = parseInt(t.slice(1, 4), 10),
    o = await w.subtle.importKey("raw", e.subarray(i >> 3), "AES-CBC", !1, [
      "decrypt",
    ]),
    d = await w.subtle.importKey(
      "raw",
      e.subarray(0, i >> 3),
      { hash: `SHA-${i << 1}`, name: "HMAC" },
      !1,
      ["sign"]
    ),
    c = z(a, n, r, Ot(a.length << 3)),
    u = new Uint8Array((await w.subtle.sign("HMAC", d, c)).slice(0, i >> 3)),
    m;
  try {
    m = yn(s, u);
  } catch {}
  if (!m) throw new Pe();
  let b;
  try {
    b = new Uint8Array(
      await w.subtle.decrypt({ iv: n, name: "AES-CBC" }, o, r)
    );
  } catch {}
  if (!b) throw new Pe();
  return b;
}
async function ma(t, e, r, n, s, a) {
  let i;
  e instanceof Uint8Array
    ? (i = await w.subtle.importKey("raw", e, "AES-GCM", !1, ["decrypt"]))
    : (j(e, t, "decrypt"), (i = e));
  try {
    return new Uint8Array(
      await w.subtle.decrypt(
        { additionalData: a, iv: n, name: "AES-GCM", tagLength: 128 },
        i,
        z(r, s)
      )
    );
  } catch {
    throw new Pe();
  }
}
var ya = async (t, e, r, n, s, a) => {
    if (!O(e) && !(e instanceof Uint8Array))
      throw new TypeError(W(e, ...C, "Uint8Array"));
    switch ((Nt(t, n), t)) {
      case "A128CBC-HS256":
      case "A192CBC-HS384":
      case "A256CBC-HS512":
        return (
          e instanceof Uint8Array && Ze(e, parseInt(t.slice(-3), 10)),
          fa(t, e, r, n, s, a)
        );
      case "A128GCM":
      case "A192GCM":
      case "A256GCM":
        return (
          e instanceof Uint8Array && Ze(e, parseInt(t.slice(1, 4), 10)),
          ma(t, e, r, n, s, a)
        );
      default:
        throw new v("Unsupported JWE Content Encryption Algorithm");
    }
  },
  Ut = ya;
var wn = async () => {
    throw new v(
      'JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `inflateRaw` decrypt option to provide Inflate Raw implementation.'
    );
  },
  _n = async () => {
    throw new v(
      'JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `deflateRaw` encrypt option to provide Deflate Raw implementation.'
    );
  };
var ga = (...t) => {
    let e = t.filter(Boolean);
    if (e.length === 0 || e.length === 1) return !0;
    let r;
    for (let n of e) {
      let s = Object.keys(n);
      if (!r || r.size === 0) {
        r = new Set(s);
        continue;
      }
      for (let a of s) {
        if (r.has(a)) return !1;
        r.add(a);
      }
    }
    return !0;
  },
  Ke = ga;
function wa(t) {
  return typeof t == "object" && t !== null;
}
function J(t) {
  if (!wa(t) || Object.prototype.toString.call(t) !== "[object Object]")
    return !1;
  if (Object.getPrototypeOf(t) === null) return !0;
  let e = t;
  for (; Object.getPrototypeOf(e) !== null; ) e = Object.getPrototypeOf(e);
  return Object.getPrototypeOf(t) === e;
}
var _a = [{ hash: "SHA-256", name: "HMAC" }, !0, ["sign"]],
  qe = _a;
function vn(t, e) {
  if (t.algorithm.length !== parseInt(e.slice(1, 4), 10))
    throw new TypeError(`Invalid key size for alg: ${e}`);
}
function xn(t, e, r) {
  if (O(t)) return j(t, e, r), t;
  if (t instanceof Uint8Array)
    return w.subtle.importKey("raw", t, "AES-KW", !0, [r]);
  throw new TypeError(W(t, ...C, "Uint8Array"));
}
var lt = async (t, e, r) => {
    let n = await xn(e, t, "wrapKey");
    vn(n, t);
    let s = await w.subtle.importKey("raw", r, ...qe);
    return new Uint8Array(await w.subtle.wrapKey("raw", s, n, "AES-KW"));
  },
  pt = async (t, e, r) => {
    let n = await xn(e, t, "unwrapKey");
    vn(n, t);
    let s = await w.subtle.unwrapKey("raw", r, n, "AES-KW", ...qe);
    return new Uint8Array(await w.subtle.exportKey("raw", s));
  };
async function $t(t, e, r, n, s = new Uint8Array(0), a = new Uint8Array(0)) {
  if (!O(t)) throw new TypeError(W(t, ...C));
  if ((j(t, "ECDH"), !O(e))) throw new TypeError(W(e, ...C));
  j(e, "ECDH", "deriveBits");
  let i = z(Dt(M.encode(r)), Dt(s), Dt(a), Wt(n)),
    o;
  t.algorithm.name === "X25519"
    ? (o = 256)
    : t.algorithm.name === "X448"
      ? (o = 448)
      : (o =
          Math.ceil(parseInt(t.algorithm.namedCurve.substr(-3), 10) / 8) << 3);
  let d = new Uint8Array(
    await w.subtle.deriveBits({ name: t.algorithm.name, public: t }, e, o)
  );
  return pn(d, n, i);
}
async function En(t) {
  if (!O(t)) throw new TypeError(W(t, ...C));
  return w.subtle.generateKey(t.algorithm, !0, ["deriveBits"]);
}
function Lt(t) {
  if (!O(t)) throw new TypeError(W(t, ...C));
  return (
    ["P-256", "P-384", "P-521"].includes(t.algorithm.namedCurve) ||
    t.algorithm.name === "X25519" ||
    t.algorithm.name === "X448"
  );
}
function wr(t) {
  if (!(t instanceof Uint8Array) || t.length < 8)
    throw new f("PBES2 Salt Input must be 8 or more octets");
}
function va(t, e) {
  if (t instanceof Uint8Array)
    return w.subtle.importKey("raw", t, "PBKDF2", !1, ["deriveBits"]);
  if (O(t)) return j(t, e, "deriveBits", "deriveKey"), t;
  throw new TypeError(W(t, ...C, "Uint8Array"));
}
async function Sn(t, e, r, n) {
  wr(t);
  let s = ln(e, t),
    a = parseInt(e.slice(13, 16), 10),
    i = {
      hash: `SHA-${e.slice(8, 11)}`,
      iterations: r,
      name: "PBKDF2",
      salt: s,
    },
    o = { length: a, name: "AES-KW" },
    d = await va(n, e);
  if (d.usages.includes("deriveBits"))
    return new Uint8Array(await w.subtle.deriveBits(i, d, a));
  if (d.usages.includes("deriveKey"))
    return w.subtle.deriveKey(i, d, o, !1, ["wrapKey", "unwrapKey"]);
  throw new TypeError(
    'PBKDF2 key "usages" must include "deriveBits" or "deriveKey"'
  );
}
var An = async (t, e, r, n = 2048, s = ke(new Uint8Array(16))) => {
    let a = await Sn(s, t, n, e);
    return { encryptedKey: await lt(t.slice(-6), a, r), p2c: n, p2s: k(s) };
  },
  Cn = async (t, e, r, n, s) => {
    let a = await Sn(s, t, n, e);
    return pt(t.slice(-6), a, r);
  };
function Xe(t) {
  switch (t) {
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512":
      return "RSA-OAEP";
    default:
      throw new v(
        `alg ${t} is not supported either by JOSE or your javascript runtime`
      );
  }
}
var ht = (t, e) => {
  if (t.startsWith("RS") || t.startsWith("PS")) {
    let { modulusLength: r } = e.algorithm;
    if (typeof r != "number" || r < 2048)
      throw new TypeError(
        `${t} requires key modulusLength to be 2048 bits or larger`
      );
  }
};
var Tn = async (t, e, r) => {
    if (!O(e)) throw new TypeError(W(e, ...C));
    if ((j(e, t, "encrypt", "wrapKey"), ht(t, e), e.usages.includes("encrypt")))
      return new Uint8Array(await w.subtle.encrypt(Xe(t), e, r));
    if (e.usages.includes("wrapKey")) {
      let n = await w.subtle.importKey("raw", r, ...qe);
      return new Uint8Array(await w.subtle.wrapKey("raw", n, e, Xe(t)));
    }
    throw new TypeError(
      'RSA-OAEP key "usages" must include "encrypt" or "wrapKey" for this operation'
    );
  },
  Hn = async (t, e, r) => {
    if (!O(e)) throw new TypeError(W(e, ...C));
    if (
      (j(e, t, "decrypt", "unwrapKey"), ht(t, e), e.usages.includes("decrypt"))
    )
      return new Uint8Array(await w.subtle.decrypt(Xe(t), e, r));
    if (e.usages.includes("unwrapKey")) {
      let n = await w.subtle.unwrapKey("raw", r, e, Xe(t), ...qe);
      return new Uint8Array(await w.subtle.exportKey("raw", n));
    }
    throw new TypeError(
      'RSA-OAEP key "usages" must include "decrypt" or "unwrapKey" for this operation'
    );
  };
function ft(t) {
  switch (t) {
    case "A128GCM":
      return 128;
    case "A192GCM":
      return 192;
    case "A256GCM":
    case "A128CBC-HS256":
      return 256;
    case "A192CBC-HS384":
      return 384;
    case "A256CBC-HS512":
      return 512;
    default:
      throw new v(`Unsupported JWE Algorithm: ${t}`);
  }
}
var le = (t) => ke(new Uint8Array(ft(t) >> 3));
function xa(t) {
  let e, r;
  switch (t.kty) {
    case "oct": {
      switch (t.alg) {
        case "HS256":
        case "HS384":
        case "HS512":
          (e = { name: "HMAC", hash: `SHA-${t.alg.slice(-3)}` }),
            (r = ["sign", "verify"]);
          break;
        case "A128CBC-HS256":
        case "A192CBC-HS384":
        case "A256CBC-HS512":
          throw new v(
            `${t.alg} keys cannot be imported as CryptoKey instances`
          );
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
        case "A128GCMKW":
        case "A192GCMKW":
        case "A256GCMKW":
          (e = { name: "AES-GCM" }), (r = ["encrypt", "decrypt"]);
          break;
        case "A128KW":
        case "A192KW":
        case "A256KW":
          (e = { name: "AES-KW" }), (r = ["wrapKey", "unwrapKey"]);
          break;
        case "PBES2-HS256+A128KW":
        case "PBES2-HS384+A192KW":
        case "PBES2-HS512+A256KW":
          (e = { name: "PBKDF2" }), (r = ["deriveBits"]);
          break;
        default:
          throw new v(
            'Invalid or unsupported JWK "alg" (Algorithm) Parameter value'
          );
      }
      break;
    }
    case "RSA": {
      switch (t.alg) {
        case "PS256":
        case "PS384":
        case "PS512":
          (e = { name: "RSA-PSS", hash: `SHA-${t.alg.slice(-3)}` }),
            (r = t.d ? ["sign"] : ["verify"]);
          break;
        case "RS256":
        case "RS384":
        case "RS512":
          (e = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${t.alg.slice(-3)}` }),
            (r = t.d ? ["sign"] : ["verify"]);
          break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
          (e = {
            name: "RSA-OAEP",
            hash: `SHA-${parseInt(t.alg.slice(-3), 10) || 1}`,
          }),
            (r = t.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"]);
          break;
        default:
          throw new v(
            'Invalid or unsupported JWK "alg" (Algorithm) Parameter value'
          );
      }
      break;
    }
    case "EC": {
      switch (t.alg) {
        case "ES256":
          (e = { name: "ECDSA", namedCurve: "P-256" }),
            (r = t.d ? ["sign"] : ["verify"]);
          break;
        case "ES384":
          (e = { name: "ECDSA", namedCurve: "P-384" }),
            (r = t.d ? ["sign"] : ["verify"]);
          break;
        case "ES512":
          (e = { name: "ECDSA", namedCurve: "P-521" }),
            (r = t.d ? ["sign"] : ["verify"]);
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          (e = { name: "ECDH", namedCurve: t.crv }),
            (r = t.d ? ["deriveBits"] : []);
          break;
        default:
          throw new v(
            'Invalid or unsupported JWK "alg" (Algorithm) Parameter value'
          );
      }
      break;
    }
    case "OKP": {
      switch (t.alg) {
        case "EdDSA":
          (e = { name: t.crv }), (r = t.d ? ["sign"] : ["verify"]);
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          (e = { name: t.crv }), (r = t.d ? ["deriveBits"] : []);
          break;
        default:
          throw new v(
            'Invalid or unsupported JWK "alg" (Algorithm) Parameter value'
          );
      }
      break;
    }
    default:
      throw new v(
        'Invalid or unsupported JWK "kty" (Key Type) Parameter value'
      );
  }
  return { algorithm: e, keyUsages: r };
}
var Ea = async (t) => {
    var e, r;
    if (!t.alg)
      throw new TypeError(
        '"alg" argument is required when "jwk.alg" is not present'
      );
    let { algorithm: n, keyUsages: s } = xa(t),
      a = [
        n,
        (e = t.ext) !== null && e !== void 0 ? e : !1,
        (r = t.key_ops) !== null && r !== void 0 ? r : s,
      ];
    if (n.name === "PBKDF2") return w.subtle.importKey("raw", D(t.k), ...a);
    let i = { ...t };
    return delete i.alg, delete i.use, w.subtle.importKey("jwk", i, ...a);
  },
  _r = Ea;
async function mt(t, e, r) {
  var n;
  if (!J(t)) throw new TypeError("JWK must be an object");
  switch ((e || (e = t.alg), t.kty)) {
    case "oct":
      if (typeof t.k != "string" || !t.k)
        throw new TypeError('missing "k" (Key Value) Parameter value');
      return (
        r ?? (r = t.ext !== !0),
        r
          ? _r({
              ...t,
              alg: e,
              ext: (n = t.ext) !== null && n !== void 0 ? n : !1,
            })
          : D(t.k)
      );
    case "RSA":
      if (t.oth !== void 0)
        throw new v(
          'RSA JWK "oth" (Other Primes Info) Parameter value is not supported'
        );
    case "EC":
    case "OKP":
      return _r({ ...t, alg: e });
    default:
      throw new v('Unsupported "kty" (Key Type) Parameter value');
  }
}
var ba = (t, e) => {
    if (!(e instanceof Uint8Array)) {
      if (!gr(e)) throw new TypeError(yr(t, e, ...C, "Uint8Array"));
      if (e.type !== "secret")
        throw new TypeError(
          `${C.join(
            " or "
          )} instances for symmetric algorithms must be of type "secret"`
        );
    }
  },
  Sa = (t, e, r) => {
    if (!gr(e)) throw new TypeError(yr(t, e, ...C));
    if (e.type === "secret")
      throw new TypeError(
        `${C.join(
          " or "
        )} instances for asymmetric algorithms must not be of type "secret"`
      );
    if (r === "sign" && e.type === "public")
      throw new TypeError(
        `${C.join(
          " or "
        )} instances for asymmetric algorithm signing must be of type "private"`
      );
    if (r === "decrypt" && e.type === "public")
      throw new TypeError(
        `${C.join(
          " or "
        )} instances for asymmetric algorithm decryption must be of type "private"`
      );
    if (e.algorithm && r === "verify" && e.type === "private")
      throw new TypeError(
        `${C.join(
          " or "
        )} instances for asymmetric algorithm verifying must be of type "public"`
      );
    if (e.algorithm && r === "encrypt" && e.type === "private")
      throw new TypeError(
        `${C.join(
          " or "
        )} instances for asymmetric algorithm encryption must be of type "public"`
      );
  },
  Aa = (t, e, r) => {
    t.startsWith("HS") ||
    t === "dir" ||
    t.startsWith("PBES2") ||
    /^A\d{3}(?:GCM)?KW$/.test(t)
      ? ba(t, e)
      : Sa(t, e, r);
  },
  Ye = Aa;
async function Ca(t, e, r, n, s) {
  if (!(r instanceof Uint8Array)) throw new TypeError(W(r, "Uint8Array"));
  let a = parseInt(t.slice(1, 4), 10),
    i = await w.subtle.importKey("raw", r.subarray(a >> 3), "AES-CBC", !1, [
      "encrypt",
    ]),
    o = await w.subtle.importKey(
      "raw",
      r.subarray(0, a >> 3),
      { hash: `SHA-${a << 1}`, name: "HMAC" },
      !1,
      ["sign"]
    ),
    d = new Uint8Array(
      await w.subtle.encrypt({ iv: n, name: "AES-CBC" }, i, e)
    ),
    c = z(s, n, d, Ot(s.length << 3)),
    u = new Uint8Array((await w.subtle.sign("HMAC", o, c)).slice(0, a >> 3));
  return { ciphertext: d, tag: u };
}
async function Ta(t, e, r, n, s) {
  let a;
  r instanceof Uint8Array
    ? (a = await w.subtle.importKey("raw", r, "AES-GCM", !1, ["encrypt"]))
    : (j(r, t, "encrypt"), (a = r));
  let i = new Uint8Array(
      await w.subtle.encrypt(
        { additionalData: s, iv: n, name: "AES-GCM", tagLength: 128 },
        a,
        e
      )
    ),
    o = i.slice(-16);
  return { ciphertext: i.slice(0, -16), tag: o };
}
var Ha = async (t, e, r, n, s) => {
    if (!O(r) && !(r instanceof Uint8Array))
      throw new TypeError(W(r, ...C, "Uint8Array"));
    switch ((Nt(t, n), t)) {
      case "A128CBC-HS256":
      case "A192CBC-HS384":
      case "A256CBC-HS512":
        return (
          r instanceof Uint8Array && Ze(r, parseInt(t.slice(-3), 10)),
          Ca(t, e, r, n, s)
        );
      case "A128GCM":
      case "A192GCM":
      case "A256GCM":
        return (
          r instanceof Uint8Array && Ze(r, parseInt(t.slice(1, 4), 10)),
          Ta(t, e, r, n, s)
        );
      default:
        throw new v("Unsupported JWE Content Encryption Algorithm");
    }
  },
  yt = Ha;
async function Rn(t, e, r, n) {
  let s = t.slice(0, 7);
  n || (n = Jt(s));
  let { ciphertext: a, tag: i } = await yt(s, r, e, n, new Uint8Array(0));
  return { encryptedKey: a, iv: k(n), tag: k(i) };
}
async function Pn(t, e, r, n, s) {
  let a = t.slice(0, 7);
  return Ut(a, e, r, n, s, new Uint8Array(0));
}
async function Ra(t, e, r, n, s) {
  switch ((Ye(t, e, "decrypt"), t)) {
    case "dir": {
      if (r !== void 0) throw new f("Encountered unexpected JWE Encrypted Key");
      return e;
    }
    case "ECDH-ES":
      if (r !== void 0) throw new f("Encountered unexpected JWE Encrypted Key");
    case "ECDH-ES+A128KW":
    case "ECDH-ES+A192KW":
    case "ECDH-ES+A256KW": {
      if (!J(n.epk))
        throw new f(
          'JOSE Header "epk" (Ephemeral Public Key) missing or invalid'
        );
      if (!Lt(e))
        throw new v(
          "ECDH with the provided key is not allowed or not supported by your javascript runtime"
        );
      let a = await mt(n.epk, t),
        i,
        o;
      if (n.apu !== void 0) {
        if (typeof n.apu != "string")
          throw new f('JOSE Header "apu" (Agreement PartyUInfo) invalid');
        try {
          i = D(n.apu);
        } catch {
          throw new f("Failed to base64url decode the apu");
        }
      }
      if (n.apv !== void 0) {
        if (typeof n.apv != "string")
          throw new f('JOSE Header "apv" (Agreement PartyVInfo) invalid');
        try {
          o = D(n.apv);
        } catch {
          throw new f("Failed to base64url decode the apv");
        }
      }
      let d = await $t(
        a,
        e,
        t === "ECDH-ES" ? n.enc : t,
        t === "ECDH-ES" ? ft(n.enc) : parseInt(t.slice(-5, -2), 10),
        i,
        o
      );
      if (t === "ECDH-ES") return d;
      if (r === void 0) throw new f("JWE Encrypted Key missing");
      return pt(t.slice(-6), d, r);
    }
    case "RSA1_5":
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512": {
      if (r === void 0) throw new f("JWE Encrypted Key missing");
      return Hn(t, e, r);
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW": {
      if (r === void 0) throw new f("JWE Encrypted Key missing");
      if (typeof n.p2c != "number")
        throw new f('JOSE Header "p2c" (PBES2 Count) missing or invalid');
      let a = s?.maxPBES2Count || 1e4;
      if (n.p2c > a)
        throw new f(
          'JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds'
        );
      if (typeof n.p2s != "string")
        throw new f('JOSE Header "p2s" (PBES2 Salt) missing or invalid');
      let i;
      try {
        i = D(n.p2s);
      } catch {
        throw new f("Failed to base64url decode the p2s");
      }
      return Cn(t, e, r, n.p2c, i);
    }
    case "A128KW":
    case "A192KW":
    case "A256KW": {
      if (r === void 0) throw new f("JWE Encrypted Key missing");
      return pt(t, e, r);
    }
    case "A128GCMKW":
    case "A192GCMKW":
    case "A256GCMKW": {
      if (r === void 0) throw new f("JWE Encrypted Key missing");
      if (typeof n.iv != "string")
        throw new f(
          'JOSE Header "iv" (Initialization Vector) missing or invalid'
        );
      if (typeof n.tag != "string")
        throw new f(
          'JOSE Header "tag" (Authentication Tag) missing or invalid'
        );
      let a;
      try {
        a = D(n.iv);
      } catch {
        throw new f("Failed to base64url decode the iv");
      }
      let i;
      try {
        i = D(n.tag);
      } catch {
        throw new f("Failed to base64url decode the tag");
      }
      return Pn(t, e, r, a, i);
    }
    default:
      throw new v('Invalid or unsupported "alg" (JWE Algorithm) header value');
  }
}
var kn = Ra;
function Pa(t, e, r, n, s) {
  if (s.crit !== void 0 && n.crit === void 0)
    throw new t(
      '"crit" (Critical) Header Parameter MUST be integrity protected'
    );
  if (!n || n.crit === void 0) return new Set();
  if (
    !Array.isArray(n.crit) ||
    n.crit.length === 0 ||
    n.crit.some((i) => typeof i != "string" || i.length === 0)
  )
    throw new t(
      '"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present'
    );
  let a;
  r !== void 0
    ? (a = new Map([...Object.entries(r), ...e.entries()]))
    : (a = e);
  for (let i of n.crit) {
    if (!a.has(i))
      throw new v(`Extension Header Parameter "${i}" is not recognized`);
    if (s[i] === void 0)
      throw new t(`Extension Header Parameter "${i}" is missing`);
    if (a.get(i) && n[i] === void 0)
      throw new t(
        `Extension Header Parameter "${i}" MUST be integrity protected`
      );
  }
  return new Set(n.crit);
}
var Ie = Pa;
var ka = (t, e) => {
    if (
      e !== void 0 &&
      (!Array.isArray(e) || e.some((r) => typeof r != "string"))
    )
      throw new TypeError(`"${t}" option must be an array of strings`);
    if (e) return new Set(e);
  },
  Bt = ka;
async function Vt(t, e, r) {
  var n;
  if (!J(t)) throw new f("Flattened JWE must be an object");
  if (t.protected === void 0 && t.header === void 0 && t.unprotected === void 0)
    throw new f("JOSE Header missing");
  if (typeof t.iv != "string")
    throw new f("JWE Initialization Vector missing or incorrect type");
  if (typeof t.ciphertext != "string")
    throw new f("JWE Ciphertext missing or incorrect type");
  if (typeof t.tag != "string")
    throw new f("JWE Authentication Tag missing or incorrect type");
  if (t.protected !== void 0 && typeof t.protected != "string")
    throw new f("JWE Protected Header incorrect type");
  if (t.encrypted_key !== void 0 && typeof t.encrypted_key != "string")
    throw new f("JWE Encrypted Key incorrect type");
  if (t.aad !== void 0 && typeof t.aad != "string")
    throw new f("JWE AAD incorrect type");
  if (t.header !== void 0 && !J(t.header))
    throw new f("JWE Shared Unprotected Header incorrect type");
  if (t.unprotected !== void 0 && !J(t.unprotected))
    throw new f("JWE Per-Recipient Unprotected Header incorrect type");
  let s;
  if (t.protected)
    try {
      let $ = D(t.protected);
      s = JSON.parse(B.decode($));
    } catch {
      throw new f("JWE Protected Header is invalid");
    }
  if (!Ke(s, t.header, t.unprotected))
    throw new f(
      "JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint"
    );
  let a = { ...s, ...t.header, ...t.unprotected };
  if ((Ie(f, new Map(), r?.crit, s, a), a.zip !== void 0)) {
    if (!s || !s.zip)
      throw new f(
        'JWE "zip" (Compression Algorithm) Header MUST be integrity protected'
      );
    if (a.zip !== "DEF")
      throw new v(
        'Unsupported JWE "zip" (Compression Algorithm) Header Parameter value'
      );
  }
  let { alg: i, enc: o } = a;
  if (typeof i != "string" || !i)
    throw new f("missing JWE Algorithm (alg) in JWE Header");
  if (typeof o != "string" || !o)
    throw new f("missing JWE Encryption Algorithm (enc) in JWE Header");
  let d = r && Bt("keyManagementAlgorithms", r.keyManagementAlgorithms),
    c = r && Bt("contentEncryptionAlgorithms", r.contentEncryptionAlgorithms);
  if (d && !d.has(i))
    throw new Ge('"alg" (Algorithm) Header Parameter not allowed');
  if (c && !c.has(o))
    throw new Ge('"enc" (Encryption Algorithm) Header Parameter not allowed');
  let u;
  if (t.encrypted_key !== void 0)
    try {
      u = D(t.encrypted_key);
    } catch {
      throw new f("Failed to base64url decode the encrypted_key");
    }
  let m = !1;
  typeof e == "function" && ((e = await e(s, t)), (m = !0));
  let b;
  try {
    b = await kn(i, e, u, a, r);
  } catch ($) {
    if ($ instanceof TypeError || $ instanceof f || $ instanceof v) throw $;
    b = le(o);
  }
  let S, T;
  try {
    S = D(t.iv);
  } catch {
    throw new f("Failed to base64url decode the iv");
  }
  try {
    T = D(t.tag);
  } catch {
    throw new f("Failed to base64url decode the tag");
  }
  let H = M.encode((n = t.protected) !== null && n !== void 0 ? n : ""),
    N;
  t.aad !== void 0 ? (N = z(H, M.encode("."), M.encode(t.aad))) : (N = H);
  let Q;
  try {
    Q = D(t.ciphertext);
  } catch {
    throw new f("Failed to base64url decode the ciphertext");
  }
  let pe = await Ut(o, b, Q, S, T, N);
  a.zip === "DEF" && (pe = await (r?.inflateRaw || wn)(pe));
  let ee = { plaintext: pe };
  if ((t.protected !== void 0 && (ee.protectedHeader = s), t.aad !== void 0))
    try {
      ee.additionalAuthenticatedData = D(t.aad);
    } catch {
      throw new f("Failed to base64url decode the aad");
    }
  return (
    t.unprotected !== void 0 && (ee.sharedUnprotectedHeader = t.unprotected),
    t.header !== void 0 && (ee.unprotectedHeader = t.header),
    m ? { ...ee, key: e } : ee
  );
}
async function vr(t, e, r) {
  if ((t instanceof Uint8Array && (t = B.decode(t)), typeof t != "string"))
    throw new f("Compact JWE must be a string or Uint8Array");
  let { 0: n, 1: s, 2: a, 3: i, 4: o, length: d } = t.split(".");
  if (d !== 5) throw new f("Invalid Compact JWE");
  let c = await Vt(
      {
        ciphertext: i,
        iv: a || void 0,
        protected: n || void 0,
        tag: o || void 0,
        encrypted_key: s || void 0,
      },
      e,
      r
    ),
    u = { plaintext: c.plaintext, protectedHeader: c.protectedHeader };
  return typeof e == "function" ? { ...u, key: c.key } : u;
}
var Ka = async (t) => {
    if (t instanceof Uint8Array) return { kty: "oct", k: k(t) };
    if (!O(t)) throw new TypeError(W(t, ...C, "Uint8Array"));
    if (!t.extractable)
      throw new TypeError(
        "non-extractable CryptoKey cannot be exported as a JWK"
      );
    let {
      ext: e,
      key_ops: r,
      alg: n,
      use: s,
      ...a
    } = await w.subtle.exportKey("jwk", t);
    return a;
  },
  Kn = Ka;
async function xr(t) {
  return Kn(t);
}
async function Ia(t, e, r, n, s = {}) {
  let a, i, o;
  switch ((Ye(t, r, "encrypt"), t)) {
    case "dir": {
      o = r;
      break;
    }
    case "ECDH-ES":
    case "ECDH-ES+A128KW":
    case "ECDH-ES+A192KW":
    case "ECDH-ES+A256KW": {
      if (!Lt(r))
        throw new v(
          "ECDH with the provided key is not allowed or not supported by your javascript runtime"
        );
      let { apu: d, apv: c } = s,
        { epk: u } = s;
      u || (u = (await En(r)).privateKey);
      let { x: m, y: b, crv: S, kty: T } = await xr(u),
        H = await $t(
          r,
          u,
          t === "ECDH-ES" ? e : t,
          t === "ECDH-ES" ? ft(e) : parseInt(t.slice(-5, -2), 10),
          d,
          c
        );
      if (
        ((i = { epk: { x: m, crv: S, kty: T } }),
        T === "EC" && (i.epk.y = b),
        d && (i.apu = k(d)),
        c && (i.apv = k(c)),
        t === "ECDH-ES")
      ) {
        o = H;
        break;
      }
      o = n || le(e);
      let N = t.slice(-6);
      a = await lt(N, H, o);
      break;
    }
    case "RSA1_5":
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512": {
      (o = n || le(e)), (a = await Tn(t, r, o));
      break;
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW": {
      o = n || le(e);
      let { p2c: d, p2s: c } = s;
      ({ encryptedKey: a, ...i } = await An(t, r, o, d, c));
      break;
    }
    case "A128KW":
    case "A192KW":
    case "A256KW": {
      (o = n || le(e)), (a = await lt(t, r, o));
      break;
    }
    case "A128GCMKW":
    case "A192GCMKW":
    case "A256GCMKW": {
      o = n || le(e);
      let { iv: d } = s;
      ({ encryptedKey: a, ...i } = await Rn(t, r, o, d));
      break;
    }
    default:
      throw new v('Invalid or unsupported "alg" (JWE Algorithm) header value');
  }
  return { cek: o, encryptedKey: a, parameters: i };
}
var Er = Ia;
var In = Symbol(),
  Qe = class {
    constructor(e) {
      if (!(e instanceof Uint8Array))
        throw new TypeError("plaintext must be an instance of Uint8Array");
      this._plaintext = e;
    }
    setKeyManagementParameters(e) {
      if (this._keyManagementParameters)
        throw new TypeError(
          "setKeyManagementParameters can only be called once"
        );
      return (this._keyManagementParameters = e), this;
    }
    setProtectedHeader(e) {
      if (this._protectedHeader)
        throw new TypeError("setProtectedHeader can only be called once");
      return (this._protectedHeader = e), this;
    }
    setSharedUnprotectedHeader(e) {
      if (this._sharedUnprotectedHeader)
        throw new TypeError(
          "setSharedUnprotectedHeader can only be called once"
        );
      return (this._sharedUnprotectedHeader = e), this;
    }
    setUnprotectedHeader(e) {
      if (this._unprotectedHeader)
        throw new TypeError("setUnprotectedHeader can only be called once");
      return (this._unprotectedHeader = e), this;
    }
    setAdditionalAuthenticatedData(e) {
      return (this._aad = e), this;
    }
    setContentEncryptionKey(e) {
      if (this._cek)
        throw new TypeError("setContentEncryptionKey can only be called once");
      return (this._cek = e), this;
    }
    setInitializationVector(e) {
      if (this._iv)
        throw new TypeError("setInitializationVector can only be called once");
      return (this._iv = e), this;
    }
    async encrypt(e, r) {
      if (
        !this._protectedHeader &&
        !this._unprotectedHeader &&
        !this._sharedUnprotectedHeader
      )
        throw new f(
          "either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()"
        );
      if (
        !Ke(
          this._protectedHeader,
          this._unprotectedHeader,
          this._sharedUnprotectedHeader
        )
      )
        throw new f(
          "JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint"
        );
      let n = {
        ...this._protectedHeader,
        ...this._unprotectedHeader,
        ...this._sharedUnprotectedHeader,
      };
      if (
        (Ie(f, new Map(), r?.crit, this._protectedHeader, n), n.zip !== void 0)
      ) {
        if (!this._protectedHeader || !this._protectedHeader.zip)
          throw new f(
            'JWE "zip" (Compression Algorithm) Header MUST be integrity protected'
          );
        if (n.zip !== "DEF")
          throw new v(
            'Unsupported JWE "zip" (Compression Algorithm) Header Parameter value'
          );
      }
      let { alg: s, enc: a } = n;
      if (typeof s != "string" || !s)
        throw new f(
          'JWE "alg" (Algorithm) Header Parameter missing or invalid'
        );
      if (typeof a != "string" || !a)
        throw new f(
          'JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid'
        );
      let i;
      if (s === "dir") {
        if (this._cek)
          throw new TypeError(
            "setContentEncryptionKey cannot be called when using Direct Encryption"
          );
      } else if (s === "ECDH-ES" && this._cek)
        throw new TypeError(
          "setContentEncryptionKey cannot be called when using Direct Key Agreement"
        );
      let o;
      {
        let T;
        ({
          cek: o,
          encryptedKey: i,
          parameters: T,
        } = await Er(s, a, e, this._cek, this._keyManagementParameters)),
          T &&
            (r && In in r
              ? this._unprotectedHeader
                ? (this._unprotectedHeader = {
                    ...this._unprotectedHeader,
                    ...T,
                  })
                : this.setUnprotectedHeader(T)
              : this._protectedHeader
                ? (this._protectedHeader = { ...this._protectedHeader, ...T })
                : this.setProtectedHeader(T));
      }
      this._iv || (this._iv = Jt(a));
      let d, c, u;
      this._protectedHeader
        ? (c = M.encode(k(JSON.stringify(this._protectedHeader))))
        : (c = M.encode("")),
        this._aad
          ? ((u = k(this._aad)), (d = z(c, M.encode("."), M.encode(u))))
          : (d = c);
      let m, b;
      if (n.zip === "DEF") {
        let T = await (r?.deflateRaw || _n)(this._plaintext);
        ({ ciphertext: m, tag: b } = await yt(a, T, o, this._iv, d));
      } else
        ({ ciphertext: m, tag: b } = await yt(
          a,
          this._plaintext,
          o,
          this._iv,
          d
        ));
      let S = { ciphertext: k(m), iv: k(this._iv), tag: k(b) };
      return (
        i && (S.encrypted_key = k(i)),
        u && (S.aad = u),
        this._protectedHeader && (S.protected = B.decode(c)),
        this._sharedUnprotectedHeader &&
          (S.unprotected = this._sharedUnprotectedHeader),
        this._unprotectedHeader && (S.header = this._unprotectedHeader),
        S
      );
    }
  };
var et = (t) => Math.floor(t.getTime() / 1e3);
var Ja =
    /^(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)$/i,
  tt = (t) => {
    let e = Ja.exec(t);
    if (!e) throw new TypeError("Invalid time period format");
    let r = parseFloat(e[1]);
    switch (e[2].toLowerCase()) {
      case "sec":
      case "secs":
      case "second":
      case "seconds":
      case "s":
        return Math.round(r);
      case "minute":
      case "minutes":
      case "min":
      case "mins":
      case "m":
        return Math.round(r * 60);
      case "hour":
      case "hours":
      case "hr":
      case "hrs":
      case "h":
        return Math.round(r * 3600);
      case "day":
      case "days":
      case "d":
        return Math.round(r * 86400);
      case "week":
      case "weeks":
      case "w":
        return Math.round(r * 604800);
      default:
        return Math.round(r * 31557600);
    }
  };
var Wn = (t) => t.toLowerCase().replace(/^application\//, ""),
  Na = (t, e) =>
    typeof t == "string"
      ? e.includes(t)
      : Array.isArray(t)
        ? e.some(Set.prototype.has.bind(new Set(t)))
        : !1,
  zt = (t, e, r = {}) => {
    let { typ: n } = r;
    if (n && (typeof t.typ != "string" || Wn(t.typ) !== Wn(n)))
      throw new L('unexpected "typ" JWT header value', "typ", "check_failed");
    let s;
    try {
      s = JSON.parse(B.decode(e));
    } catch {}
    if (!J(s)) throw new ge("JWT Claims Set must be a top-level JSON object");
    let {
      requiredClaims: a = [],
      issuer: i,
      subject: o,
      audience: d,
      maxTokenAge: c,
    } = r;
    c !== void 0 && a.push("iat"),
      d !== void 0 && a.push("aud"),
      o !== void 0 && a.push("sub"),
      i !== void 0 && a.push("iss");
    for (let S of new Set(a.reverse()))
      if (!(S in s)) throw new L(`missing required "${S}" claim`, S, "missing");
    if (i && !(Array.isArray(i) ? i : [i]).includes(s.iss))
      throw new L('unexpected "iss" claim value', "iss", "check_failed");
    if (o && s.sub !== o)
      throw new L('unexpected "sub" claim value', "sub", "check_failed");
    if (d && !Na(s.aud, typeof d == "string" ? [d] : d))
      throw new L('unexpected "aud" claim value', "aud", "check_failed");
    let u;
    switch (typeof r.clockTolerance) {
      case "string":
        u = tt(r.clockTolerance);
        break;
      case "number":
        u = r.clockTolerance;
        break;
      case "undefined":
        u = 0;
        break;
      default:
        throw new TypeError("Invalid clockTolerance option type");
    }
    let { currentDate: m } = r,
      b = et(m || new Date());
    if ((s.iat !== void 0 || c) && typeof s.iat != "number")
      throw new L('"iat" claim must be a number', "iat", "invalid");
    if (s.nbf !== void 0) {
      if (typeof s.nbf != "number")
        throw new L('"nbf" claim must be a number', "nbf", "invalid");
      if (s.nbf > b + u)
        throw new L(
          '"nbf" claim timestamp check failed',
          "nbf",
          "check_failed"
        );
    }
    if (s.exp !== void 0) {
      if (typeof s.exp != "number")
        throw new L('"exp" claim must be a number', "exp", "invalid");
      if (s.exp <= b - u)
        throw new ut(
          '"exp" claim timestamp check failed',
          "exp",
          "check_failed"
        );
    }
    if (c) {
      let S = b - s.iat,
        T = typeof c == "number" ? c : tt(c);
      if (S - u > T)
        throw new ut(
          '"iat" claim timestamp check failed (too far in the past)',
          "iat",
          "check_failed"
        );
      if (S < 0 - u)
        throw new L(
          '"iat" claim timestamp check failed (it should be in the past)',
          "iat",
          "check_failed"
        );
    }
    return s;
  };
async function wt(t, e, r) {
  let n = await vr(t, e, r),
    s = zt(n.protectedHeader, n.plaintext, r),
    { protectedHeader: a } = n;
  if (a.iss !== void 0 && a.iss !== s.iss)
    throw new L(
      'replicated "iss" claim header parameter mismatch',
      "iss",
      "mismatch"
    );
  if (a.sub !== void 0 && a.sub !== s.sub)
    throw new L(
      'replicated "sub" claim header parameter mismatch',
      "sub",
      "mismatch"
    );
  if (a.aud !== void 0 && JSON.stringify(a.aud) !== JSON.stringify(s.aud))
    throw new L(
      'replicated "aud" claim header parameter mismatch',
      "aud",
      "mismatch"
    );
  let i = { payload: s, protectedHeader: a };
  return typeof e == "function" ? { ...i, key: n.key } : i;
}
var _t = class {
  constructor(e) {
    this._flattened = new Qe(e);
  }
  setContentEncryptionKey(e) {
    return this._flattened.setContentEncryptionKey(e), this;
  }
  setInitializationVector(e) {
    return this._flattened.setInitializationVector(e), this;
  }
  setProtectedHeader(e) {
    return this._flattened.setProtectedHeader(e), this;
  }
  setKeyManagementParameters(e) {
    return this._flattened.setKeyManagementParameters(e), this;
  }
  async encrypt(e, r) {
    let n = await this._flattened.encrypt(e, r);
    return [n.protected, n.encrypted_key, n.iv, n.ciphertext, n.tag].join(".");
  }
};
var rt = class {
  constructor(e) {
    if (!J(e)) throw new TypeError("JWT Claims Set MUST be an object");
    this._payload = e;
  }
  setIssuer(e) {
    return (this._payload = { ...this._payload, iss: e }), this;
  }
  setSubject(e) {
    return (this._payload = { ...this._payload, sub: e }), this;
  }
  setAudience(e) {
    return (this._payload = { ...this._payload, aud: e }), this;
  }
  setJti(e) {
    return (this._payload = { ...this._payload, jti: e }), this;
  }
  setNotBefore(e) {
    return (
      typeof e == "number"
        ? (this._payload = { ...this._payload, nbf: e })
        : (this._payload = { ...this._payload, nbf: et(new Date()) + tt(e) }),
      this
    );
  }
  setExpirationTime(e) {
    return (
      typeof e == "number"
        ? (this._payload = { ...this._payload, exp: e })
        : (this._payload = { ...this._payload, exp: et(new Date()) + tt(e) }),
      this
    );
  }
  setIssuedAt(e) {
    return (
      typeof e > "u"
        ? (this._payload = { ...this._payload, iat: et(new Date()) })
        : (this._payload = { ...this._payload, iat: e }),
      this
    );
  }
};
var vt = class extends rt {
  setProtectedHeader(e) {
    if (this._protectedHeader)
      throw new TypeError("setProtectedHeader can only be called once");
    return (this._protectedHeader = e), this;
  }
  setKeyManagementParameters(e) {
    if (this._keyManagementParameters)
      throw new TypeError("setKeyManagementParameters can only be called once");
    return (this._keyManagementParameters = e), this;
  }
  setContentEncryptionKey(e) {
    if (this._cek)
      throw new TypeError("setContentEncryptionKey can only be called once");
    return (this._cek = e), this;
  }
  setInitializationVector(e) {
    if (this._iv)
      throw new TypeError("setInitializationVector can only be called once");
    return (this._iv = e), this;
  }
  replicateIssuerAsHeader() {
    return (this._replicateIssuerAsHeader = !0), this;
  }
  replicateSubjectAsHeader() {
    return (this._replicateSubjectAsHeader = !0), this;
  }
  replicateAudienceAsHeader() {
    return (this._replicateAudienceAsHeader = !0), this;
  }
  async encrypt(e, r) {
    let n = new _t(M.encode(JSON.stringify(this._payload)));
    return (
      this._replicateIssuerAsHeader &&
        (this._protectedHeader = {
          ...this._protectedHeader,
          iss: this._payload.iss,
        }),
      this._replicateSubjectAsHeader &&
        (this._protectedHeader = {
          ...this._protectedHeader,
          sub: this._payload.sub,
        }),
      this._replicateAudienceAsHeader &&
        (this._protectedHeader = {
          ...this._protectedHeader,
          aud: this._payload.aud,
        }),
      n.setProtectedHeader(this._protectedHeader),
      this._iv && n.setInitializationVector(this._iv),
      this._cek && n.setContentEncryptionKey(this._cek),
      this._keyManagementParameters &&
        n.setKeyManagementParameters(this._keyManagementParameters),
      n.encrypt(e, r)
    );
  }
};
var nt = {};
Xn(nt, { decode: () => br, encode: () => Ba });
var Ba = k,
  br = D;
var jt = (t, e) =>
  new Response(JSON.stringify({ status: "success", data: t.parse(e) }), {
    status: 200,
  });
var Nn = async (t) => {
  let e = nt.decode(t.env.JWT_SECRET),
    r = await new vt({ applicationID: 1, applicationName: "development-id" })
      .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
      .setIssuedAt()
      .encrypt(e);
  return (
    console.log(JSON.stringify(await wt(r, e), null, 4)),
    jt(I.object({ jwt: I.string() }), { jwt: r })
  );
};
var Va = () =>
    I.object({ applicationID: I.number().int(), applicationName: I.string() }),
  Mn = async (t, e) => {
    let r = t.req.header("Authorization");
    if (!r || !r.startsWith("Bearer ")) return t.text("Unauthenticated", 401);
    let n = r.substring(8),
      s = nt.decode(t.env.JWT_SECRET),
      a = await wt(n, s).catch(() => t.text("Unauthenticated", 401));
    if (a instanceof Response) return a;
    let i = Va().safeParse(a.payload);
    return i.success
      ? (t.res.headers.append("applicationId", i.data.applicationID.toString()),
        t.res.headers.append("applicationName", i.data.applicationName),
        await e())
      : t.text("Unauthenticated", 401);
  };
var za = () => statusEnum().Enum.operational,
  ja = async (t) => ((await Mn(t, () => ({}))) ? "invalid" : "valid"),
  Fa = async (t) =>
    (await fetch("https://www.thebluealliance.com/api/v3/status", {
      headers: { "x-tba-auth-key": t.env.TBA_KEY },
    }).then((r) => r.status)) === 200
      ? statusEnum().enum.operational
      : statusEnum().enum.offline,
  Un = async (t) =>
    jt(statusObject(), {
      status: {
        api: statusEnum().Enum.operational,
        db: za(),
        thebluealliance: await Fa(t),
      },
      authentication: await ja(t),
      environment: Object.keys(t.env),
    });
var $n = async (t, e) =>
  t.req.url.at(-1) === "/" ? await e() : t.redirect(t.req.url + "/", 301);
var Ln = (t) =>
  t.html(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>404</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.min.css"
    />
  </head>
  <body>
    <main>
      <h1>It looks like you got lost</h1>
      <p>
        If this is a problem, open an issue at
        <a href="https://github.com/KennanHunter/scouting/issues"
          >the github page</a
        >
        or contact <code>Kennnan</code> on Discord.
      </p>
      <p>
        current request url: 
        <a href="{CURRENT_URL}">{CURRENT_URL}</a>
      </p>
    </main>
  </body>
</html>`.replaceAll("{CURRENT_URL}", t.req.url),
    404
  );
var Bn = new ir();
Bn.notFound(Ln)
  .use("/*", $n)
  .use("/*", qr())
  .get("/status/", Un)
  .post("/auth/generate/", Nn)
  .post("/api/event/:id/", un);
var Ft = Bn;
function Vn(t) {
  return {
    name: t?.name,
    message: t?.message ?? String(t),
    stack: t?.stack,
    cause: t?.cause === void 0 ? void 0 : Vn(t.cause),
  };
}
var Ga = async (t, e, r, n) => {
    try {
      return await n.next(t, e);
    } catch (s) {
      let a = Vn(s);
      return Response.json(a, {
        status: 500,
        headers: { "MF-Experimental-Error-Stack": "true" },
      });
    }
  },
  zn = Ga,
  jn = void 0;
var qa = [jn].filter(Boolean),
  Xa = {
    ...Ft,
    envWrappers: qa,
    middleware: [zn, ...(Ft.middleware ? Ft.middleware : [])].filter(Boolean),
  };
var K = Xa;
var xt = class {
    constructor(e, r, n) {
      this.scheduledTime = e;
      this.cron = r;
      this.#e = n;
    }
    #e;
    noRetry() {
      if (!(this instanceof xt)) throw new TypeError("Illegal invocation");
      this.#e();
    }
  },
  Fn = function (t, e, r) {
    if (K.fetch === void 0)
      throw new Error("Handler does not export a fetch() function.");
    return K.fetch(t, e, r);
  };
function Zn(t) {
  let e = t;
  if (K.envWrappers && K.envWrappers.length > 0)
    for (let r of K.envWrappers) e = r(e);
  return e;
}
var Gn = !1,
  Ya = {
    ...(K.tail && { tail: st(K.tail) }),
    ...(K.trace && { trace: st(K.trace) }),
    ...(K.scheduled && { scheduled: st(K.scheduled) }),
    ...(K.queue && { queue: st(K.queue) }),
    ...(K.test && { test: st(K.test) }),
    ...(K.email && { email: st(K.email) }),
    fetch(t, e, r) {
      let n = Zn(e);
      if (K.middleware && K.middleware.length > 0) {
        if (!Gn) {
          Gn = !0;
          for (let a of K.middleware) Hr(a);
        }
        return Pr(
          t,
          n,
          r,
          function (a, i) {
            if (a === "scheduled" && K.scheduled !== void 0) {
              let o = new xt(Date.now(), i.cron ?? "", () => {});
              return K.scheduled(o, n, r);
            }
          },
          Fn
        );
      } else return Fn(t, n, r);
    },
  };
function st(t) {
  return (e, r, n) => t(e, Zn(r), n);
}
var l_ = Ya;
export { l_ as default };
//# sourceMappingURL=index.js.map
