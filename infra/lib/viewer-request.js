function handler(event) {
  var request = event.request;
  var uri = request.uri;
  /*__AUTH__*/

  if (uri === '/') {
    var header = request.headers['accept-language'];
    var value = header ? header.value : '';
    var first = value.split(',')[0].split(';')[0].trim().toLowerCase();
    var lang = first.indexOf('hr') === 0 ? 'hr' : 'en';
    return {
      statusCode: 302,
      statusDescription: 'Found',
      headers: {
        location: { value: '/' + lang + '/' },
      },
    };
  }

  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (uri.lastIndexOf('.') === -1) {
    request.uri += '/index.html';
  }

  return request;
}
