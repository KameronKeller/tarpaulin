function getPaginationLinks(endpoint, page, pageSize, count) {
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const links = {};
  if (page < lastPage) {
    links.nextPage = `/${endpoint}?page=${page + 1}`;
    links.lastPage = `/${endpoint}?page=${lastPage}`;
  }
  if (page > 1) {
    links.prevPage = `/${endpoint}?page=${page - 1}`;
    links.firstPage = `/${endpoint}?page=1`;
  }
  return {lastPage, links}
}

exports.getPaginationLinks = getPaginationLinks