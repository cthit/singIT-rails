const fetchJson = (url, options = {}) =>
  fetch(url, options)
    .then(resp => {
      if (resp.ok) {
        return resp;
      } else {
        throw resp;
      }
    })
    .then(d => d.json());

export {fetchJson};
