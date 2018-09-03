// JavaScript source code

var NUM = "NUM";
var FALSE = "FALSE";
var VR = "VAR";
var PLUS = "PLUS";
var TIMES = "TIMES";
var LT = "LT";
var AND = "AND";
var NOT = "NOT";
var ITE = "ITE";

var ALLOPS = [NUM, FALSE, VR, PLUS, TIMES, LT, AND, NOT, ITE];

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
    return { type: PLUS, left: x, right: y, toString: function () { return "("+ this.left.toString() + "+" + this.right.toString()+")"; } };
}
function times(x, y) {
    return { type: TIMES, left: x, right: y, toString: function () { return "(" + this.left.toString() + "*" + this.right.toString() + ")"; } };
}
function lt(x, y) {
    return { type: LT, left: x, right: y, toString: function () { return "(" + this.left.toString() + "<" + this.right.toString() + ")"; } };
}
function and(x, y) {
    return { type: AND, left: x, right: y, toString: function () { return "(" + this.left.toString() + "&&" + this.right.toString() + ")"; } };
}
function not(x) {
    return { type: NOT, left: x, toString: function () { return "(!" + this.left.toString()+ ")"; } };
}
function ite(c, t, f) {
    return { type: ITE, cond: c, tcase: t, fcase: f, toString: function () { return "(if " + this.cond.toString() + " then " + this.tcase.toString() + " else " + this.fcase.toString() + ")"; } };
}


//Interpreter for the AST.
function interpret(exp, envt) {
    switch (exp.type) {
        case FALSE: return false;
        case NUM: return exp.val;
        case VR: return envt[exp.name];
        case PLUS: return interpret(exp.left, envt) + interpret(exp.right, envt);
        case TIMES: return interpret(exp.left, envt) * interpret(exp.right, envt);
        case LT: return interpret(exp.left, envt) < interpret(exp.right, envt);
        case AND: return interpret(exp.left, envt) && interpret(exp.right, envt);
        case NOT: return !interpret(exp.left, envt);
        case ITE: if (interpret(exp.cond, envt)) { return interpret(exp.tcase, envt); } else { return interpret(exp.fcase, envt); }
    }
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
        csl.value += text + "\n";
    } else {
        csl.value += text.toString() + "\n";
    }
}


function grow(intOps, boolOps, numL, boolL, varsL, constsL) {
  var newLevelNumL = []
  var newLevelBoolL = []
  // Booleans
  boolOps.forEach(function(item, index) {
    if (item == LT) {
      numL.forEach(function(item1, index1) {
        numL.forEach(function(item2, index2) {
          newLevelBoolL.push(lt(item1, item2));
        });
      });
    } else if (item == AND) {
      boolL.forEach(function(item1, index1) {
        boolL.forEach(function(item2, index2) {
          newLevelBoolL.push(and(item1, item2));
        });
      });
    } else if (item == NOT) {
      boolL.forEach(function(item1, index1) {
        newLevelBoolL.push(not(item1));
      });
    }
  });

  // Numbers
  intOps.forEach(function(item, index) {
    if (item == ITE) {
      boolL.forEach(function(itemBool, indexBool) {
        numL.forEach(function(item1, index1) {
          numL.forEach(function(item2, index2) {
            newLevelNumL.push(ite(itemBool, item1, item2));
          });
        });
      });
    } else if  (item == PLUS) {
      numL.forEach(function(item1, index1) {
        numL.forEach(function(item2, index2) {
          newLevelNumL.push(plus(item1, item2));
        });
      });
    } else if (item == TIMES) {
      numL.forEach(function(item1, index1) {
        numL.forEach(function(item2, index2) {
          newLevelNumL.push(times(item1, item2));
        });
      });
    }
  });
  return {"newLevelNumL": newLevelNumL, "newLevelBoolL": newLevelBoolL}
}


