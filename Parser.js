function Parser(exp){
	
	var variableValues = {};
	var expression;
	var iElement;
	
	//Constants
	var CONSTANTS ={};
	CONSTANTS["pi"] = Math.PI;
	CONSTANTS["e"] = Math.E;
	var RESERVED_NAMES = new Array	(	//Operations
										"sin",
										"cos",
										"tan",
										"log",
										"min",
										"max",
										"abs",
										//constants
										"pi",
										"e"
									)
	
	Parser(exp);
	/**
	 *Creates the object with the expression to be evaluated
	 *@param 	exp		The expression to be evaluated.
	*/
	function Parser(exp){
		if(typeof(exp) == "string"){
			expression = exp;
		}else{
			throw "String expected for expression, but "+typeof(exp)+" received.";
		}
	}
	
	/**
	 *Set a variable value, if the variable already exists, changes its value, else creates the variable with the passed value.
	 *Similar to variable = value.
	 *
	 *@param 	variable 	Variable name (type: string)
	 *@param 	value 		Variable value (type: int or float)
	*/
	this.setVariable = function(variable, value){
		if(typeof(variable) != "string"){
			throw "String expected for variable, but "+typeof(exp)+" received.";
		}
		if(!__verifyVariable(variable)){
			throw "Invalid characters in variable name.";
		}
		if(__isReservedName(variable)){
			throw "This name is a function or a constant.";
		}
		if(typeof(value) == "number"){
			throw "Invalid value.";
		}
		variableValues[variable] = value.toString();
		return true;
	}
	
	/**
	 *Changes the expression to be evaluated
	 *@param	newExp		The new expression(type: string)
	*/
	this.changeExpression = function(newExp){
		if(typeof(newExp) == "string"){
			expression = newExp;
		}else{
			throw "String expected for expression, but "+typeof(newExp)+" received.";
		}
	}	
	
	this.evaluate = function(){
		var exp = __replaceValues();
		if(/^[^0-9\^\-\+\*\\\(\)]$/g.test(exp)){
			throw "Some illegal characters or unset variables in the expression.";
		}
		return __expressionResult(exp);
	}
	
	//DEBUG PROPOSE
	/**
	 *Gives the variable value.
	 *@param	variable	The variable name.
	*/
	this.getValue = function(variable){
		if(!(variable in variableValues)){
			console.log("variável inválida");
		}else{
			console.log(variable + " = " + variableValues[variable]);
		}
	}
	
	/**
	 *Verify if the variable exists.
	 *@param	variable	The variable name.
	*/
	this.variableExists = function(variable){
		return variable in variableValues;
	}
	
	//PRIVATE METHODS
	/**
	 *Verify if the variable respect name rules
	 *@param	name	The name to be verified.
	*/
	function __verifyVariable(name){
		var rule = new RegExp("^[A-Za-z_][0-9A-Za-z_]*$");
		return rule.test(name);
	}
	
	/**
	 *Verify if this name is used for some operations
	 *@param	name	The name to be verified. 
	*/
	function __isReservedName(name){
		return RESERVED_NAMES.indexOf(name) > -1
	}
	
	/**
	 *Replace variables with their respective values
	*/
	function __replaceValues(){
		var result = expression;
		//substitute variable values
		for(var key in variableValues){
			var regex = new RegExp("\\b"+key+"\\b", "g");
			result = result.replace(regex, variableValues[key]);
		}
		//substitute constant values
		for(var key in CONSTANTS){
			var regex = new RegExp("\\b"+key+"\\b", "g");
			result = result.replace(regex, CONSTANTS[key]);
		}
		return result;
	}
	
	/**
	 *Compile and get the value of the expression
	 *@param	exp		The expression to be calculated.
	*/
	function __expressionResult(exp){
		iElement = 0;
		return __expression(exp);
	}
	//PARSER RULES
	/*
		number     	= {"0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"."|" "}
		factor  	= number | "(" expression ")" | wordInFunctionsArray"(" factor ["," factor] ")"
		element 	= factor [{"^" factor}]
		component  	= element [{("*" | "/") element}]
		expression 	= component [{("+" | "-") component}]
	*/
	function __expression(exp){
		var result = 0;
		result = __component(exp);
		while(iElement < exp.length){
			if(exp[iElement] == "+"){
				iElement++;
				result += __component(exp);
			}else if(exp[iElement] == "-"){
				iElement++;
				result -= __component(exp);
			}else if(exp[iElement] == ")" || exp[iElement] == ","){
				break;
			}
		}
		return result;
	}
	
	function __component(exp){
		var result = 0;
		result = __element(exp);
		if(exp[iElement] == "*"){
			iElement++;
			result *= __element(exp);
		} else if(exp[iElement] == "/"){
			iElement++;
			result /= __element(exp);
		}
		return result;
	}
	
	function __element(exp){
		var result = 0;
		result = __factor(exp);
		if(exp[iElement] == "^"){
			iElement++;
			result = Math.pow(result,__factor(exp));
		}
		return result;
	}
	
	function __factor(exp){
		var result = 0;
		var functions = new Array("sin", "cos", "tan","log","max","min","abs");
		if(exp[iElement] == "("){
			iElement++;
			result = __expression(exp);
			if(exp[iElement] != ")") throw "Missing ')' in column "+iElement.toString()+".";
			iElement++;
		}else if(functions.indexOf(exp[iElement]+exp[iElement+1]+exp[iElement+2]) > -1 && exp[iElement+3] == "("){
			//function verify
			var f = exp[iElement]+exp[iElement+1]+exp[iElement+2];
			iElement += 4;
			var num1, num2;
			var verifyNum2 = false;
			num1 = __expression(exp);
			if(exp[iElement] == ","){
				if(parseFloat(num1) != parseFloat(num1)) throw "Expected a number in column "+iElement-1+".";
				iElement++;
				verifyNum2 = true;
				num2 = __expression(exp);
			}
			if(exp[iElement] != ")") throw "Missing ')' in column "+iElement.toString()+".";
			iElement++;
			if(verifyNum2){
				if(parseFloat(num2) != parseFloat(num2)) throw "Expected a number in column "+iElement-2+".";
			}else{
				if(parseFloat(num1) != parseFloat(num1)) throw "Expected a number in column "+iElement-2+".";
			}
			if(f == "sin"){
				result = Math.sin(num1);
			}else if(f == "cos"){
				result = Math.cos(num1);
			}else if(f == "tan"){
				result = Math.tan(num1);
			}else if(f == "log"){
				result = Math.log(num1)/Math.log(num2);
			}else if(f == "min"){
				result = Math.min(num1,num2);
			}else if(f == "max"){
				result = Math.max(num1,num2);
			}else if(f == "abs"){
				result = Math.abs(num1);
			}
		}else {
			result = __number(exp);
		}
		return result;
	}
	
	function __number(exp){
		var values = new Array("0","1","2","3","4","5","6","7","8","9","."," ");
		var s = "";
		var pointCount = 0;
		if((values.indexOf(exp[iElement-1]) > -1 || exp[iElement-1] == ')' || exp[iElement-1] == '(') && (exp[iElement] == '-' || exp[iElement] == '+')){
			s += exp[iElement++];
		}
		while(values.indexOf(exp[iElement]) > -1 && iElement < exp.length){
			if(exp[iElement] == " "){
				iElement++;
				continue;
			}else if(exp[iElement] == "."){
				if(pointCount == 1) throw "Invalid element in column "+iElement.toString()+".";
				pointCount++;
			}
			s+= exp[iElement++];
		}
		if(parseFloat(s) != parseFloat(s)) throw "Invalid element in column "+iElement.toString()+".";
		return parseFloat(s)
	}
}