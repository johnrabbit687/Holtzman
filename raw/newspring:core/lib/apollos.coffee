Apollos.name = "Apollos"


Apollos.createUser = (email, password, callback) ->

  __utils__.echo "create user"
  if !Meteor.isClient
    callback = undefined

  Accounts.createUser
    email: email
    password: password
  ,
    callback

  __utils__.echo Meteor.users.find().count()
  return


Apollos.upsertUserFromRock = (userLogin) ->

  user = Meteor.users.findOne
    "rock.userLoginId": userLogin.Id

  if not user and Apollos.Validation.isEmail userLogin.UserName
    tempPassword = String(Date.now() * Math.random())
    userId = Apollos.createUser userLogin.UserName, tempPassword
    user = Meteor.users.findOne userId

  if user
    set =
      "rock.personId": userLogin.PersonId
      "rock.guid": userLogin.Guid
      "rock.userLoginId": userLogin.Id

    if Apollos.Validation.isBcryptHash userLogin.ApollosHash
      set["services.password.bcrypt"] = userLogin.ApollosHash

    Meteor.users.update
      _id: user._id
    ,
      $set: set
