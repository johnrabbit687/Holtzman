baseURL = "api/v1/"

Apollos.api.endpoints =
  user: "#{baseURL}users/"
  person: "#{baseURL}people/"
  # transaction: "#{baseURL}transactions/"
  # transactionDetail: "#{baseURL}transactionDetails/"
  account: "#{baseURL}accounts/"

jsonContentType = "application/JSON"
tokenName = Meteor.settings.api.tokenName
token = Meteor.settings.api.token
api = {}

if not tokenName or token
  return

###

  handleBadRequestError

  @example set the status code of an API request indicated it was a bad request

    HTTP.methods
      "api/v1/stuff":
        get: ->
          return handleBadRequestError.call this

  @param context should be the HTTP.methods handler function

###
handleBadRequestError = ->

  @.setStatusCode(400)
  return

###

  handleAuthenticationError

  @example set the status code of an API request indicated it was unauthorized

    HTTP.methods
      "api/v1/stuff":
        get: ->
          return handleAuthenticationError.call this

  @param context should be the HTTP.methods handler function

###
handleAuthenticationError = ->

  @.setStatusCode(401)
  return

###

  authenticate

  @example returns true if the request can be authenticated

    HTTP.methods
      "api/v1/stuff":
        get: ->
          if not authenticate.call this
            return handleAuthenticationError.call this

  @param context should be the HTTP.methods handler function

###
authenticate = ->

  sentToken = @.requestHeaders[tokenName]
  return sentToken is token

###

  deleteResource

  @example authenticates and then calls the delete handler

    return deleteResource.call @, Apollos.person.delete, plaform

  @param context should be the HTTP.methods handler function
  @param handlerFunc is the function that will delete the resource
  @param platform is the source of the request to delete the resource

###
deleteResource = (handlerFunc, platform) ->

  @.setContentType jsonContentType

  if not authenticate.call @
    return handleAuthenticationError.call @

  id = Number @.params.id
  handlerFunc id, platform
  return

###

  upsertResource

  @example authenticates and then calls the upsert handler

    return upsertResource.call @, data, Apollos.person.update, plaform

  @param context should be the HTTP.methods handler function
  @param data is the javascript object with the request data
  @param handlerFunc is the function that will upsert the resource
  @param platform is the source of the request to upsert the resource

###
upsertResource = (data, handlerFunc, platform) ->

  @.setContentType jsonContentType

  if not authenticate.call @
    return handleAuthenticationError.call @

  resource = parseRequestData data, @.requestHeaders["content-type"]


  if not resource
    resource = {}

  resource.Id = Number @.params.id
  handlerFunc resource, platform
  return

###

  createStandardEndpoint

  @example creartes a standard API endpoint at the given URL for the given
    entity

    createStandardEndpoint "api/v1/people/", "person"

  @param url [String] the endpoint for the API to operate at
  @param entityType [String] is the name of the Apollos type that this endpoint
    is associated with

###

# TODO build registration service for plaforms (how do we know who is calling?)
createStandardEndpoint = (url, entityType) ->
  api["#{url}:id"] =

    post: (data) ->

      Apollos.debug "Got POST for #{url}#{@.params.id}"
      return upsertResource.call @, data, Apollos[entityType].update, platform

    delete: (data) ->

      Apollos.debug "Got DELETE for #{url}#{@.params.id}"
      return deleteResource.call @, Apollos[entityType].delete, platform


for typeName, url of Apollos.api.endpoints
  createStandardEndpoint url, typeName

HTTP.methods api
