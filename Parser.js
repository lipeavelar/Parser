function Parser(exp){
	
	var variableValues = {};
	var expression;
	var iElement;
	
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
	 *Replace variables with their respective values
	*/
	function __replaceValues(){
		var result = expression;
		for(var key in variableValues){
			var regex = new RegExp("\\b"+key+"\\b", "g");
			result = result.replace(regex, variableValues[key]);
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
		factor  	= number | "(" expression ")"
		element 	= factor [{("^")} factor]
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
			}else if(exp[iElement] == "+"){
				iElement++;
				result -= __component(exp);
			}else if(exp[iElement] == ")"){
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
		if(exp[iElement] == "("){
			iElement++;
			result = __expression(exp);
			if(exp[iElement] != ")") throw "Missing ')' in column "+iElement.toString()+".";
			iElement++;
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