

###

  Apollos.user.translate

  @example take data from a service and format it for Apollos

    Apollos.user.translate([obj, platform])

  @param user [Object] existing object to be translated
  @param platform [String] platform to be translated to

###
Apollos.user.translate = (user, platform) ->

  # Default to Rock
  if !platform
    platform = Rock.name



  # forced uppercase to make case insensitive strings
  switch platform.toUpperCase()
    when "ROCK"
      # Grab existing user for merging if
      if user
        query = "rock.userLoginId": user.Id

        existingUser = Meteor.users.findOne(query)

        if !existingUser then existingUser = {}
      else
        # throws an error on the server
        # existingUser = Apollos.user()
        existingUser = {}
        user = Rock.user()


      # add rock property
      existingUser.rock = existingUser.rock or {}

      # map properties from Rock to Apollos
      existingUser.rock.personId = user.PersonId
      existingUser.rock.guid = user.Guid
      existingUser.rock.userLoginId = user.Id

      # If we have a vaildated email
      if Apollos.validate.isEmail user.UserName
        existingUser.emails = existingUser.emails or []
        existingUser.emails[0] = existingUser.emails[0] or {}
        existingUser.emails[0].address = user.UserName

      # if the password is a hashed thing
      if Apollos.validate.isBcryptHash user.ApollosHash
        existingUser.services = existingUser.services or {}
        existingUser.services.password = existingUser.services.password or {}
        existingUser.services.password.bcrypt = user.ApollosHash

      return existingUser



Apollos.user.delete = (user, platform) ->


  Apollos.users.remove(
    {
      _id: user._id
    },
    {
      justOne: true
    }
  )

###

  Apollos.user.update

  @example update a usr in apollos with data from Rock

    Apollos.user.translate([obj, platform])

  @param user [Object] existing user from other service to be updated
  @param platform [String] platform to be update from

###
Apollos.user.update = (user, platform) ->

  # platform doesn't do anything right now
  # eventually this will contain hooks for updating
  # Apollos from different services

  user = Apollos.user.translate(user)

  query =
    $or: [
      "rock.userLoginId": user.rock.userLoginId
    ]

  if user.emails and user.emails[0] and user.emails[0].address
    hasEmail = true
    query["$or"].push
      "emails.address": user.emails[0].address

  users = Meteor.users.find(query).fetch()

  if users.length > 1
    ids = []

    users.forEach (usr) ->
      ids.push usr._id

    throw new Meteor.Error "Rock sync issue", "User doc ids #{ids.join ", "}
      need investigated because they seem to be duplicates"

  else if users.length is 0 and hasEmail
    tempPassword = String(Date.now() * Math.random())
    userId = Apollos.user.create(user.emails[0].address, tempPassword)
    usr = Meteor.users.findOne userId

  else
    usr = users[0]

  if platform and platform.toUpperCase() is Rock.name.toUpperCase()
    user.updatedBy = Rock.name
  else
    user.updatedBy = Apollos.name

  # can't upsert with _id present
  delete user._id


  if usr

    Meteor.users.update
      _id: usr._id
    ,
      $set: user



###

  Update bindings

###
initializing = true
Apollos.users.find().observe({

  added: (doc) ->
    if initializing
      return
    if doc.updatedBy isnt "Rock" and doc.updatedBy
        Rock.user.create doc


  changed: (newDoc, oldDoc) ->

    if newDoc.updatedBy isnt "Rock"
      Rock.user.update newDoc


  removed: (doc) ->

    Rock.user.delete doc

    return

})
initializing = false
