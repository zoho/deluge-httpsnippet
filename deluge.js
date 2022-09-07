const CodeBuilder = require('httpsnippet/src/helpers/code-builder');

module.exports = function (source, options) {
  const opts = {
    indent: '  ',
    ...options,
  };

  const code = new CodeBuilder(opts.indent);
  let formattedQueryString = '';
  let isFile = false;
  let isReqBodyPresent = true;
  let isHeadersPresent = false;

  // Request data
  switch (source.postData.mimeType) {
    case 'application/json':
      if (source.postData.jsonObj) {
        const jsonString = JSON.stringify(source.postData.jsonObj);
        code.push(`parameters_data='${jsonString}';`);
      }
      break;
    case 'application/x-www-form-urlencoded':
      if (source.postData.params) {
        code.push('parameters_data = Map();');
        source.postData.params.forEach((param) => {
          code.push(`parameters_data.put("${param.name}", "${param.value}")`);
        });
      }
      break;
    case 'multipart/form-data':
      if (source.postData.params) {
        code.push('parameters_data = Map();');
        source.postData.params.forEach((param) => {
          if (param.fileName) {
            isFile = true;
          } else {
            code.push(`parameters_data.put("${param.name}", "${param.value}")`);
          }
        });
      }
      break;
    default:
      isReqBodyPresent = false;
      break;
  }

  if (isFile) {
    source.postData.params.forEach((param) => {
      if (param.fileName) {
        code.push(`files_data = {"paramName":"${param.name}","content":${param.fileName}}`);
      }
    });
  }

  // Headers
  if (source.headersObj) {
    let headerNames = Object.keys(source.headersObj);
    headerNames = headerNames.filter((headerName) => headerName !== 'content-type');
    if (headerNames.length) {
      isHeadersPresent = true;
      code.push('headers_data = Map();');
      headerNames.forEach((headerName) => {
        code.push(`headers_data.put("${headerName}", "${source.headersObj[headerName]}");`);
      });
    }
  }

  // Query Params
  if (source.queryString.length) {
    formattedQueryString += '?';
    source.queryString.forEach((query) => {
      formattedQueryString += `${query.name}=${query.value}&`;
    });
    formattedQueryString = formattedQueryString.slice(0, -1);
  }

  // InvokeUrl
  code.push('response = invokeUrl')
    .push('[');

  code.push(`url: "${source.url}${formattedQueryString}"`)
    .push(`type: ${source.method}`);

  if (isHeadersPresent) {
    code.push('headers: headers_data');
  }

  if (source.postData.mimeType) {
    code.push(`content-type: ${source.postData.mimeType}`);
  }

  if (isReqBodyPresent) {
    code.push('parameters: parameters_data');
  }

  if (isFile) {
    code.push('files: files_data');
  }
  code.push('connection: <connection_name>').push(']');
  code.push('info response;');
  return code.join();
};

module.exports.info = {
  key: 'deluge',
  title: 'Deluge',
  link: 'https://www.zoho.com/deluge/help/',
  description: 'Data Enriched Language for the Universal Grid Environment',
};
