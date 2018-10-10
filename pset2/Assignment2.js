// JavaScript source code



////////////////
// Problem 2
///////////////

var NUM = "NUM";
var FALSE = "FALSE";
var VR = "VAR";
var PLUS = "PLUS";
var TIMES = "TIMES";
var LT = "LT";
var AND = "AND";
var NOT = "NOT";

var SEQ = "SEQ";
var IFTE = "IFSTMT";
var WHLE = "WHILESTMT";
var ASSGN = "ASSGN";
var SKIP = "SKIP";
var ASSUME = "ASSUME";
var ASSERT = "ASSERT";
var HOARE = "HOARE";
var STATE = "STATE";
var SUST = "SUST";
var EMPTY = "EMPTY";
var INVARIANT = "INVARIANT";
var INVARIANT_VAR = "INVARIANT VAR";

function str(obj) { return JSON.stringify(obj); }

//Constructor definitions for the different AST nodes.

function flse() {
    return { type: FALSE, toString: function () { return "false"; } };
}

function vr(name) {
    return { type: VR, name: name, toString: function () { return this.name; } };
}
function num(n) {
    return { type: NUM, val: n, toString: function () { return this.val; } };
}
function plus(x, y) {
    return { type: PLUS, left: x, right: y, toString: function () { return "(" + this.left.toString() + "+" + this.right.toString() + ")"; } };
}
function times(x, y) {
    return { type: TIMES, left: x, right: y, toString: function () { return "(" + this.left.toString() + "*" + this.right.toString() + ")"; } };
}
function lt(x, y) {
    return { type: LT, left: x, right: y, toString: function () { return "(" + this.left.toString() + "<" + this.right.toString() + ")"; } };
}
function and(x, y) {
    return { type: AND, left: x, right: y, toString: function () { 
      return "(" + this.left.toString() + "&&" + this.right.toString() + ")"; } };
}

function not(x) {
    return { type: NOT, left: x, toString: function () { return "(!" + this.left.toString() + ")"; } };
}


function seq(s1, s2) {
    return { type: SEQ, fst: s1, snd: s2, toString: function () { return "" + this.fst.toString() + ";\n" + this.snd.toString(); } };
}


function assume(e) {
    return { type: ASSUME, exp: e, toString: function () { return "assume " + this.exp.toString(); } };
}

function assert(e) {
    return { type: ASSERT, exp: e, toString: function () { return "assert " + this.exp.toString(); } };
}

function assgn(v, val) {
    return { type: ASSGN, vr: v, val: val, toString: function () { return "" + this.vr + ":=" + this.val.toString(); } };
}

function ifte(c, t, f) {
    return { type: IFTE, cond: c, tcase: t, fcase: f, toString: function () { return "if(" + this.cond.toString() + "){\n" + this.tcase.toString() + '\n}else{\n' + this.fcase.toString() + '\n}'; } };
}

function whle(c, b) {
    return { type: WHLE, cond: c, body: b, toString: function () { return "while(" + this.cond.toString() + "){\n" + this.body.toString() + '\n}'; } };
}

function skip() {
    return { type: SKIP, toString: function () { return "/*skip*/"; } };
}

function hoare(pre, command, pos) {
    return {
      type: HOARE,
      pre: pre,
      command: command,
      pos: pos,
      toString: function () {
        return "hoare(" + this.pre.toString() + ", " + this.command.toString() + ", " + pos.toString() + ")";
      }
    };
}

function state(conditions) {
    return {
      type: STATE,
      conditions: conditions,
      toString: function () {
        return "state(" + conditions.toString() + ")";
      }
    }
}

function sust(state, vr, val) {
    return {
      type: SUST,
      state: state,
      vr: vr,
      val: val,
      toString: function () {
        return "sust(" + state.toString() + ", [" + vr.toString() + " := " + val.toString() + "])";
      }
    }
    /*
    if (command.type == VR && command.name == vr) {
        return val;
    }
    if (command.type == PLUS || command.type == TIMES || command.type == LT || command.type == AND) {
        left = sust(command.left, vr, val);
        right = sust(command.right, vr, val);
        if (command.type == PLUS)
          return plus(left, right);
        if (command.type == TIMES)
          return times(left, right);
        if (command.type == LT)
          return lt(left, right);
        if (command.type == AND)
          return and(left, right);
    }
    if (command.type == NOT) {
        return not(sust(command.left, vr, val));
    }

    return command;
    */
}

function or(x, y) {
    return not(and(not(x), not(y)))
}

function empty() {
    return {
      type: EMPTY,
      toString: function () {
        return "empty";
      }
    }
}

function implication(x, y) {
    return not(and(x, not(y)));
}

