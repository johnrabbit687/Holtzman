###
  Schema used for validating give transaction data
###
giveTransactionSchema = new SimpleSchema(
  Email:
    type: String
    regEx: Apollos.regex.email
  AccountType:
    type: String
    regEx: /^(checking|savings|credit)$/
  'AmountDetails.TargetAccountId':
    type: Number
  'AmountDetails.Amount':
    type: Number
  AccountNumber:
    type: String
  RoutingNumber:
    type: String
    optional: true
    custom: ->
      'required' if @.field('accountType').value in ['checking', 'savings']
  CCV:
    type: String
    optional: true
    custom: ->
      'required' if @field('accountType').value == 'credit'
  ExpirationMonth:
    type: Number
    optional: true
    custom: ->
      'required' if @.field('accountType').value == 'credit'
  ExpirationYear:
    type: Number
    optional: true
    custom: ->
      'required' if @.field('accountType').value == 'credit'
  AccountId:
    type: Number
    optional: true
  PersonId:
    type: Number
    optional: true
  FirstName:
    type: String
  LastName:
    type: String
  Street1:
    type: String
  Street2:
    type: String
  City:
    type: String
  State:
    type: String
  PostalCode:
    type: String
  Country:
    type: String
  PhoneNumber:
    type: String
)

###

  Apollos.giveTransaction

  @example validate and pass transaction data to Rcok

    Apollos.giveTransation(data)

  @param data [Object] give transaction info. see schema

###

Apollos.giveTransaction = (data) ->

  giveContext = giveTransactionSchema.newContext()

  return false unless giveContext.validate(data)

  Rock.apiRequest "POST", "api/Give", data, (error, data) ->
    if error
      debug "Apollos give transaction failed:"
      debug error
      return false

    return true

