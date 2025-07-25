function trimText(text, maxLength = 200) {
  if (!text) return '';
  return text.length > maxLength
    ? text.slice(0, maxLength).trim() + '...'
    : text;
}

module.exports = {
    trimText
}