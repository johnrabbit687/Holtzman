_addRegexTestFunction = (regex) ->
  funcName = "is#{regex.charAt(0).toUpperCase()}#{regex.slice(1)}"
  Apollos.validate[funcName] = (str) ->
    return Apollos.regex[regex].test str


Apollos.regex =

  email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  bcrypt: /^\$2a\$10\$[\/\.a-zA-Z0-9]{53}$/

  phoneNumber: /^[1-9]([0-9]{6}|[0-9]{9})$/

  guid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  visa: /^4[0-9]{12}(?:[0-9]{3})?$/

  mastercard: /^5[1-5][0-9]{14}$/

  americanExpress: /^3[47][0-9]{13}$/

  discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/


Apollos.addRegex = (obj) ->

  for key, value of obj
    Apollos.regex[key] = value

  return


Apollos.validate =

  isCreditCard: (str) ->
    return @.isVisa(str) or @.isMastercard(str) or
      @.isAmericanExpress(str) or @.isDiscover(str)


for regex of Apollos.regex
  _addRegexTestFunction regex
