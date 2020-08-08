
module.exports = (req, res, next, docs, count, collection, perPage, page) => {
    let pages = Math.ceil(count / perPage);
    let paging = {
        count: count,
        pages: pages,
        page: parseInt(page),
        limit: perPage
    };
    if (pages > 0) {
        if ((parseInt(page) === 1) && pages !== 1) {
            paging.next = `http://localhost:3000/api/${collection}?page=${(parseInt(page) + 1)}&limit=${perPage}`;
        } else if (page > 0 && page < pages) {
            paging.first = `http://localhost:3000/api/${collection}?page=1&limit=${perPage}`;
            paging.next = `http://localhost:3000/api/${collection}?page=${(parseInt(page) + 1)}&limit=${perPage}`;
            paging.previous = `http://localhost:3000/api/${collection}?page=${(parseInt(page) - 1)}&limit=${perPage}`;
        }
        if (page >= pages) {
            paging.first = `http://localhost:3000/api/${collection}?page=1&limit=${perPage}`;
            paging.previous = `http://localhost:3000/api/${collection}?page=${(parseInt(page) - 1)}&limit=${perPage}`;
        }
        docs = Object.assign({}, docs, paging);
    }
    res.status(200).json(docs);
};