function invariant(i) {
    return {
      type: INVARIANT,
      index: i,
      toString: function () {
        return "Invariant("+ i.toString() +")"
      }
    }
}

function invariantVar(vr) {
    return {
      type: INVARIANT_VAR,
      vr: vr,
      toString: function () {
        return "Invariant(" + vr.toString() + ")"
      }
    }
}

//some useful helpers:

function eq(x, y) {
    return and(not(lt(x, y)), not(lt(y, x)));
}

function tru() {
    return not(flse());
}

function block(slist) {
    if (slist.length == 0) {
        return skip();
    }
    if (slist.length == 1) {
        return slist[0];
    } else {
        return seq(slist[0], block(slist.slice(1)));
    }
}

//The stuff you have to implement.
// Returns a list of variables that changes during the while
function getVars(command) {
    /*
    if (command.type == VR) {
        return [command];
    }
    if (command.type == PLUS || command.type == TIMES || command.type == LT || command.type == AND) {
        left = getVars(command.left);
        right = getVars(command.right);
        return [...new Set([...left, ...right])];
    }
    if (command.type == NOT) {
        return getVars(command.left);
    }
    */
    if (command.type == ASSGN) {
        return command.vr;
    }
    if (command.type == SEQ) {
        fst = getVars(command.fst);
        snd = getVars(command.snd);
        return [...new Set([...fst, ...snd])];
    }
    if (command.type == IFTE) {
        tcase = getVars(command.tcase);
        fcase = getVars(command.fcase);
        return [...new Set([...tcase, ...fcase])];
    }
    if (command.type == WHLE) {
        body = getVars(command.body);
        return body;
    }

    return [];
}

// This function returns a State AST
function vc(command, B) {
    if (command.type == SEQ) {
        second = vc(command.snd, B);
        return vc(command.fst, second.conditions);
    }
    if (command.type == IFTE) {
        tcase = vc(command.tcase, B);
        fcase = vc(command.fcase, B);
        return state(
          or(
            and(
              command.cond,
              tcase.conditions
            ),
            and(
              not(command.cond),
              fcase.conditions
            )
          )
        );
    }
    if (command.type == WHLE) {
        // This is the while invariant
        var invariant_while = invariant(invariant_index);
        invariant_index += 1;
        var vrs = getVars(command.body);
        var last = invariant_while;
        // We add all the invariants with the vars in the condition
        for (var i = 0; i < vrs.length; i++) {
            last = and(last, invariantVar(vrs[i]));
        }
        var implication_1 = implication(not(command.cond), B);
        var implication_2 = implication(command.cond, vc(command.body, invariant_while));
        var and_implications = and(implication_2, implication_1);
        return state(implication(last, and_implications));
        
    }
    if (command.type == ASSGN) {
        return state(sust(B, command.vr, command.val));
    }
    if (command.type == SKIP) {
        return state(B);
    }
    if (command.type == ASSUME) {
        return state(implication(command.exp, B));
    }
    if (command.type == ASSERT) {
        return state(and(B, command.exp));
    }
    return state(B);
}

function computeVC(prog) {
    //Compute the verification condition for the program leaving some kind of place holder for loop invariants.
	  // The input prog is an AST. The output is an AST representing the verification condition.
	  invariant_index = 0;
	  // This will write in the console the verification condition of the program.
	  // The Verification Condition answer is a state AST.
    writeToConsole(vc(prog, empty()).toString());
}

function genSketch(vc) {
    //Write a pretty printer that generates a sketch from the verification condition.
    //You can write your generators as a separate library, but you may do better by creating generators specialized for your problem.
	  //The input is the VC that was generated by computeVC. The output is a String 
	  //representing the sketch that you can feed to the sketch solver to synthesize the invariants.
}



function P2a() {
    var prog = eval(document.getElementById("p2input").value);
    computeVC(prog);
    /*
    clearConsole();
    writeToConsole("Just pretty printing for now");
    writeToConsole(prog.toString());
    */
}

function P2b() {
    var prog = eval(document.getElementById("p2input").value);
    clearConsole();
    writeToConsole("Just pretty printing for now");
    writeToConsole(prog.toString());
}


//Some functions you may find useful:
function randInt(lb, ub) {
    var rf = Math.random();
    rf = rf * (ub - lb) + lb;
    return Math.floor(rf);
}

function randElem(from) {
    return from[randInt(0, from.length)];
}

function writeToConsole(text) {
    var csl = document.getElementById("console");
    if (typeof text == "string") {
        csl.textContent += text + "\n";
    } else {
        csl.textContent += text.toString() + "\n";
    }
}

function clearConsole() {
    var csl = document.getElementById("console");
    csl.textContent = "";
}
