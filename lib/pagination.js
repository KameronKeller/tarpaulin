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

  const queryParamsInUse = {}
  for (const [key, value] of Object.entries(queryParams)) {
    if (value) {
      queryParamsInUse[key] = value
    }
  }

  if (Object.keys(queryParamsInUse).length > 0) {
    links = addQueryParams(links, queryParamsInUse)
  }

  return {lastPage, links}
}

exports.getPaginationLinks = getPaginationLinks