const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('1babbc5b85c54badbbc502384f3c8229');
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
const getallNews = async (req, res) => {
  newsapi.v2.topHeadlines({
    category: 'health',
    language: 'en',
    country: 'in'
  }).then(response => {
    // console.log(response);
    return res.status(200).json(response)
    /*
      {
        status: "ok",
        articles: [...]
      }
    */
  });
}

const getSearchNews = async (req, res) => {
  const { q:query } = req.query;
  newsapi.v2.everything({
    language: 'en',
    q: `${query} health`,
  }).then(response => {
    return res.status(200).json(response)
  });
}

// To query /v2/everything
// You must include at least one q, source, or domain
const getDeepSearch = async (req, res) => {
  newsapi.v2.everything({
    q: 'Skincare',
    //   sources: 'bbc-news,the-verge',
    //   domains: 'bbc.co.uk, techcrunch.com',
    //   from: '2017-12-01',
    //   to: '2017-12-12',
    language: 'en',
    sortBy: 'relevancy',
    //   page: 2
  }).then(response => {
    console.log(response);
    return res.status(200).json(response)
    /*
      {
        status: "ok",
        articles: [...]
      }
    */
  });
}


module.exports = {
  getallNews,
  getSearchNews,
  getDeepSearch
}