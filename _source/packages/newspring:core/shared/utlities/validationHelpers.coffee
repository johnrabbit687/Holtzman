Apollos.validate =

  isEmail: (str) ->

    Apollos.regex.email.test str

  isBcryptHash: (str) ->

    Apollos.regex.bcrypt.test str

  isGuid: (str) ->

    Apollos.regex.guid.test str

  isPhoneNumber: (str) ->

    Apollos.regex.phoneNumber.test str