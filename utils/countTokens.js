/**
 * Counts the number of tokens in a given text, considering 4 characters as one token.
 *
 * @param {string} text The input text.
 * @returns {number} The number of tokens in the text.
 */
function countTokens(text) {
    if (!text) {
      return 0;
    }
  
    // Remove leading and trailing whitespace
    const trimmedText = text.trim();
  
    // If the text is empty after trimming, return 0
    if (trimmedText === "") {
      return 0;
    }
    //adjust 4 to make adjust the token
    return Math.ceil(trimmedText.length / 4);
  }
  
  module.exports = countTokens;