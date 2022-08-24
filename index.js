const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/topic/coronavirus',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/world/coronavirus-outbreak',
        base: ''

    },
    {
        name: 'telegraph',
        address: 'https://www.dailytelegraph.com.au/coronavirus',
        base: 'https://www.dailytelegraph.com.au'
    },
    {
        name: 'the age',
        address: 'https://www.theage.com.au/topic/coronavirus-pandemic',
        base: 'https://www.theage.com.au'
    },
    {
        name: 'un',
        address: 'https://www.un.org/coronavirus',
        base: ''
    },
    {
        name: 'dailymail',
        address: 'https://www.dailymail.co.uk/news/coronavirus',
        base: ''
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/topic/covid-19-pandemic',
        base: ''
    },
    {
        name: 'nypost',
        address: 'https://nypost.com/coronavirus',
        base: ''
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/news-event/coronavirus',
        base: ''
    }

]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("virus"), a:contains("Covid")', html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})



app.get('/', (req,res) => {
    res.json('API to scrape latest COVID news')
})

app.get('/news', (req,res) => {
    res.json(articles)
})

app.get('/news/:newspaperId',(req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("virus"), a:contains("Covid")', html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))