function growFaster(intOps, boolOps, numL, boolL, varsL, constsL) {
  var newLevelNumL = []
  var newLevelBoolL = []
  var level1 = varsL.concat(constsL);
  // Booleans
  boolOps.forEach(function(item, index) {
    if (item == LT) {
      level1.forEach(function(item1, index1) {
        level1.forEach(function(item2, index2) {
          newLevelBoolL.push(lt(item1, item2));
        });
      });
    } else if (item == AND) {
      boolL.forEach(function(item1, index1) {
        boolL.forEach(function(item2, index2) {
          newLevelBoolL.push(and(item1, item2));
        });
      });
    } else if (item == NOT) {
      boolL.forEach(function(item1, index1) {
        newLevelBoolL.push(not(item1));
      });
    }
  });

  // Numbers
  intOps.forEach(function(item, index) {
    if (item == ITE) {
      boolL.forEach(function(itemBool, indexBool) {
        numL.forEach(function(item1, index1) {
          numL.forEach(function(item2, index2) {
            newLevelNumL.push(ite(itemBool, item1, item2));
          });
        });
      });
    } else if  (item == PLUS) {
      numL.forEach(function(item1, index1) {
        numL.forEach(function(item2, index2) {
          newLevelNumL.push(plus(item1, item2));
        });
      });
    } else if (item == TIMES) {
      varsL.forEach(function(item1, index1) {
        constsL.forEach(function(item2, index2) {
          newLevelNumL.push(times(item1, item2));
        });
      });
      varsL.forEach(function(item1, index1) {
        varsL.forEach(function(item2, index2) {
          newLevelNumL.push(times(item1, item2));
        });
      });
    }
  });
  return {"newLevelNumL": newLevelNumL, "newLevelBoolL": newLevelBoolL}
}


function elimEquivalents(numL, boolL, inputs) {
  // Numbers
  outputsNumL = {};
  newNumL = []
  numL.forEach(function(item, index) {
    var outputsStr = "";
    inputs.forEach(function(input, indexIn) {
      outputsStr += interpret(item, input).toString() + " | ";
    })
    if (outputsNumL[outputsStr] === undefined) {
      outputsNumL[outputsStr] = index;
      newNumL.push(item);
    }
  });
  // Booleans
  outputsBoolL = {};
  newBoolL = []
  boolL.forEach(function(item, index) {
    var outputsStr = "";
    inputs.forEach(function(input, indexIn) {
      outputsStr += interpret(item, input).toString() + " | ";
    })
    if (outputsBoolL[outputsStr] === undefined) {
      outputsBoolL[outputsStr] = index;
      newBoolL.push(item);
    }
  });
  return {"newNumL": newNumL, "newBoolL": newBoolL};
}


function isCorrect(program, inputoutputs) {
  var count = 0
  for (j = 0; j < inputoutputs.length; j++) {
    if (interpret(program, inputoutputs[j]) == inputoutputs[j]._out) {
      count += 1;
    } else {
      break;
    } 
  }
  if (inputoutputs.length == count) {
    return true;
  }
  return false;
}


function bottomUpAux(globalBnd, intOps, boolOps, vars, consts, inputoutputs, growFunction) {
  // Complete the body of randomExpr
  // plist = set all terminals
  // The terminal variables that we have are num, false and var.
  var numL = consts.map(function(el) { return num(el); });
  var constsL = numL;
  var varsL = []
  var boolL = [flse()]
  // Checking the type of the input
  if (inputoutputs.length == 0) {
    return "NYI";
  }
  vars.forEach(function(item, index) {
    // Put the input in their place depending on the type
    if (typeof inputoutputs[0][item] == "number") {
      numL.push(vr(item));
      varsL.push(vr(item));
    } else {
      boolL.push(vr(item));
    }
  });
  // Checking the type of the output
  var outputType = "";
  if (typeof inputoutputs[0]._out === "number") {
    outputType = "num";
  } else {
    outputType = "bool";
  }
  
  // while true
  for (i = 0; i < globalBnd; i++) {
    // grow plist
    newLevel = growFunction(intOps, boolOps, numL, boolL, varsL, constsL);
    numL = numL.concat(newLevel.newLevelNumL);
    boolL = boolL.concat(newLevel.newLevelBoolL);
    // elimEquivalents(plist, inputs)
    newL = elimEquivalents(numL, boolL, inputoutputs);
    numL = newL.newNumL;
    boolL = newL.newBoolL;
    // for all in plist
    // if isCorrect(p, inputs, outputs)): return p
    if (outputType == "num") {
      for (index = 0; index < numL.length; index++) {
        if (isCorrect(numL[index], inputoutputs)) {
          return numL[index];
        }
      }
    } else {
      for (index = 0; index < boolL.length; index++) {
        if (isCorrect(boolL[index], inputoutputs)) {
          return boolL[index];
        }
      }
    }
  }
  return "NYI";
}


