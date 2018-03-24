"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./typings/node/node.d.ts"/>
//--------------------------------------------------
const child_process = require("child_process");
const fs = require("fs");
const assert = require('assert');
//import * as assert from 'assert'
const path = require("path");
const os = require("os");
const u = require("util");
//---------------------------------------
exports.isEq = (exp, act) => {
    try {
        assert.deepStrictEqual(act, exp);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.isNotEq = (exp, act) => !exports.isEq(exp, act);
exports.assertIsEq = (exp, act) => { if (exports.isNotEq(exp, act))
    debugger; };
exports.assertIsNotEq = (exp, act) => { if (exports.isEq(exp, act))
    debugger; };
//---------------------------------------
exports.vLT = x => a => a < x;
exports.vGE = x => a => a >= x;
exports.vLE = x => a => a <= x;
exports.vEQ = (x) => (a) => a === x;
exports.vNE = (x) => (a) => a !== x;
exports.vGT = x => a => a > x;
exports.vIN = (itr) => a => { for (let i of itr)
    if (i === a)
        return true; return false; };
exports.vNotIn = itr => a => !exports.vIN(itr)(a);
exports.vBET = (x, y) => (a) => x <= a && a <= y;
exports.vNotBet = (x, y) => (a) => !exports.vBET(x, y)(a);
exports.vIsInstanceOf = (x) => (a) => a instanceof x;
exports.ensSy = (a) => typeof a === 'string' ? exports.sSplitSpc(a) : a;
exports.ensRe = (a) => a instanceof RegExp ? a : new RegExp(a);
//-------------------------------------
exports.pipe = v => (...f) => { let o = v; for (let ff of f)
    o = ff(o); return o; };
exports.vMap = (f) => a => f(a);
exports.funApply = v => (a) => a(v);
exports.swap = (f) => a => b => f(b)(a);
exports.compose = (...f) => v => exports.pipe(v)(...f);
//----------------------------------
exports.dicLy = (a) => exports.itrMap(exports.kvLin)(a);
exports.dicLines = (a) => exports.dicLy(a).join('\r\n');
exports.kvLin = ([k, v]) => k + ' ' + v;
exports.dmp = global.console.log;
exports.funDmp = (f) => exports.dmp(f.toString());
exports.halt = () => { throw new Error(); };
exports.sEscLf = (a) => a.replace('\n', '\\n');
exports.sEscVbar = (a) => a.replace(/\|/g, '\\v');
exports.sEscCr = (a) => a.replace(/\r/g, '\\r');
exports.sEscTab = (a) => a.replace(/\t/g, '\\t');
exports.sEsc = exports.compose(exports.sEscLf, exports.sEscCr, exports.sEscTab);
exports.sFmt = (qqStr, ...v) => {
    let z = qqStr;
    for (let i of v) {
        z = z.replace('?', i);
    }
    return z;
};
exports.sBox = (a) => { const y = "== " + exports.sEsc(a) + " ==", x = "=".repeat(a.length + 6); return [x, y, x].join("\r\n"); };
exports.stack = () => { try {
    throw new Error();
}
catch (e) {
    let z = e.stack;
    return z;
} };
exports.er = (msg, ...v) => {
    let a = exports.stack();
    let b = a.split(/\n/);
    let c = b[3];
    let d = c.split(/\s+/);
    let breakingFunNm = d[2];
    let hdr = exports.sBox(breakingFunNm);
    exports.dmp(hdr);
    exports.dmp(`error[${msg}] ------------------------\n`);
    exports.itrEach(exports.dmp)(v);
    exports.dmp(a);
    exports.dmp('------------------------------------------------');
    let dbg = true;
    debugger;
    if (dbg)
        exports.halt();
};
//-----------------------------------------------------------------------
exports.sSplit = (sep) => (a) => a.split(sep);
exports.sRmvCr = (a) => a.replace(/\r/g, '');
exports.sSplitLines = (a) => exports.sSplitLf(exports.sRmvCr(a));
exports.sSplitCrLf = exports.sSplit('\r\n');
exports.sSplitLf = exports.sSplit('\n');
exports.sSplitSpc = exports.sSplit(/\s+/);
exports.sSplitCommaSpc = exports.sSplit(/,\s*/);
//-----------------------------------------------------------------------
exports.vDft = (dft) => (a) => a === null || a === undefined ? dft : a;
exports.vDftStr = exports.vDft("");
exports.vDftUpper = (x, y) => (a) => a === null || a === undefined || x > a || a > y ? y : a;
exports.vDftLower = (x, y) => (a) => a === null || a === undefined || x > a || a > y ? x : a;
exports.ayFindIx = (p) => (a) => { for (let i in a)
    if (p(a[i]))
        return Number(i); return null; };
exports.ayFindIxOrDft = (dftIx) => (p) => (a) => exports.vDft(dftIx)(exports.ayFindIx(p)(a));
exports.ayFst = (a) => a[0];
exports.aySnd = (a) => a[1];
exports.ayEle = (ix) => (a) => a[ix];
exports.ayEleOrDft = (dft) => (ix) => (a) => exports.vDft(dft)(a[ix]);
exports.ayLas = (a) => a[exports.vLen(a) - 1];
exports.aySetEle = (ix) => (v) => (a) => { a[ix] = v; };
exports.ayMdyEle = (ix) => (f) => (a) => { a[ix] = f(a[ix]); };
exports.ayMdy = (f) => (a) => exports.itrEach(ix => a[ix] = f(a[ix]))(exports.nItr(a.length));
//-----------------------------------------------------------------------
exports.ayJn = (sep) => (a) => a.join(sep);
exports.ayJnCrLf = exports.ayJn('\r\n');
exports.ayJnLf = exports.ayJn('\n');
exports.ayJnSpc = exports.ayJn(' ');
exports.ayJnComma = exports.ayJn(',');
exports.ayJnCommaSpc = exports.ayJn(', ');
exports.nSpc = (a) => ' '.repeat(a);
exports.ayJnAsLines = (sep0, tab0, wdt0) => (a) => {
    let wdt = exports.vDftUpper(20, 120)(wdt0);
    let sep = exports.vDft('')(sep0);
    let slen = sep.length;
    let pfx = exports.nSpc(exports.vDft(0)(tab0));
    let x = (() => {
        const oo = [];
        let o = [];
        let ww = 0;
        for (let s of a) {
            let l = exports.sLen(s) + slen;
            if (ww + l > wdt) {
                oo.push(pfx + exports.itrAddSfx(sep)(o).join(""));
                o = [];
                ww = 0;
            }
            o.push(s);
            ww += l;
        }
        if (o.length > 0) {
            oo.push(pfx + exports.itrAddSfx(sep)(o).join(""));
        }
        return oo;
    })();
    let b = exports.ayJnCrLf(x);
    return b;
};
//-----------------------------------------------------------------------
exports.sFstChr = (a) => a[0];
exports.sLasChr = (a) => a[a.length - 1];
exports.sAddPfx = (pfx) => (a) => pfx + a;
exports.sAddSfx = (sfx) => a => a + sfx;
exports.sAddPfxSfx = (pfx, sfx) => (a) => pfx + a + sfx;
exports.vLen = a => typeof a === 'string' ? a.length : ((a && a.length) || String(a).length);
exports.sLen = (a) => a.length;
exports.sMidN = (pos) => (n) => (a) => a.substr(pos, n);
exports.sMid = (pos) => (a) => a.substr(pos);
exports.sLeft = (n) => (a) => a.substr(0, n);
exports.sTrim = (a) => a.trim();
exports.sRight = (n) => (a) => {
    const l = exports.vLen(a);
    if (n >= l)
        return a;
    if (0 >= n)
        return '';
    return a.substr(-n);
};
exports.nPadZero = (dig) => (a) => {
    const s = String(a);
    const nZer = dig - s.length;
    const z = nZer > 0 ? "0".repeat(nZer) : "";
    return z + s;
};
exports.sAlignL = (w) => (a) => {
    if (a === null || a === undefined)
        return exports.nSpc(w);
    const l = exports.vLen(a);
    if (l > w)
        return a;
    return a + exports.nSpc(w - l);
};
exports.sAlignR = (w) => (a) => {
    const l = exports.sLen(a);
    if (l > w)
        return a;
    return exports.nSpc(w - l) + a;
};
exports.sWrt = (ft) => (a) => fs.writeFileSync(ft, a);
exports.sSbsPos = (sbs) => (a) => a.indexOf(sbs);
//strictEqual(sbsPos('aabb')('123aabb'),3)
exports.sSbsRevPos = (sbs) => (a) => a.lastIndexOf(sbs);
//strictEqual(sbsRevPos('a')('0123aabb'),5)
exports.cmlNm = (a) => exports.cmlNy(a).reverse().join(' '); // @eg cmlNm(relItmNy) === 'Ny Itm rel'
exports.cmlSpcNm = (a) => exports.cmlNy(a).join(' ');
exports.isNm = (s) => {
    if (s === undefined || s === null || s === '')
        return false;
    if (!exports.chrCd_isFstNmChr(s.charCodeAt(0)))
        return false;
    for (let i = 1; i < s.length; i++) {
        if (!exports.chrCd_isNmChr(s.charCodeAt(i)))
            return false;
    }
    return true;
};
exports.sRplNonNmChr = (a) => {
    const a1 = [];
    for (let i = 0; i < a.length; i++) {
        const c = a.charCodeAt(i);
        if (exports.chrCd_isNmChr(c))
            a1.push(a[i]);
        else
            a1.push(' ');
    }
    return a1.join('');
};
exports.sNmSet = (a) => new Set(exports.sRplNonNmChr(a).split(/\s+/));
const _isBrkChrCd = (c) => c === NaN || exports.chrCd_isCapitalLetter(c) || exports.chrCd_isUnderScore(c) || exports.chrCd_isDollar(c);
const _isBrk = (c, c0) => _isBrkChrCd(c) && !_isBrkChrCd(c0);
exports.cmlNy = (a) => {
    if (!exports.isNm(a))
        exports.er('Give {s} is not a name', { s: a });
    const o = [];
    let m = '';
    for (let i = a.length; i--; i > 0) {
        const cc = a[i];
        const c = a.charCodeAt(i);
        const c0 = a.charCodeAt(i - 1);
        m = cc + m;
        if (_isBrk(c, c0)) {
            o.push(m);
            m = '';
        }
    }
    if (m !== '')
        o.push(m);
    const z = o.reverse();
    return z;
};
exports.sHasPfx = (pfx) => (a) => a.startsWith(pfx);
exports.sHasPfxIgnCas = (pfx) => (a) => {
    const a1 = exports.sLeft(pfx.length)(a).toUpperCase();
    const pfx1 = pfx.toUpperCase();
    return a1 === pfx1;
};
exports.sRmvPfx = (pfx) => (a) => exports.sHasPfx(pfx)(a) ? a.substr(pfx.length) : a;
exports.sHasSfx = (sfx) => (a) => a.endsWith(sfx);
exports.sRmvSfx = (sfx) => (a) => exports.sHasSfx(sfx)(a) ? a.substr(0, a.length - sfx.length) : a;
exports.sMatch = (re) => (a) => a.match(re);
//-----------------------------------------------------------------------
exports.predNot = a => v => !a(v);
exports.predsOr = (...a) => v => { for (let p of a)
    if (p(v))
        return true; return false; };
exports.predsAnd = (...a) => v => { for (let p of a)
    if (!p(v))
        return false; return true; };
//-----------------------------------------------------------------------
exports.isRmkLin = (a) => {
    const l = a.trim();
    if (l === "")
        return true;
    if (exports.sHasPfx("--")(l))
        return true;
    return false;
};
exports.isNonRmkLin = exports.predNot(exports.isRmkLin);
exports.linRmvMsg = (a) => {
    const a1 = a.match(/(.*)---/);
    const a2 = a1 === null ? a : a1[1];
    a2.trim;
    if (exports.sHasPfx("^")(a2.trimLeft()))
        return "";
    return a2;
};
//------------------------------------------------------------------
exports.sBrkAt = (at, len) => (a) => { return { s1: exports.sLeft(at)(a).trim(), s2: exports.sMid(at + len)(a).trim() }; };
exports.sBrk1 = (sep) => (a) => { const at = exports.sSbsPos(sep)(a); return at === -1 ? { s1: exports.sTrim(a), s2: '' } : exports.sBrkAt(at, exports.sLen(sep))(a); };
exports.sBrk2 = (sep) => (a) => { const at = exports.sSbsPos(sep)(a); return at === -1 ? { s1: '', s2: exports.sTrim(a) } : exports.sBrkAt(at, exports.sLen(sep))(a); };
exports.sBrk = (sep) => (a) => { const at = exports.sSbsPos(sep)(a); return exports.sBrkAt(at, exports.sLen(sep))(a); };
exports.quoteStrBrk = (a) => {
    const l = a.length;
    if (l === 1)
        return { q1: a, q2: a };
    if (l === 2)
        return { q1: a.substr(0, 1), q2: a.substr(1) };
    let p = exports.sSbsPos("*")(a);
    if (p === -1)
        return { q1: "", q2: "" };
    let { s1: q1, s2: q2 } = exports.sBrkAt(p, 1)(a);
    return { q1, q2 };
};
exports.sQuote = (q) => (a) => {
    let qq = exports.quoteStrBrk(q);
    if (qq === null)
        return a;
    else {
        let { q1, q2 } = qq;
        return q1 + a + q2;
    }
    ;
};
//-----------------------------------------------------------------------
exports.sTakBef = (sep) => (a) => exports.sRevBrk2(sep)(a).s1;
exports.sTakAft = (sep) => (a) => exports.sRevBrk1(sep)(a).s2;
//-----------------------------------------------------------------------
exports.sRevBrk1 = (sep) => (a) => { const at = exports.sSbsPos(sep)(a); return at === -1 ? { s1: a.trim(), s2: '' } : exports.sBrkAt(at, sep.length)(a); };
exports.sRevBrk2 = (sep) => (a) => { const at = exports.sSbsPos(sep)(a); return at === -1 ? { s1: '', s2: a.trim() } : exports.sBrkAt(at, sep.length)(a); };
exports.sRevBrk = (sep) => (a) => { const at = exports.sSbsRevPos(sep)(a); return exports.sBrkAt(at, sep.length)(a); };
exports.sRevTakBef = (sep) => (a) => exports.sRevBrk2(sep)(a).s1;
exports.sRevTakAft = (sep) => (a) => exports.sRevBrk1(sep)(a).s2;
//-----------------------------------------------------------------------
exports.sRmvFstChr = exports.sMid(1);
exports.sRmvLasChr = (a) => exports.sLeft(a.length - 1)(a);
exports.sRmvLasNChr = (n) => (a) => exports.sLeft(a.length - n)(a);
exports.sRmvSubStr = (sbs) => (a) => { const re = new RegExp(sbs, 'g'); return a.replace(re, ''); };
exports.sRmvColon = exports.sRmvSubStr(":");
exports.pthsep = path.sep;
exports.pthBrw = (a) => exports.cmdShell(exports.sFmt('explorer "?"', a));
exports.ffnPth = (a) => { const at = a.lastIndexOf(exports.pthsep); return at === -1 ? '' : exports.sLeft(at + 1)(a); };
exports.ffnFn = (a) => { const at = a.lastIndexOf(exports.pthsep); return at === -1 ? a : exports.sMid(at + 1)(a); };
exports.ffnExt = (a) => { const at = a.lastIndexOf('.'); return at === -1 ? '' : exports.sMid(at)(a); };
exports.ffnAddFnSfx = (sfx) => (a) => exports.ffnFfnn(a) + sfx + exports.ffnExt(a);
exports.ffnRmvExt = (a) => { const at = a.indexOf('.'); return at === -1 ? a : exports.sLeft(at)(a); };
exports.ffnFfnn = exports.ffnRmvExt;
exports.ffnFnn = (a) => exports.ffnFn(exports.ffnRmvExt(a));
exports.ffnRplExt = (ext) => (a) => exports.ffnRmvExt(a) + ext;
//-----------------------------------------------------------------------
exports.ftLines = (a) => (fs.readFileSync(a).toString());
exports.ftLy = (a) => exports.sSplitLines(exports.ftLines(a));
//-----------------------------------------------------------------------
exports.tmpnm = () => exports.sRmvColon(new Date().toJSON());
exports.tmppth = os.tmpdir + exports.pthsep;
exports.tmpffn = (pfx = "", ext) => exports.tmppth + pfx + exports.tmpnm() + ext;
exports.tmpfdr = (fdr) => {
    const a = exports.tmppth + 'Fdr/';
    exports.pthEns(a);
    const a1 = a + fdr + exports.pthsep;
    exports.pthEns(a1);
    const a2 = a1 + exports.tmpnm() + exports.pthsep;
    exports.pthEns(a2);
    return a2;
};
exports.tmpffnByFdrFn = (fdr, fn) => exports.tmpfdr(fdr) + fn;
exports.tmpft = () => exports.tmpffn("T", ".txt");
exports.tmpfjson = () => exports.tmpffn("T", ".json");
exports.ffnCloneTmp = (a) => {
    const o = exports.tmpffn(undefined, exports.ffnExt(a));
    fs.copyFileSync(a, o);
    fs.read;
    return o;
};
//-----------------------------------------------------------------------
exports.pm = (f, ...p) => new Promise(
/**
 * @description return a Promise of {er,rslt} by calling f(...p,cb), where cb is (er,rslt)=>{...}
 * it is usefully in creating a promise by any async f(...p,cb)
 * @param {(er,rslt)=>void} f
 * @param {...any} p
 * @see
 */
(rs, rj) => {
    f(...p, (e, rslt) => {
        e ? rj(e) : rs(rslt);
    });
});
exports.pmErRslt = (f, ...p) => new Promise((rs, rj) => {
    f(...p, (er, rslt) => {
        let z = er ? { er, rslt: null } : { er, rslt };
        rs(z);
    });
});
exports.pmRsltOpt = (f, ...p) => new Promise((rs, rj) => {
    f(...p, (er, rslt) => {
        let z = er ? null : rslt;
        rs(z);
    });
});
exports.ftLinesPm = (a) => exports.pm(fs.readFile, a).then(rslt => rslt.toString());
exports.ftLyPm = (a) => exports.ftLinesPm(a).then(lines => exports.sSplitCrLf(lines));
exports.pthEns = (a) => { if (!fs.existsSync(a))
    fs.mkdirSync(a); };
exports.isPthExist = (a) => fs.existsSync(a);
exports.assertIsPthExist = (a) => { if (!exports.isPthExist(a))
    exports.er(`path does not exist [${a}]`); };
exports.pthEnsSfxSep = (a) => exports.sLasChr(a) === exports.pthsep ? a : a + exports.pthsep;
exports.pthEnsSubFdr = (subFdr) => (a) => {
    exports.assertIsPthExist(a);
    let b = subFdr.split(/[\\\/]/);
    let c = exports.itrRmvEmp(b);
    let d = exports.pthEnsSfxSep(a);
    let e = [];
    for (let seg of c) {
        d += seg + '\\';
        e.push(d);
    }
    exports.itrEach(exports.pthEns)(e);
};
//-----------------------------------------------------------------------
exports.itrWhere = (p) => (a) => { const o = []; for (let i of a)
    if (p(i))
        o.push(i); return o; };
exports.itrExclude = (p) => (a) => { const o = []; for (let i of a)
    if (!p(i))
        o.push(i); return o; };
exports.itrMap = (f) => (a) => { const o = []; for (let i of a)
    o.push(f(i)); return o; };
exports.itrEach = (f) => (a) => { let i = 0; for (let itm of a)
    f(itm, i++); };
exports.itrFold = _itrFold => f => cum => a => { for (let i of a)
    cum = f(cum)(i); return cum; };
exports.itrReduce = f => (a) => exports.itrFold(f)(exports.itrFst(a))(a);
exports.mapKy = a => exports.itrAy(a.keys());
exports.mapVy = a => exports.itrAy(a.values());
exports.mapKvy = a => exports.itrAy(a.entries());
exports.mapKset = a => new Set(a.keys());
//---------------------------------------------------------------------------
exports.setAy = set => { const o = []; for (let i of set)
    o.push(i); return o; };
exports.setWhere = p => set => {
    const z = new Set;
    for (let i of set)
        if (p(i))
            z.add(i);
    return z;
};
exports.setAdd = x => set => { for (let i of x)
    set.add(i); return set; };
exports.setMinus = x => set => { for (let i of x)
    set.delete(i); return set; };
const _setAft = (incl, a, set) => {
    const z = new Set;
    let found = false;
    for (let i of set)
        if (found)
            z.add(i);
        else {
            if (a === i) {
                found = true;
                if (incl)
                    z.add(a);
            }
        }
    return z;
};
exports.linFstTerm = (a) => {
    let { term, remainLin } = exports.linShift(a);
    return term;
};
exports.linT2 = (a) => {
    const { term: t1, remainLin: a1 } = exports.linShift(a);
    const { term: t2, remainLin } = exports.linShift(a1);
    return t2;
};
exports.linShift = (a) => {
    const a1 = a.trim();
    const a2 = a1.match(/(\S*)\s*(.*)/);
    const o = a2 === null
        ? { term: "", remainLin: "" }
        : { term: a2[1], remainLin: a2[2] };
    return o;
};
exports.setAft = aft => a => _setAft(false, aft, a);
exports.setAftIncl = a => set => _setAft(true, a, set);
exports.setClone = set => exports.itrSet(set);
exports.itrSet = itr => { const o = new Set; for (let i of itr)
    o.add(i); return o; };
exports.itrTfmSet = (f) => (a) => { const o = new Set; for (let i of a)
    o.add(f(i)); return o; };
//---------------------------------------------------------------------------
exports.empSdic = () => new Map();
exports.lySdic = (a) => {
    const o = exports.empSdic();
    const linKs = a => {
        let { term: k, remainLin: s } = exports.linShift(a);
        return { k, s };
    };
    const x = lin => { let { k, s } = linKs(lin); o.set(k, s); };
    exports.itrEach(x)(a);
    return o;
};
exports.itrRmvEmp = (a) => exports.itrWhere(exports.isNonEmp)(a);
exports.lyPfxCnt = (pfx) => (a) => { let z = 0; exports.itrEach(lin => { if (exports.sHasPfx(pfx)(lin))
    z++; })(a); return z; };
exports.lyHasMajPfx = (pfx) => (a) => 2 * exports.lyPfxCnt(pfx)(a) > a.length;
//---------------------------------------------------------------------------
const reExpConstNm = /^export\s+const\s+([\w][\$_0-9\w_]*)/;
const reConstNm = /^const\s+([\w][\$_0-9\w_]*)/;
const reExpDollarConstNm = /^export\s+const\s+([\$\w][\$_0-9\w_]*)/;
exports.srcDry = (re) => exports.compose(exports.srcMatchAy(re), exports.itrMap(exports.matchDr));
exports.srcCol = (re) => (a) => {
    const ay = exports.srcMatchAy(re)(a);
    const c = exports.matchAyFstCol(ay);
    const c1 = exports.itrRmvEmp(c);
    const z = c1.sort();
    return z;
};
exports.aySrt = (a) => a.sort();
exports.matchDr = (a) => [...a].splice(1);
exports.matchAySdry = exports.itrMap(exports.matchDr);
exports.matchFstItm = (a) => a === null ? null : a[1];
exports.matchAyFstCol = exports.itrMap(exports.matchFstItm);
exports.srcMatchAy = exports.compose(exports.sMatch, exports.itrMap);
exports.srcExpConstNy = exports.srcCol(reExpConstNm);
exports.srcConstNy = exports.srcCol(reConstNm);
exports.srcExpConstDollarNy = exports.srcCol(reExpDollarConstNm);
exports.ftsExpConstNy = exports.compose(exports.ftLy, exports.srcExpConstNy);
exports.ftsConstNy = exports.compose(exports.ftLy, exports.srcConstNy);
exports.ftsExpConstDollarNy = exports.compose(exports.ftLy, exports.srcExpConstDollarNy);
exports.ffnFts = exports.ffnRplExt('.ts');
exports.fjsExpConstNy = exports.compose(exports.ffnFts, exports.ftsExpConstNy);
exports.fjsConstNy = exports.compose(exports.ffnFts, exports.ftsConstNy);
exports.stop = () => { debugger; };
//---------------------------------------------------------------------------
exports.isStr = v => typeof v === 'string';
exports.isNum = v => typeof v === 'number';
exports.isBool = v => typeof v === 'boolean';
exports.isObj = v => typeof v === 'object';
exports.isSy = v => {
    if (!exports.isAy(v))
        return false;
    if (exports.isEmp(v))
        return true;
    return exports.isStr(v[0]);
};
exports.isAy = u.isArray;
exports.isDte = u.isDate;
exports.isFun = u.isFunction;
exports.isPrim = u.isPrimitive;
exports.isRe = v => exports.vIsInstanceOf(RegExp);
exports.isNonNull = v => !exports.isNull(v);
exports.isNull = u.isNull;
exports.isUndefined = u.isUndefined;
exports.isNullOrUndefined = u.isNullOrUndefined;
exports.isTrue = v => v ? true : false;
exports.isFalse = v => v ? false : true;
exports.isEmp = v => v ? false : true;
exports.isNonEmp = v => v ? true : false;
exports.isOdd = n => n % 2 === 1;
exports.isEven = n => n % 2 === 0;
exports.isSpc = (s) => s === null || s === undefined || s[0] === undefined ? false : /\s/.test(s[0]);
//----------------------------------------------------------------------------
exports.sSearch = (re) => (a) => a.search(re);
exports.sBrkP123 = (quoteStr) => (a) => {
    const { q1, q2 } = exports.quoteStrBrk(quoteStr);
    if (q1 === "" || q2 === "")
        return null;
    const l = a.length;
    const q1pos = a.indexOf(q1);
    const q2pos = a.indexOf(q2, q1pos + 1);
    const len1 = q1pos;
    const pos2 = q1pos + q1.length;
    const pos3 = q2pos + q2.length;
    const len2 = pos3 - pos2 - 1;
    const p1 = a.substr(0, len1);
    const p2 = a.substr(pos2, len2);
    const p3 = a.substr(pos3);
    let z = [p1, p2, p3];
    return z;
};
//let a = sBrkP123("(backup-*)")("slkdfjlsdjf(backup-123).exe");debugger
//----------------------------------------------------------------------------
exports.itrIsAllTrue = (a) => { for (let i of a)
    if (exports.isFalse(i))
        return false; return true; };
exports.itrIsAllFalse = (a) => { for (let i of a)
    if (exports.isTrue(i))
        return false; return true; };
exports.itrIsSomeTrue = (a) => { for (let i of a)
    if (exports.isTrue(i))
        return true; return false; };
exports.itrIsSomeFalse = (a) => { for (let i of a)
    if (exports.isFalse(i))
        return true; return false; };
exports.itrPredIsAllTrue = (p) => (a) => { for (let i of a)
    if (!p(i))
        return false; return true; };
exports.itrPredIsAllFalse = (p) => (a) => { for (let i of a)
    if (p(i))
        return false; return true; };
exports.itrPredIsSomeFalse = (p) => (a) => { for (let i of a)
    if (!p(i))
        return true; return false; };
exports.itrPredIsSomeTrue = (p) => (a) => { for (let i of a)
    if (p(i))
        return true; return false; };
exports.itrBrkForTrueFalse = (p) => (a) => {
    const t = [], f = [];
    for (let i of a)
        p(i) ? t.push(i) : f.push(i);
    return { t, f };
};
exports.itrAy = (a) => { const o = []; for (let i of a)
    o.push(i); return o; };
exports.itrFst = (a) => { for (let i of a)
    return i; return null; };
exports.itrAddPfxSfx = (pfx, sfx) => (a) => exports.itrMap(exports.sAddPfxSfx(pfx, sfx))(a);
exports.itrAddPfx = (pfx) => (a) => exports.itrMap(exports.sAddPfx(pfx))(a);
exports.itrAddSfx = (sfx) => (a) => exports.itrMap(exports.sAddSfx(sfx))(a);
exports.itrWdt = (a) => exports.pipe(exports.itrMap(exports.vLen)(a))(exports.itrMax);
exports.sitrWdt = (a) => exports.pipe(exports.itrMap(exports.sLen)(a))(exports.itrMax);
exports.itrAlignL = (a) => exports.itrMap(exports.sAlignL(exports.itrWdt(a)))(a);
exports.itrClone = (a) => exports.itrMap(i => i)(a);
exports.itrFind = (p) => (a) => { for (let i of a)
    if (p(i))
        return i; return null; };
exports.itrHasDup = (a) => { const set = new Set(); for (let i of a)
    if (set.has(i)) {
        return true;
    }
    else
        set.add(i); return false; };
exports.itrDupSet = (a) => {
    const set = new Set();
    const z = new Set();
    for (let i of a)
        if (set.has(i))
            z.add(i);
        else
            set.add(i);
    return z;
};
exports.itrMax = (a) => { let o = exports.itrFst(a); if (o === null)
    return null; for (let i of a)
    if (i > o)
        o = i; return o; };
exports.itrMin = (a) => { let o = exports.itrFst(a); if (o === null)
    return null; for (let i of a)
    if (i < o)
        o = i; return o; };
//-----------------------------------------------------------------------------------------
exports.oBringUpDollarPrp = o => {
    /**
     * Bring up all {o} child object member up one level.  Throw exception if there is name conflict
     * assume all members of {o} are objects
     * @param {obj} o
     * @example
     * const $a = {a1:'a1',a2:'s2'}
     * const $b = {b1:'b1',b2:'b2'}
     * const o = {$a,$b}
     * bringUp(o)
     * eq(o,{$a,$b,a1,a2,b1,b2})
     * //-----------
     * $a.x = 1
     * $b.x = 2
     * thw(bringUp(o))
     */
    for (let chdNm in o) {
        const chd = o[chdNm];
        for (let chdMbrNm in chd) {
            if (exports.oHasPrp(chdMbrNm)(o))
                exports.er("{chdMbrNm} of {chd} exists in {o}", { chdMbrNm, chd, o });
            o[chdMbrNm] = chd[chdMbrNm];
        }
    }
    return o;
};
exports.nyCmlSdry = (a) => exports.itrMap(exports.cmlNy)(a);
exports.oCmlDry = (a) => {
    let z = exports.itrMap(n => [exports.cmlNm(n), n])(exports.oPrpNy(a));
    exports.drySrt(exports.ayEle(0))(z);
    const w = exports.sdryColWdt(0)(z);
    exports.dryColMdy(0)(exports.sAlignL(w))(z);
    return z;
};
exports.oCtorNm = (a) => a && a.constructor && a.constructor.name;
exports.oIsInstance = (instance) => (a) => a instanceof instance;
exports.oHasCtorNm = (nm) => (a) => exports.oCtorNm(a) === nm;
exports.oPrp = (prpPth) => (a) => {
    /**
 * @description return the property value of object {o} by property path {pprPth}
 * @param {string} prpPth
 * @example
 * const a = {b: {c:{1}}
 * require('assert').equal(prp('b.c')(o), 1)
 */
    for (let nm of prpPth.split('.'))
        if ((a = a[nm]) === undefined)
            return undefined;
    return a;
};
exports.oPrpAy = (prpNy) => (a) => exports.itrMap(nm => exports.oPrp(nm)(a))(prpNy);
exports.oPrpNy = (a) => Object.getOwnPropertyNames(a);
exports.oHasPrp = (prpNm) => (a) => a.hasOwnProperty(prpNm);
exports.oHasLen = exports.oHasPrp('length');
exports.oCmlObj = (a) => {
    const dry = exports.oCmlDry(a);
    const z = {};
    dry.forEach(([cmlNm, prpNm]) => z[cmlNm] = z[prpNm]);
    return z;
};
// ----------------------------------------------
const funsExport = (...f) => f.forEach(funExport);
const funExport = (f) => {
    const funName = f.name;
    if (exports.oHasPrp(funName)(exports)) {
        exports.er('the {funName} already exported', { funName });
    }
    exports.funName = f;
};
// ----------------------------------------------
exports.ayClone = (ay) => ay.slice(0, ay.length);
// ----------------------------------------------
exports.sdryColWdt = (colIx) => (a) => exports.sitrWdt(exports.dryCol(colIx)(a));
exports.sdryColWdtAy = (a) => exports.itrMap(i => exports.sdryColWdt(i)(a))(exports.nItr(exports.dryColCnt(a)));
exports.dryCol = (colIx) => (a) => exports.itrMap(exports.ayEleOrDft('')(colIx))(a);
exports.dryColCnt = (a) => exports.itrMax(exports.itrMap(exports.vLen)(a));
exports.dryCellMdy = (f) => (a) => { exports.itrEach(exports.ayMdy(f))(a); };
exports.dryClone = (a) => exports.itrMap(dr => exports.itrClone(dr))(a);
exports.dryColMdy = (colIx) => (f) => (a) => { exports.itrEach(exports.ayMdyEle(colIx)(f))(a); };
exports.sdryLines = (a) => exports.sdryLy(a).join('\r\n');
exports.wdtAyLin = (wdtAy) => "|-" + exports.itrMap(w => '-'.repeat(w))(wdtAy).join('-|-') + "-|";
exports.sdrLin = (wdtAy) => (a) => {
    let m = ([w, s]) => exports.sAlignL(w)(s);
    let z = exports.ayZip(wdtAy, a);
    let ay = exports.itrMap(m)(z);
    let s = ay.join(' | ');
    return "| " + s + " |";
};
exports.sdryLy = (a) => {
    let w = exports.sdryColWdtAy(a);
    let h = exports.wdtAyLin(w);
    let z = [h].concat(exports.itrMap(exports.sdrLin(w))(a), h);
    return z;
};
exports.itrSy = (a) => exports.itrMap(String)(a);
exports.aySy = (a) => exports.itrMap(String)(a);
exports.drySdry = exports.itrMap(exports.aySy);
exports.dryLy = (a) => exports.sdryLy(exports.drySdry(a));
exports.drsLy = (a) => {
    let { fny, dry } = a;
    let b = [fny].concat(exports.drySdry(dry));
    let c = exports.sdryLy(b);
    let z = c.slice(0, 2).concat(c[0], c.slice(2));
    return z;
};
exports.drsLines = (a) => exports.drsLy(a).join('\r\n');
exports.drySrtCol = (colAy) => (a) => {
    const x = (col) => {
        return a;
    };
    let z = a;
    for (let i = 0; i++; i < colAy.length)
        z = x(i);
};
exports.drySrt = (fun_of_dr_to_key) => (a) => a.sort((dr_A, dr_B) => exports.vvCompare(fun_of_dr_to_key(dr_A), fun_of_dr_to_key(dr_B)));
//-----------------------------------------------------------------------
exports.oyPrpCol = prpNm => oy => { const oo = []; for (let o of oy)
    oo.push(o[prpNm]); return oo; };
exports.oyPrpDry = prpNy => oy => { const oo = []; for (let o of oy)
    oo.push(exports.oPrpAy(prpNy)(o)); return oo; };
{
    const _isEsc = i => { for (let spec of "()[]{}/|.+")
        if (i === spec)
            return true; };
    const _escSpec = lik => exports.itrMap(i => i === '\\' ? '\\\\' : (_isEsc(i) ? '\\' + i : i))(lik).join(''); //; const xxx = _escSpec("abc?dd"); debugger
    const _escStar = lik => exports.itrMap(i => i === '*' ? '.*' : i)(lik).join('');
    const _escQ = lik => { const o = []; for (let i of lik)
        o.push(i === '?' ? '.' : i); return o.join(''); };
    const _esc = lik => "^" + exports.pipe(lik)(_escSpec, _escStar, _escQ) + "$";
    const _likRe = lik => new RegExp(_esc(lik));
    const _isEscSbs = i => { for (let spec of "()[]{}/|.+?*")
        if (i === spec)
            return true; };
    const _escSbs = c => c === '\\' ? '\\\\' : (_isEscSbs(c) ? '\\' + c : c);
    exports.sLik = (lik) => (a) => _likRe(a).test(a);
    exports.sHasSbs = (sbs) => (a) => {
        const _escSpec = exports.itrMap(_escSbs)(sbs).join("");
        const _sbsRe = new RegExp(_escSpec);
        let o = _sbsRe.test(a);
        return o;
    };
}
//---------------------------------------
exports.pthFnAy = (pth, lik) => {
    if (!fs.existsSync(pth))
        return null;
    const isFil = entry => fs.statSync(path.join(pth, entry)).isFile();
    let entries = fs.readdirSync(pth);
    entries = (lik === undefined) ? entries : exports.itrWhere(exports.sLik(lik))(entries);
    let o = exports.itrWhere(isFil)(entries);
    return o;
}; // const xxx = pthFnAy("c:\\users\\user\\", "sdfdf*.*"); debugger;
exports.ayZip = (a, b) => exports.itrMap(i => [a[i], b[i]])(exports.nItr(a.length));
exports.entryStatPm = async (a) => {
    debugger;
    throw 0;
};
exports.pthFnAyPm = async (a, lik) => {
    debugger;
    throw 0;
    /*
    const b = await pthStatAyPm(a, lik)
    let d: fn[] = pipe(nItr(b.length))(itrWhere(i => b[i].isFile()), itrMap(i => entries[i]))
    debugger
    return d
    */
};
exports.pthStatOptAyPm = async (a, lik) => {
    const b = await exports.pm(fs.readdir, a);
    const b1 = (lik === undefined) ? b : exports.itrWhere(exports.sLik(lik))(b);
    const j = b => path.join(a, b);
    const b2 = exports.itrMap(j)(b1);
    const stat = entry => exports.pmRsltOpt(fs.stat, entry);
    const c = exports.itrMap(stat)(b2);
    const z = await Promise.all(c);
    return z;
};
exports.pthFdrAyPm = async (a, lik) => {
};
//---------------------------------------
exports.nMultiply = x => a => a * x;
exports.nDivide = x => a => a / x;
exports.vAdd = x => a => a + x;
exports.nMinus = x => a => a - x;
exports.nDecr = exports.nMinus(1);
exports.nIncr = exports.vAdd(1);
exports.nItr = function* (n) { for (let j = 0; j < n; j++)
    yield j; };
// --------------------------------------------------------------------------
exports.vvCompare = (a, b) => a === b ? 0 : a > b ? 1 : -1;
exports.lazy = vf => { let v, done = false; return () => { if (!done) {
    v = vf();
    done = true;
} ; return v; }; };
//---------------------------------------------------------------------------
exports.optMap = (f) => (a) => a !== null ? f(a) : a;
exports.ffn = (a) => new Ffn(a);
class Ffn {
    constructor(a) {
        this._ffn = a;
        this._dotPos = a.lastIndexOf('.');
        this._sepPos = a.lastIndexOf(exports.pthsep);
    }
    zmid(at) { return exports.sMid(at)(this.ffn); }
    zleft(at) { return exports.sLeft(at)(this.ffn); }
    get ffn() { return this._ffn; }
    get pth() { const at = this._sepPos; return at === -1 ? '' : this.zleft(at + 1); }
    get fn() { const at = this._sepPos; return at === -1 ? this.ffn : this.zmid(at + 1); }
    get ext() { const at = this._dotPos; return at === -1 ? '' : this.zmid(at); }
    get noExt() { const at = this._dotPos; return at === -1 ? this.ffn : this.zleft(at); }
    get ffnn() { return this.noExt; }
    get fnn() { return exports.ffn(this.noExt).fn; }
    addFnSfx(sfx) { return this.ffnn + sfx + this.ext; }
    rplExt(ext) { return this.ffnn + ext; }
    makBackup() {
        const ext = this.ext;
        const ffnn = this.ffnn;
        const pth = this.pth;
        const ffn = this.ffn;
        let b = exports.sRight(12)(ffnn);
        const isBackupFfn = (exports.sHasPfx("(backup-")(ffn)) && (exports.sHasSfx(")")(ffn));
        const fn = this.fn;
        const backupSubFdr = `.backup\\${fn}\\`;
        const backupPth = pth + backupSubFdr;
        if (ext === '.backup')
            exports.er("given [ext] cannot be '.backup", { ext, ffnn });
        if (isBackupFfn)
            exports.er("{ffn} cannot be a backup file name", { ffn: this.ffn });
        let c = exports.pthFnAy(backupPth, ffnn + '(backup-???)' + ext);
        let nxtBackupNNN = c === null || exports.isEmp(b) ? '000' :
            exports.pipe(c)(exports.itrMax, exports.ffnRmvExt, exports.sRmvLasChr, exports.sRight(3), Number.parseInt, exports.nIncr, exports.nPadZero(3));
        const backupFfn = backupPth + exports.ffnAddFnSfx(`(backup-${nxtBackupNNN})`)(fn);
        exports.pthEnsSubFdr(backupSubFdr)(pth);
        fs.copyFileSync(this.ffn, backupFfn);
    }
}
exports.Ffn = Ffn;
// const xxx = ffn(__filename); debugger
exports.ffnMakBackup = (a) => {
    const ext = exports.ffnExt(a);
    const ffnn = exports.ffnRmvExt(a);
    const pth = exports.ffnPth(a);
    let b = exports.sRight(12)(ffnn);
    const isBackupFfn = (exports.sHasPfx("(backup-")(a)) && (exports.sHasSfx(")")(a));
    const fn = exports.ffnFn(a);
    const backupSubFdr = `.backup\\${fn}\\`;
    const backupPth = pth + backupSubFdr;
    if (ext === '.backup')
        exports.er("given [ext] cannot be '.backup", { ext, ffnn });
    if (isBackupFfn)
        exports.er("ffn cannot be a backup file name", { ffn: a });
    let c = exports.pthFnAy(backupPth, ffnn + '(backup-???)' + ext);
    let nxtBackupNNN = c === null || exports.isEmp(b) ? '000' :
        exports.pipe(c)(exports.itrMax, exports.ffnRmvExt, exports.sRmvLasChr, exports.sRight(3), Number.parseInt, exports.nIncr, exports.nPadZero(3));
    const backupFfn = backupPth + exports.ffnAddFnSfx(`(backup-${nxtBackupNNN})`)(fn);
    exports.pthEnsSubFdr(backupSubFdr)(pth);
    fs.copyFileSync(a, backupFfn);
};
exports.srcExpStmt = (a) => {
    let ny = exports.srcExpConstNy(a);
    ny = exports.itrWhere(exports.predNot(exports.sHasPfx("_")))(ny).sort();
    if (exports.isEmp(ny))
        return null;
    const x = exports.ayJnAsLines(", ", 4, 120)(ny);
    let z = "export {\r\n" + x + "\r\n}";
    return z;
};
exports.curExpStmt = () => exports.pipe(__filename)(exports.ftLy, exports.srcExpStmt);
// dmp(curExpStmt); debugger
exports.fjsRplExpStmt = fjs => {
    const oldLy = exports.ftLy(fjs);
    const newLin = exports.srcExpStmt(oldLy);
    let oldBegIx = exports.ayFindIx(exports.sHasPfx("exports {"))(oldLy);
    let oldEndIx = (() => {
        if (oldBegIx !== null) {
            for (let i = oldBegIx; i < oldLy.length; i++) {
                if (/\}/.test(oldLy[i]))
                    return i++;
            }
        }
        return 0;
    })();
    const oldLin = (oldBegIx === null || oldEndIx === null) ? null : oldLy.slice(oldBegIx, oldEndIx).join('\r\n');
    const newLines = () => {
        const hasNewLin = newLin !== null;
        const hasOldLin = oldLin !== null;
        switch (true) {
            case (hasNewLin && hasOldLin):
                if (oldBegIx !== null) {
                    oldLy.splice(oldBegIx, oldEndIx, exports.vDftStr(newLin));
                    return exports.ayJnCrLf(oldLy);
                }
                else {
                    exports.er("impossible");
                    exports.halt();
                }
            case (hasNewLin && !hasOldLin):
                return exports.ayJnCrLf(oldLy.concat(exports.vDftStr(newLin)));
            case (hasOldLin):
                if (oldBegIx === null) {
                    exports.er("impossible");
                }
                else {
                    oldLy.splice(oldBegIx, oldEndIx);
                    return exports.ayJnCrLf(oldLy);
                }
            default:
                exports.er("impossible");
                exports.halt();
        }
        return exports.ayJnCrLf(oldLy);
    };
    let a = newLines();
    if (oldLin !== newLin) {
        debugger;
        exports.ffnMakBackup(fjs);
        exports.sWrt(fjs)(newLines());
    }
};
exports.syLin = (a) => exports.itrMap(exports.sEscVbar)(a).join(' | ');
exports.linesAlignL = (wdt) => (a) => {
    const a1 = exports.sSplitCrLf(a);
    const aLas = exports.ayLas(a1);
    const n = wdt - aLas.length;
    const s = exports.nSpc(n);
    const z = a + s;
    return z;
};
exports.linesWdt = (a) => {
    const a1 = exports.sSplitCrLf(a);
    const z = exports.itrWdt(a1);
    return z;
};
exports.linesAyWdt = (a) => {
    const a1 = exports.itrMap(exports.linesWdt)(a);
    const z = exports.itrMax(a1);
    return z;
};
exports.linesAyAlignL = (a) => {
    const w = exports.linesAyWdt(a) + 1;
    const z = exports.itrMap(exports.linesAlignL(w))(a);
    return z;
};
exports.vSav = (vid) => (a) => exports.sWrt(exports.vidFjson(vid))(JSON.stringify(a));
exports.vidpth = __dirname + exports.pthsep + 'vid' + exports.pthsep;
exports.pthEns(exports.vidpth);
exports.vidpthBrw = () => exports.pthBrw(exports.vidpth);
exports.vidFjson = (a) => exports.vidpth + a + '.json';
exports.fjsonVal = (a) => JSON.parse(exports.ftLines(a));
exports.vidVal = (a) => exports.fjsonVal(exports.vidFjson(a));
exports.sSav = (sid) => (a) => exports.sWrt(exports.sidFt(sid))(JSON.stringify(a));
exports.sidpth = __dirname + exports.pthsep + 'sid' + exports.pthsep;
exports.pthEns(exports.sidpth);
exports.sidpthBrw = () => exports.pthBrw(exports.sidpth);
exports.sidFt = (a) => exports.sidpth + a + '.txt';
exports.sidStr = (a) => exports.ftLines(exports.sidFt(a));
exports.vTee = (f) => (a) => { f(a); return a; };
exports.ftWrt = (s) => (a) => fs.writeFileSync(a, s);
exports.cmdShell = child_process.exec;
exports.ftBrw = (a) => exports.cmdShell(`code.cmd "${a}"`);
exports.sBrw = (a) => { exports.pipe(exports.tmpft())(exports.vTee(exports.ftWrt(a)), exports.ftBrw); };
exports.sBrwAtFdrFn = (fdr, fn) => (a) => { exports.pipe(exports.tmpffnByFdrFn(fdr, fn))(exports.vTee(exports.ftWrt(a)), exports.ftBrw); };
exports.sjsonBrw = (a) => { exports.pipe(exports.tmpfjson())(exports.vTee(exports.ftWrt(a)), exports.ftBrw); };
exports.lyBrw = exports.compose(exports.ayJnLf, exports.sBrw);
exports.lyBrwStop = exports.compose(exports.lyBrw, exports.stop);
exports.dicBrw = exports.compose(exports.dicLy, exports.lyBrw);
exports.oJsonLines = JSON.stringify;
exports.sdryBrw = exports.compose(exports.sdryLines, exports.sBrw);
exports.dryBrw = exports.compose(exports.drySdry, exports.sdryBrw);
exports.drsBrw = exports.compose(exports.sBrw, exports.drsLines);
exports.nyBrw = exports.compose(exports.itrMap(exports.cmlNy), exports.sdryBrw);
exports.srcExpConstNyBrw = exports.compose(exports.srcExpConstNy, exports.nyBrw);
exports.ftsExpConstNyBrw = exports.compose(exports.ftLy, exports.srcExpConstNyBrw);
exports.oBrw = exports.compose(exports.oJsonLines, exports.sjsonBrw);
//---------------------- ------------------
exports.chrCd_isNm = (c) => true;
exports.chrCd = (s) => s.charCodeAt(0);
exports.chrCd_a = exports.chrCd('a');
exports.chrCd_z = exports.chrCd('z');
exports.chrCd_A = exports.chrCd('A');
exports.chrCd_Z = exports.chrCd('Z');
exports.chrCd_0 = exports.chrCd('0');
exports.chrCd_9 = exports.chrCd('9');
exports.chrCd_dollar = exports.chrCd('$');
exports.chrCd_underScore = exports.chrCd('_');
exports.chrCd_isSmallLetter = exports.vBET(exports.chrCd_a, exports.chrCd_z);
exports.chrCd_isCapitalLetter = exports.vBET(exports.chrCd_A, exports.chrCd_Z);
exports.chrCd_isLetter = exports.predsOr(exports.chrCd_isSmallLetter, exports.chrCd_isCapitalLetter);
exports.chrCd_isDigit = exports.vBET(exports.chrCd_0, exports.chrCd_9);
exports.chrCd_isDollar = exports.vEQ(exports.chrCd_dollar);
exports.chrCd_isUnderScore = exports.vEQ(exports.chrCd_underScore);
exports.chrCd_isFstNmChr = exports.predsOr(exports.chrCd_isLetter, exports.chrCd_isUnderScore, exports.chrCd_isDollar);
exports.chrCd_isNmChr = exports.predsOr(exports.chrCd_isFstNmChr, exports.chrCd_isDigit);
exports.ssetSrtBrw = (a) => exports.pipe(a)(exports.itrAy, exports.aySrt, exports.lyBrw);
exports.ssetBrw = (a) => exports.pipe(a)(exports.itrAy, exports.sBrw);
exports.linExpConstNm = (a) => {
    const m = a.match(reExpConstNm);
    if (m === null)
        return null;
    return m[1];
};
exports.nodeModuleSet = () => {
    const z = new Set();
    const _pushChildren = (m) => {
        let c;
        for (let c of m.children) {
            if (!z.has(c)) {
                z.add(c);
                _pushChildren(c);
            }
        }
    };
    _pushChildren(module);
    return z;
};
const x = (a) => {
    const ay = exports.oPrpNy(a.exports);
    const z = [];
    const id = a.id;
    for (let nm of ay) {
        const itm = a.exports[nm];
        const ty = typeof itm;
        //const funNm = ty==='function'?itm.name:''
        const m = [nm, typeof itm, id];
        z.push(m);
    }
    return z;
};
exports.drsof_exportFunctions = () => {
    const fny = ['name', 'type', 'id'];
    let dry = [];
    let md;
    const set = exports.nodeModuleSet();
    for (md of set) {
        dry = dry.concat(x(md));
    }
    const z = { fny, dry };
    return z;
};
class Dry {
    constructor(a) {
        this.dry = a;
        this._curCol = 0;
    }
    get curCol() { return this._curCol; }
    set curCol(n) { this._curCol = n; }
    get colCnt() { return exports.itrMax(exports.itrMap(exports.vLen)(this.dry)); }
    get ly() { return exports.sdryLy(this.sdry); }
    get lines() { return exports.sdryLines(this.sdry); }
    get col() { return exports.itrMap(exports.ayEleOrDft('')(this.curCol))(this.dry); }
    get sdry() { return exports.itrMap(exports.aySy)(this.dry); }
    setCurCol(n) { this.curCol = n; return this; }
    mdyAllCell(f) { exports.itrEach(exports.ayMdy(f))(this.dry); }
    clone() { return new Dry(exports.itrMap(dr => exports.itrClone(dr))(this.dry)); }
    mdyCol(f, colIx) { exports.itrEach(exports.ayMdyEle(colIx)(f))(this.dry); }
    brw() { exports.sBrw(this.lines); }
}
exports.Dry = Dry;
exports.dry = (a) => new Dry(a);
// ================
if (module.id === '.') {
    const tst__Dry = () => {
        const a = new Dry(exports.nyCmlSdry(exports.srcExpConstNy(src())));
        debugger;
    };
    const tst__drsOf_exportFunctions = () => {
        require('webpack');
        require('curryfun');
        const a = exports.drsof_exportFunctions();
        const xx = exports.dry(a.dry);
        xx.setCurCol(1).brw();
        debugger;
        //drsBrw(a)
    };
    const src = () => exports.ftLy(exports.ffnFts(__filename));
    const tst__srcExpConstNy = () => exports.pipe(src())(exports.srcExpConstNy, exports.lyBrwStop);
    const tst__pthFnAyPm = () => exports.pthFnAyPm(__dirname).then(exports.lyBrwStop);
    const tst__cmlSpcNm = () => exports.pipe(__filename)(exports.ffnFts, exports.ftsExpConstNy, exports.itrMap(exports.cmlSpcNm), exports.lyBrwStop);
    const tst__sNmSet = () => exports.pipe(__filename)(exports.ftLines, exports.sNmSet, exports.ssetSrtBrw, exports.stop);
    const tst__cmlNy = () => exports.cmlNy('abAySpc');
    const tst__sLik = () => { if (!exports.sLik("abc?dd")("abcxdd")) {
        debugger;
    } };
    const tst__ftsExpConstNyBrw = () => exports.pipe(__filename)(exports.ffnFts, exports.ftsExpConstNyBrw, exports.stop);
    const tst__sBox = () => exports.sBrw(exports.sBox('johnson xx'));
    const tst__pthBrw = () => exports.pthBrw(exports.tmppth);
    const tst__sBrwAtFdrFn = () => exports.sBrwAtFdrFn('aa', '1.json')('[1,2]');
    const tst__isEq = () => {
        if (exports.isEq(1, '1'))
            debugger;
        if (!exports.isEq(1, 1))
            debugger;
        if (!exports.isEq({ a: 1 }, { a: 1 }))
            debugger;
    };
    const tst__vidVal = () => {
        const v = '234234';
        exports.vSav('a')(v);
        const v1 = exports.vidVal('a');
        exports.assertIsEq(v, v1);
    };
    const tst__sidStr = () => {
        const s = '234234';
        exports.sSav('a')(s);
        const s1 = exports.vidVal('a');
        exports.assertIsEq(s, s1);
    };
    const tst__vidpthBrw = () => exports.vidpthBrw();
    const tst__sidpthBrw = () => exports.sidpthBrw();
    tst__srcExpConstNy();
    //tst__vidVal()
    //tst__sidStr()
    //tst__vidpthBrw()
    //tst__isEq()
    //tst__pthBrw()
    //tst__sBrwAtFdrFn()
    /*
    tst__drsOf_exportFunctions()
    tst__pthFnAyPm()
    tst__cmlSpcNm ()
    tst__sNmSet   ()
    tst__cmlNy    ()
    tst__sLik     ()
    tst__ftsExpConstNyBrw()
    */
}
//# sourceMappingURL=curryfun.js.map