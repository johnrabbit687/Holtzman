addPerson = ->

  return false if !process.env.IS_MIRROR

  if Meteor.isServer

    Apollos.user.create 'apollos.person.keys@newspring.cc', 'testPassword'
    user = Apollos.users.findOne 'emails.address': 'apollos.person.keys@newspring.cc'
    Apollos.users.update
      _id: user._id
    ,
      $set:
        'rock.personId': 12345


    person =
      updatedBy: 'Apollos'
      personId: 12345
      givingGroupId: 1
      guid: '12345678-1234-1234-1234-123456789012'
      photoURL: 'http://newspring.cc'
      photoId: 1
      maritalStatusValueId: 1
      firstName: 'Jim'
      suffixValueId: 1
      titleValueId: 1
      lastName: 'Bo'
      middleName: 'Tiberius'
      gender: 1
      preferredEmail: 'jim@tiberius.bo'
      emailPreference: 1
      homePhone: '1123456789'
      workPhone: '1123456789'
      cellPhone: '1123456789'
      birthDay: 1
      birthMonth: 1
      birthYear: 2000
      weddingDay: 1
      weddingMonth: 1
      weddingYear: 2000
      personAliasIds: [1,2]
      recordStatusValueId: 1
      communicationPreference: 1

    Apollos.people.insert person

if process.env.IS_MIRROR
  addPerson()