function bottomUp(globalBnd, intOps, boolOps, vars, consts, inputoutputs) {
  return bottomUpAux(globalBnd, intOps, boolOps, vars, consts, inputoutputs, grow);
}


function bottomUpFaster(globalBnd, intOps, boolOps, vars, consts, inputoutputs){
  return bottomUpAux(globalBnd, intOps, boolOps, vars, consts, inputoutputs, growFaster);
}


function run1a1(){
	
	var rv = bottomUp(3, [VR, NUM, PLUS, TIMES, ITE], [AND, NOT, LT, FALSE], ["x", "y"], [4, 5], [{x:5,y:10, _out:5},{x:8,y:3, _out:3}]);
	writeToConsole("RESULT: " + rv.toString());
	var rv2 = bottomUp(3, [VR, NUM, PLUS, TIMES, ITE], [AND, NOT, LT, FALSE], ["x", "y"], [1], [{x:5,y:10, _out:5},{x:8,y:3, _out:3}, {x:1,y:6, _out:1},{x:-1,y:4, _out:-1},{x:8,y:4, _out:4},{x:10,y:0, _out:0},]);
	writeToConsole("RESULT2: " + rv2.toString());
	
}


function run1a2(){
	
	var rv = bottomUp(3, [VR, NUM, PLUS, TIMES, ITE], [AND, NOT, LT, FALSE], ["x", "y"], [-1, 5], [
		{x:10, y:7, _out:17},
		{x:4, y:7, _out:-7},
		{x:10, y:3, _out:13},
		{x:1, y:-7, _out:-6},
		{x:1, y:8, _out:-8}		
		]);
	writeToConsole("RESULT: " + rv.toString());
	
}


function run1b(){
	
	var rv = bottomUpFaster(3, [VR, NUM, PLUS, TIMES, ITE], [AND, NOT, LT, FALSE], ["x", "y"], [-1, 5], [
		{x:10, y:7, _out:17},
		{x:4, y:7, _out:-7},
		{x:10, y:3, _out:13},
		{x:1, y:-7, _out:-6},
		{x:1, y:8, _out:-8}		
		]);
	writeToConsole("RESULT: " + rv.toString());
	
}



//Useful functions for exercise 2. 
//Not so much starter code, though.

function getConstantsInput(inputoutput) {
  // Calculates the constants for every posible term.
  // We only have 3 types of terms: 2*x + ??; x*x + ??; 3*x + ??;
  // Because of there are only 3 terms, this code is O(3) = O(1).
  var input = inputoutput[0];
  var output = inputoutput[1];
  return [output-2*input, output-input*input, output-3*input];
}


function sameGroup(inout1, inout2) {
  // Every call of getConstantsInput is O(1).
  // So get the constants of both inputs is O(2) = O(1).
  var cons1 = getConstantsInput(inout1);
  var cons2 = getConstantsInput(inout2);
  // Bit mask that represents the constants where they intercept.
  var mask = 0;
  for (var i = 0; i < 3; i++) {
    if (cons1[i] == cons2[i]) {
      // We light on the bit that represents the group.
      mask = mask | (1 << (i));
    }
  }
  // We return the bit mask that represents the constants where intercepts
  // in both inouts.
  return mask;
}


function sameGroupL(inputoutputs) {
  if (inputoutputs.length == 0) {
    return 0;
  }
  // All the bits are 1 at the beginnig. 7b10 = 111b2
  var mask = 7;
  for (var i = 1; i < inputoutputs.length; i++) {
    mask = mask & sameGroup(inputoutputs[i-1], inputoutputs[i]);
  }
  return mask;
}


function haveSameGroup(inout1, inout2) {
  return sameGroup(inout1, inout2) != 0;
}


function getMin(inputoutputs) {
  // Gets the actual min. It takes O(n)
  var actual_min = inputoutputs[0];
  
  for(var i = 1; i < inputoutputs.length; i++) {
    if (inputoutputs[i][0] < actual_min[0]) {
      actual_min = inputoutputs[i];
    }
  }
  return actual_min;
}


