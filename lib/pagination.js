function addQueryParams(links, queryParams) {
    const query = new URLSearchParams(queryParams).toString()
    for (const key of Object.keys(links)) {
        links[key] += query
    }
    return links
}

function getPaginationLinks(endpoint, page, pageSize, count, queryParams=null) {
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  let links = {};
  if (page < lastPage) {
    links.nextPage = `/${endpoint}?page=${page + 1}`;
    links.lastPage = `/${endpoint}?page=${lastPage}`;
  }
  if (page > 1) {
    links.prevPage = `/${endpoint}?page=${page - 1}`;
    links.firstPage = `/${endpoint}?page=1`;
  }
  if (queryParams) {
    links = addQueryParams(links, queryParams)
  }

  return {lastPage, links}
}

exports.getPaginationLinks = getPaginationLinks