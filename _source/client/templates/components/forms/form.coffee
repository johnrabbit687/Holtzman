class Apollos.Forms.Form extends Apollos.Component
  @register "Apollos.Forms.Form"

  vars: -> [
    hasErrors: false
  ]

  onRendered: ->

    grandparent = @.parent().parent()
    grandparent.title?.set @.data().title
    grandparent.disabled?.set true
    grandparent.checkForValidated?()

  paramaterize: (string) ->
    string = string.trim()
    string = string.replace /[^a-zA-Z0-9-\s]/g, ''
    string = string.replace /[^a-zA-Z0-9-]/g, '-'
    string = string.toLowerCase()
    return string