function getMax(inputoutputs) {
  // Gets the actual max. It takes O(n)
  var actual_max = inputoutputs[0];
  
  for(var i = 1; i < inputoutputs.length; i++) {
    if (inputoutputs[i][0] > actual_max[0]) {
      actual_max = inputoutputs[i];
    }
  }
  return actual_max;
}


function getCons(inputoutput, mask) {
  if ((mask & 1) == 1) {
    return getConstantsInput(inputoutput)[0];
  }
  if ((mask & 2) == 2) {
    return getConstantsInput(inputoutput)[1];
  }
  return getConstantsInput(inputoutput)[2];
}


function divideInGroups(inputoutputs) {
  var groups = []
  // Put all inputs in the first group
  var actual_group = inputoutputs;
  var actual_min = 0;
  var next_group = [];
  var group = [];
  var next_min = 0;
  var next_group = [];
  var group = [];
  var mask = 0;
  // We only have 3 iterations. So this is O(1).
  for (var j = 0; j < 3; j++) {
    // Get the min in the group. This takes O(n)
    actual_min = getMin(actual_group);
    next_group = [];
    group = [];
    // This takes O(n).
    actual_group.forEach(function(item, index) {
      if (haveSameGroup(actual_min, item)) {
        group.push(item);
      } else {
        next_group.push(item);
      }
    });
    // This is when there isn't other group
    if (next_group.length == 0) {
      mask = sameGroupL(group);
      groups.push([getMax(group)[0], mask, getCons(group[0], mask)]);
      return groups;
    }
    // Get the min of the next group. This takes O(n)
    next_min = getMin(next_group);
    actual_group = group;
    group = [];
    // This takes O(n)
    actual_group.forEach(function(item, index) {
      if (item[0] < next_min[0]) {
        group.push(item);
      } else {
        next_group.push(item);
      }
    });
    // Gets the bit mask of the group that share the same constant in a term
    mask = sameGroupL(group);
    console.log(group);
    groups.push([getMax(group)[0], mask, getCons(group[0], mask)]);
    actual_group = next_group;
  }
  // Because of there is only 3 iterations of the for,
  // it takes O(3n) = O(n)
  mask = sameGroupL(next_group);
  groups.push([getMax(next_group)[0], mask, getCons(next_group[0], mask)]);
  
  return groups;
}


function getTerm2(mask, cons) {
  if ((mask & 1) == 1) {
    return plus(times(num(2), vr('x')), num(cons));
  }
  if ((mask & 2) == 2) {
    return plus(times(vr('x'), vr('x')), num(cons));
  }
  return plus(times(num(3), vr('x')), num(cons));
}


function structured(inputoutputs){
  // divideInGroups is the function that do all the job. It is O(n)
  // See the function description for more information.
  var groups = divideInGroups(inputoutputs).reverse();
  var program;
  // getTerm2 is O(1).
  var last_program = getTerm2(groups[0][1], groups[0][2]);
  // We have at most 4 groups so this for repeats at most 3 times.
  for (var i = 1; i < groups.length; i++) {
    // getTerm2 is O(1)
    program = ite(lt(vr('x'), groups[i][0]+1), getTerm2(groups[i][1], groups[i][2]), last_program);
    last_program = program;
  }
  // Because of that every operation in the for is O(1), then the for is O(1).
  return last_program;
}


function run2() {
  var inpt = JSON.parse(document.getElementById("input2").value);
  //This is the data from which you will synthesize.
  // data tests
  // inpt = [[6, 17],[5,15],[40,88],[7,19],[11,40],[8,70],[41,90],[31,100],[13,46],[10,106]]
  // inpt = [[6, 17], [40, 88]]
  writeToConsole(structured(inpt).toString());
}


function genData() {
    //If you write a block of code in program1 that writes its output to a variable out,
    //and reads from variable x, this function will feed random inputs to that block of code
    //and write the input/output pairs to input2.
    program = document.getElementById("program1").value
    function gd(x) {
        var out;
        eval(program);
        return out;
    }
    textToIn = document.getElementById("input2");
    textToIn.value = "[";
    for(var i=0; i<10; ++i){
        if(i!=0){ textToIn.value += ", "; }
        var inpt = randInt(0, 100);
        textToIn.value += "[" + inpt + ", " + gd(inpt) + "]";
    }
    textToIn.value += "]";
}
