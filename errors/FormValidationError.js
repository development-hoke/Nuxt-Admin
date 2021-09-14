export default class FormValidationError extends Error {
  constructor(messages) {
    const cleanedMessages =
      typeof messages === 'string' ? { global: messages } : messages

    super(cleanedMessages[Object.keys(cleanedMessages)[0]])

    this.messages = cleanedMessages
  }

  getMessage(key = null) {
    if (key === null) {
      return this.messages[Object.keys(this.messages)[0]]
    }

    return this.messages[key]
  }
}
